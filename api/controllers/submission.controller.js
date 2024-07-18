import { Submission } from '../models/submission.model.js';
import { Assignment } from '../models/assignment.model.js';

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

        if (existingSubmission && existingSubmission.canResubmit == false) {
            return res.status(400).json({ message: 'You have already submitted this assignment' });
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
            updateFields = { ...updateFields, rejectionReason, isApproved: false, isSeen: true, canResubmit };
        } else if (status === 'approved') {
            if (!points || !feedback) {
                return res.status(400).json({ message: 'Points and feedback are required for approval' });
            }
            updateFields = { ...updateFields, points, feedback, isApproved: true, isSeen: true };
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