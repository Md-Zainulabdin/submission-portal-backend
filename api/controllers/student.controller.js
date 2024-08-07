import { Student } from '../models/student.model.js';
import bcrypt from 'bcrypt'

/**
 * @route POST /api/v1/student/register
 * @desc Register Student
 * @access public
 */

export const createStudent = async (req, res) => {
    try {
        const {
            fullname, email, gender, cnic,
            city, course, batch, teacher, hasLaptop, password
        } = req.body;

        // Validate all required fields are present
        if (!fullname || !email || !gender || !cnic || !city ||
            !course || !batch || !teacher || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingStudent = await Student.findOne({ email })

        if (existingStudent) {
            return res.status(400).json({ message: "Student with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        // Create new student instance
        const newStudent = new Student({
            fullname, email, gender, cnic,
            city, course, batch, teacher, hasLaptop,
            password: hashedPassword,
        });

        // Save the student to the database
        await newStudent.save();

        return res.status(201).json(newStudent); // Return the newly created student
    } catch (error) {
        console.error("Error creating student:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @route GET /api/v1/student/all
 * @desc GET all student of teacher
 * @access private
 */

export const getStudentByTeacher = async (req, res) => {
    try {
        const role = req.user.role;
        const teacherId = req.user.id;

        if (role !== 'teacher') {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        // Find students assigned to the logged-in teacher
        const students = await Student.find({ teacher: teacherId })
            .populate('course', 'coursename city')
            .populate('batch', 'batchname batchcode time');
        return res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route GET /api/v1/admin/student/all
 * @desc GET all student 
 * @access private
 */

export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate('course', 'coursename city')
            .populate('batch', 'batchname batchcode time');
        return res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route DELETE /api/v1/student/delete/:id
 * @desc Delete Student
 * @access private
 */

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the student by ID
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await Student.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting Student:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};