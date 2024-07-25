import { Admin } from '../models/admin.model.js';
import bcrypt from 'bcrypt'

/**
 * @route POST /api/v1/admin/register
 * @desc Register admin
 * @access private
 */

export const createAdmin = async (req, res) => {
    try {
        const {
            name, email, cnic, password
        } = req.body;

        // Validate all required fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new admin instance
        const newAdmin = new Admin({
            name, email,
            password: hashedPassword,
        });

        // Save the admin to the database
        await newAdmin.save();

        return res.status(201).json(newAdmin); // Return the newly created admin
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};