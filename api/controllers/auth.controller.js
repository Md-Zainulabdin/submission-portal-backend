import jwt from 'jsonwebtoken';
import { Teacher } from '../models/teacher.model.js';
import { Student } from '../models/student.model.js';
import { Admin } from '../models/admin.model.js';
import bcrypt from 'bcrypt'

/**
 * @route POST /api/v1/auth/login
 * @desc Login
 * @access public
 */

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        let user = await Teacher.findOne({ email: email });

        if (!user) {
            user = await Student.findOne({ email: email });
        }

        if (!user) {
            user = await Admin.findOne({ email: email });
        }

        if (!user) {
            return res.status(400).json({ message: 'No user found with the provided email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect Password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name || user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @route POST /api/v1/auth/user/:id
 * @desc get user by id
 * @access public
 */

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        let user = await Teacher.findById(id)
            .populate('course', 'coursename city')
            .populate('batch', 'batchname batchcode time');

        if (!user) {
            user = await Student.findById(id)
                .populate('course', 'coursename city')
                .populate('batch', 'batchname batchcode time');
        }

        if (!user) {
            user = await Admin.findById(id);
        }

        if (!user) {
            return res.status(400).json({ message: 'No user found' });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}