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
            fullname, email, gender, cnic, phone, dateOfBirth, address,
            fatherName, fatherCnic, campus, course, classPreference, picture, hasLaptop, password
        } = req.body;

        // Validate all required fields are present
        if (!fullname || !email || !gender || !cnic || !phone || !dateOfBirth || !address ||
            !fatherName || !fatherCnic || !campus || !course || !classPreference || !password || !picture || hasLaptop === undefined) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new student instance
        const newStudent = new Student({
            fullname, email, gender, cnic, phone, dateOfBirth, address,
            fatherName, fatherCnic, campus, course, classPreference, picture, hasLaptop,
            password: hashedPassword,
            role: "student",
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
        const students = await Student.find({ teacher: teacherId });
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
        const students = await Student.find();
        return res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};