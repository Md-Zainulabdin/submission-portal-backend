import { Submission } from '../models/submission.model.js';
import { Student } from '../models/student.model.js';
import { Assignment } from '../models/assignment.model.js';
import sendEmail from "../config/nodemailer.config.js"

import mongoose from 'mongoose';

/**
 * @route POST /api/v1/submission/create
 * @desc Create a new submission (student only)
 * @access private (only accessible to authenticated students)
 */
export const createSubmission = async (req, res) => {
    try {
        const { assignmentId, url } = req.body;

        // Validate required fields
        if (!assignmentId || !url) {
            return res.status(400).json({ message: 'Assignment ID and URL are required' });
        }

        // Assume student ID is obtained from authenticated token
        const studentId = req.user.id;

        // Check if the student has already submitted this assignment
        const existingSubmission = await Submission.findOne({ assignment: assignmentId, student: studentId });

        if (existingSubmission) {
            if (existingSubmission.canResubmit) {
                // Update the existing submission with the new URL
                existingSubmission.url = url;
                existingSubmission.status = "pending";
                existingSubmission.canResubmit = false;
                const updatedSubmission = await existingSubmission.save();
                return res.status(201).json(updatedSubmission); // Return the updated submission
            } else {
                return res.status(400).json({ message: 'You have already submitted this assignment' });
            }
        }

        const assignment = await Assignment.findById(assignmentId);

        if (assignment.status === 'closed') {
            return res.status(400).json({ message: 'This Assignment is closed' });
        }

        // Create new submission instance
        const newSubmission = new Submission({
            assignment: assignmentId,
            student: studentId,
            url,
        });

        // Save the submission to the database
        const savedSubmission = await newSubmission.save();

        // Add the submission ID to the assignment's submissions array
        assignment.submissions.push(savedSubmission._id);
        await assignment.save();

        return res.status(201).json(savedSubmission); // Return the newly created submission
    } catch (error) {
        console.error('Error creating submission:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @route GET /api/v1/submission/:assignmentId
 * @desc Get all submissions for a specific assignment (teacher only)
 * @access private (only accessible to authenticated teachers)
 */

export const getSubmissionsForAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return res.status(400).json({ message: 'Invalid Assignment ID' });
        }

        // Find all submissions for the specified assignment
        const submissions = await Submission.find({ assignment: assignmentId })
            .populate('student', 'fullname email')
            .populate('assignment', 'title description points')

        return res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @route GET /api/v1/submission/history
 * @desc Get all submissions for a specific assignment (student only)
 * @access private (only accessible to authenticated teachers)
 */

export const getSubmissionHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid Student ID' });
        }

        // Find all submissions for the specified assignment
        const submissions = await Submission.find({ student: userId })
            .populate('student', 'fullname email')
            .populate('assignment', 'title description points')

        return res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @route PUT /api/v1/submission/:submissionId/update
 * @desc Update submission status and mark (teacher only)
 * @access private (only accessible to authenticated teachers)
 */

export const updateSubmissionStatusAndMark = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { status, points, feedback, rejectionReason, canResubmit } = req.body;

        // Validate required fields based on status
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        let updateFields = { status };

        if (status === 'disapproved') {
            if (!rejectionReason) {
                return res.status(400).json({ message: 'Reason is required for disapproval' });
            }
            updateFields = { ...updateFields, rejectionReason, isApproved: false, isSeen: true, canResubmit, points: 0, feedback: "" };
        } else if (status === 'approved') {
            if (!points || !feedback) {
                return res.status(400).json({ message: 'Points and feedback are required for approval' });
            }
            updateFields = { ...updateFields, points, feedback, isApproved: true, isSeen: true, canResubmit: false, rejectionReason: '' };
        }

        // Update submission
        const updatedSubmission = await Submission.findByIdAndUpdate(
            submissionId,
            updateFields,
            { new: true }
        );

        if (!updatedSubmission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Check if the submission status is disapproved
        if (status === 'disapproved') {
            // Fetch the student details
            const student = await Student.findById(updatedSubmission.student);

            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            // Prepare the email content
            const text = 'Submission Update'

            const subject = canResubmit
                ? 'Submission Update: Disapproved, but Resubmission is Allowed!'
                : 'Important: Your Submission Has Been Disapproved';

            const html = `
           <div style="font-family: Arial, sans-serif; line-height: 1.6;">
               <h3>Submission Update</h3>
               <p>Dear ${student.fullname},</p>
               <p>We regret to inform you that your submission has been <span style="color: #D9534F;">disapproved</span> by your teacher.</p>
               <p><strong>Reason for disapproval:</strong> ${rejectionReason}</p>
               ${canResubmit
                    ? `<p>However, you are <strong>allowed to resubmit</strong> the assignment. Please make the necessary improvements and resubmit it at your earliest convenience.</p>`
                    : `<p>Unfortunately, you are not allowed to resubmit the assignment. Please reach out to your teacher if you have any questions or need further clarification.</p>`
                }
               <p>Best regards,</p>
               <p><strong>SMIT Assignment Submission Portal Team</strong></p>
           </div>
       `;

            // Send email notification to the student
            await sendEmail(student.email, subject, text, html);
        }

        return res.status(200).json(updatedSubmission);
    } catch (error) {
        console.error("Error updating submission:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @route PUT /api/v1/submission/:submissionId/seen
 * @desc Update submission seen status (teacher only)
 * @access private (only accessible to authenticated teachers)
 */

export const updateSubmissionSeenStatus = async (req, res) => {
    try {
        const { submissionId } = req.params;

        // Update isSeen to true
        const updatedSubmission = await Submission.findByIdAndUpdate(submissionId, {
            isSeen: true
        }, { new: true });

        if (!updatedSubmission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        return res.status(200).json(updatedSubmission);
    } catch (error) {
        console.error("Error updating submission seen status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


/**
 * @route GET /api/v1/student/submissions
 * @desc Get all submissions for a specific student
 * @access private (only accessible to authenticated students)
 */

export const getStudentSubmissions = async (req, res) => {
    try {
        const studentId = req.user.id; // Assuming the student ID is retrieved from authentication

        // Find all submissions for the student
        const submissions = await Submission.find({ student: studentId })
            .populate('assignment', 'title deadline') // Populate assignment details (title, deadline)
            .populate('teacher', 'fullname'); // Populate teacher details (fullname)

        if (!submissions) {
            return res.status(404).json({ message: 'No submissions found for this student' });
        }

        // Format the response to include necessary details
        const formattedSubmissions = submissions.map(submission => ({
            id: submission._id,
            assignment: {
                id: submission.assignment._id,
                title: submission.assignment.title,
                deadline: submission.assignment.deadline
            },
            marks: submission.marks,
            status: submission.status,
            isSeen: submission.isSeen,
            feedback: submission.feedback
        }));

        return res.status(200).json(formattedSubmissions);
    } catch (error) {
        console.error("Error fetching student submissions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};