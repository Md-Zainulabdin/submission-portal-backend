import { Teacher } from '../models/teacher.model.js';
import { Assignment } from '../models/assignment.model.js';
import { Student } from '../models/student.model.js';
import { Submission } from '../models/submission.model.js';
import sendEmail from "../config/nodemailer.config.js"
import bcrypt from 'bcrypt'

/**
 * @route POST /api/v1/teacher/register
 * @desc Register Teacher
 * @access public
 */

export const createTeacher = async (req, res) => {
    try {
        const {
            fullname, email, gender, cnic,
            batch, course,
            password,
        } = req.body;

        // Validate all required fields are present
        if (!fullname || !email || !gender || !cnic ||
            !batch || !course || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingTeacher = await Teacher.findOne({ email })

        if (existingTeacher) {
            return res.status(400).json({ message: "Teacher with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new teacher instance
        const newTeacher = new Teacher({
            fullname, email, gender, cnic,
            batch, course,
            password: hashedPassword,
        });

        // Save the teacher to the database
        await newTeacher.save();

        // Prepare the email content
        const text = 'Account Created';
        const subject = 'Your Teacher Account Has Been Created';
        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h3>Account Created</h3>
        <p>Dear ${fullname},</p>
        <p>Your teacher account has been successfully created.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>You can now access your account.</p>
        <p>Best regards,</p>
        <p><strong>SMIT Assignment Submission Portal Team</strong></p>
      </div>
    `;

        // Send email notification to the new teacher
        await sendEmail(email, subject, text, html);

        return res.status(201).json(newTeacher); // Return the newly created teacher
    } catch (error) {
        console.error("Error creating teacher:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @route GET /api/v1/admin/teacher/all
 * @desc GET all teacher
 * @access private
 */

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate('students')
            .populate('course', 'coursename city')
            .populate('batch', 'batchname batchcode time');
        return res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @route PUT /api/v1/teacher/assign-students/:teacherId
 * @desc Update Teacher and Assign Students
 * @access public
 */
export const assignStudents = async (req, res) => {
    const { teacherId } = req.params;
    const { studentIds } = req.body;

    try {
        // Validate teacherId
        if (!teacherId) {
            return res.status(400).json({ message: "Teacher ID is required." });
        }

        // Validate studentIds
        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: "Student IDs must be provided as an array." });
        }

        // Find teacher by ID
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: `Teacher with ID ${teacherId} not found.` });
        }

        // Validate each student ID and retrieve student data (name, id, email)
        const assignedStudents = [];
        for (const studentId of studentIds) {
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: `Student with ID ${studentId} not found.` });
            }
            assignedStudents.push({
                id: student._id,
                name: student.fullname,
                email: student.email
            });

            // Update student's teacher field
            student.teacher = teacherId;
            await student.save();
        }

        // Update teacher's students field with validated student IDs
        teacher.students = studentIds;

        // Save updated teacher to the database
        await teacher.save();

        // Return response with assigned student data
        return res.status(200).json({
            teacher: {
                id: teacher._id,
                fullname: teacher.fullname,
                email: teacher.email
            },
            assignedStudents
        });
    } catch (error) {
        console.error("Error updating teacher and assigning students:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route PUT /api/v1/teacher/update/:id
 * @desc Update Teacher
 * @access private
 */
export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            fullname, email, gender, cnic,
            batch, course, password,
        } = req.body;

        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        if (fullname) teacher.fullname = fullname;
        if (email) teacher.email = email;
        if (gender) teacher.gender = gender;
        if (cnic) teacher.cnic = cnic;
        if (batch) teacher.batch = batch;
        if (course) teacher.course = course;

        await teacher.save();

        return res.status(200).json(teacher);
    } catch (error) {
        console.error('Error updating teacher:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route DELETE /api/v1/teacher/delete/:id
 * @desc Delete Teacher
 * @access private
 */

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the teacher by ID
        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Find all assignments associated with the teacher
        const assignments = await Assignment.find({ assignedBy: id });

        // Delete all submissions related to each assignment
        for (const assignment of assignments) {
            await Submission.deleteMany({ assignment: assignment._id });
        }

        // Delete all assignments associated with the teacher
        await Assignment.deleteMany({ assignedBy: id });

        // Delete the teacher
        await Teacher.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Teacher and related assignments deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};