import { Assignment } from '../models/assignment.model.js';
import { Submission } from '../models/submission.model.js';
import { Student } from '../models/student.model.js';
import sendEmail from "../config/nodemailer.config.js"

import mongoose from 'mongoose';

/**
 * @route POST /api/v1/assignment/create
 * @desc Create Assignment
 * @access private (only accessible to authenticated teachers)
 */

export const createAssignment = async (req, res) => {
    try {
        const { title, description, deadline, link, points } = req.body;

        // Teacher ID extracted from the authenticated token
        const teacherId = req.user.id;

        // Validate all required fields are present
        if (!title || !description || !deadline || !points) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create new assignment instance
        const newAssignment = new Assignment({
            title,
            description,
            deadline,
            link: link ?? "",
            assignedBy: teacherId,
            points,
        });

        // Fetch all students associated with the teacher
        const students = await Student.find({ teacher: teacherId });

        // Send an email to each student
        const emailPromises = students.map(student =>
            sendEmail(
                student.email,
                'New Assignment Alert: Get Ready for a Challenge! 🚀',
                'A new assignment has been created. Please check the portal for details.',
                `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>New Assignment Alert!</h2>
                    <p>Dear ${student.fullname},</p>
                    <p>We are excited to inform you that a new assignment <strong>${title}</strong> has been created by your teacher. Please check the portal for further details and make sure to complete it by the deadline.</p>
                    <ul>
                        <li><strong>Title:</strong> ${title}</li>
                        <li><strong>Description:</strong> ${description}</li>
                        <li><strong>Deadline:</strong> ${deadline}</li>
                        <li><strong>Points:</strong> ${points}</li>
                    </ul>
                    <p>You can access the assignment <a href="${link}">here</a>.</p>
                    <p>Best of luck!</p>
                    <p>Kind regards,</p>
                    <p>Your Teaching Team</p>
                </div>
                `
            )
        );

        // Wait for all email promises to resolve
        await Promise.all(emailPromises);

        // Save the assignment to the database
        await newAssignment.save();

        return res.status(201).json(newAssignment);
    } catch (error) {
        console.error("Error creating assignment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route GET /api/v1/assignment/all
 * @desc Get all assignments based on user role (teacher or student)
 * @access private (only accessible to authenticated users)
 */

export const getAllAssignments = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `id` is the key holding user ID in the decoded token
        const userRole = req.user.role; // Assuming `role` is the key holding user role in the decoded token

        let assignments = [];

        if (userRole === 'teacher') {
            // Fetch assignments created by the teacher
            assignments = await Assignment.find({ assignedBy: userId });
        } else if (userRole == "student") {
            // Fetch assignments assigned to the student
            const student = await Student.findById(userId)
            if (student) {
                assignments = await Assignment.find({ assignedBy: student?.teacher });
            } else {
                return res.status(404).json({ message: "Student not found." });
            }
        }

        return res.status(200).json(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route GET /api/v1/assignment/:id
 * @desc Get assignments based on ID
 * @access private (only accessible to authenticated users)
 */

export const getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid assignment ID' });
        }

        const assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        return res.status(200).json(assignment);
    } catch (error) {
        console.error("Error fetching assignment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route PUT /api/v1/assignment/:id
 * @desc Update assignment details (teacher only)
 * @access private (only accessible to authenticated teachers)
 */

export const updateAssignment = async (req, res) => {
    const { id } = req.params; // Assignment ID from route parameter
    const { deadline, status, title, description, link, points } = req.body; // Fields that can be updated

    try {
        // Check if assignment exists
        let assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Ensure only the assigned teacher can update the assignment
        if (!req.user || req.user.role !== 'teacher' || req.user.id !== assignment.assignedBy.toString()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Update allowable fields
        if (deadline) {
            assignment.deadline = deadline;
        }
        if (title) {
            assignment.title = title;
        }
        if (description) {
            assignment.description = description;
        }
        if (link) {
            assignment.link = link;
        }
        if (points) {
            assignment.points = points;
        }

        if (status && ['open', 'closed'].includes(status)) {
            assignment.status = status;
        }

        // Save updated assignment
        await assignment.save();

        return res.status(200).json(assignment);
    } catch (error) {
        console.error("Error updating assignment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route DELETE /api/v1/assignment/:id
 * @desc Delete an assignment (teacher only)
 * @access private (only accessible to authenticated teachers)
 */

export const deleteAssignment = async (req, res) => {
    const { id } = req.params; // Assignment ID from route parameter

    try {
        // Check if assignment exists
        let assignment = await Assignment.findById(id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Ensure only the assigned teacher can delete the assignment
        if (!req.user || req.user.role !== 'teacher' || req.user.id !== assignment.assignedBy.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete all submissions associated with the assignment
        await Submission.deleteMany({ assignment: id });

        // Delete the assignment from the database
        await Assignment.deleteOne({ _id: id });

        return res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error("Error deleting assignment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};