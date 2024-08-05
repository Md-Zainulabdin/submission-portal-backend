import { Student } from '../models/student.model.js';
import { Teacher } from '../models/teacher.model.js';
import { Assignment } from '../models/assignment.model.js';
import { Course } from '../models/course.modal.js';
import { Submission } from '../models/submission.model.js';

export const getWidgetData = async (req, res) => {
    const { id, role } = req.user;

    try {
        if (role === 'student') {
            const studentId = id;
            const student = await Student.findById(studentId);

            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            const totalSubmissions = await Submission.find({
                student: studentId,
                status: "approved"
            });

            const totalPoints = totalSubmissions.reduce((acc, submission) => acc + (submission.points || 0), 0);
            const totalAssignments = await Assignment.countDocuments({ assignedBy: student.teacher });
            const submittedAssignments = await Submission.countDocuments({ student: studentId });

            return res.json({
                total_points: totalPoints,
                total_assignment: totalAssignments,
                submitted_assignments: submittedAssignments,
            });
        } else if (role === 'teacher') {
            const teacherId = id;
            const totalStudents = await Student.countDocuments({ teacher: teacherId });
            const totalAssignments = await Assignment.countDocuments({ assignedBy: teacherId });

            // Get the current date
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);

            const dailySubmissions = await Submission.find({
                createdAt: { $gte: today, $lte: endOfToday },
                assignment: { $in: await Assignment.find({ assignedBy: teacherId }).select('_id') }
            }).populate('student assignment');

            return res.json({
                total_student: totalStudents,
                total_assignments: totalAssignments,
                daily_submissions: dailySubmissions
            });
        } else if (role === 'admin') {
            const totalTeachers = await Teacher.countDocuments();
            const totalStudents = await Student.countDocuments();
            const totalCourses = await Course.countDocuments();

            return res.json({
                total_teacher: totalTeachers,
                total_students: totalStudents,
                total_course: totalCourses
            });
        } else {
            return res.status(403).json({ message: 'Access denied.' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getLeaderboard = async (req, res) => {
    const { id, role } = req.user;

    try {
        let teacherId;

        if (role === 'student') {
            // Get the teacher ID of the current student
            const currentStudent = await Student.findById(id).populate('teacher');
            if (!currentStudent) {
                return res.status(404).json({ message: 'Student not found.' });
            }
            teacherId = currentStudent.teacher._id;
        } else if (role === 'teacher') {
            teacherId = id;
        } else {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const leaderboard = await Assignment.findMany({
            assignedBy: teacherId,
        }).populate("submissions", "points")

        return res.json(leaderboard);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};