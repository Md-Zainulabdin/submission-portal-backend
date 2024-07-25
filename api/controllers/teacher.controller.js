import { Teacher } from '../models/teacher.model.js';
import { Student } from '../models/student.model.js';
import bcrypt from 'bcrypt'

/**
 * @route POST /api/v1/teacher/register
 * @desc Register Teacher
 * @access public
 */

export const createTeacher = async (req, res) => {
    try {
        const {
            fullname, email, gender, cnic, phone, dateOfBirth, address,
            batch, course, picture,
            password,
        } = req.body;

        // Validate all required fields are present
        if (!fullname || !email || !gender || !cnic || !phone || !dateOfBirth || !address ||
            !batch || !course || !picture || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new teacher instance
        const newTeacher = new Teacher({
            fullname, email, gender, cnic, phone, dateOfBirth, address,
            batch, course, picture,
            password: hashedPassword,
            role: "teacher",
        });

        // Save the teacher to the database
        await newTeacher.save();

        return res.status(201).json(newTeacher); // Return the newly created teacher
    } catch (error) {
        console.error("Error creating teacher:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @route GET /api/v1/teacher/all
 * @desc GET all teacher
 * @access private
 */

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate('students')
            .populate('course', 'coursename city')
            .populate('batch', 'batchname batchcode');
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