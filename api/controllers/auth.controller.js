import jwt from 'jsonwebtoken';
import { Teacher } from '../models/teacher.model.js';
import { Student } from '../models/student.model.js';
import bcrypt from 'bcrypt'

/**
 * @route POST /api/v1/auth/login
 * @desc Login
 * @access public
 */

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        let user = await Teacher.findOne({ email: email });

        if (!user) {
            user = await Student.findOne({ email: email });
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
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
                name: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}