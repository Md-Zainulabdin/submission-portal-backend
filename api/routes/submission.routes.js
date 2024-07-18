import { Router } from "express"
import { createSubmission, getSubmissionHistory, getSubmissionsForAssignment, updateSubmissionSeenStatus, updateSubmissionStatusAndMark } from "../controllers/submission.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(isAuthenticated)

// Create Submission
router.route('/create').post(createSubmission)

// Fetch Submission History for Student
router.route('/history').get(getSubmissionHistory)

// Fetch Submission base on Assingnment
router.route('/:assignmentId').get(getSubmissionsForAssignment)

// Update Submission
router.route('/:submissionId/update').put(updateSubmissionStatusAndMark)

// Update Submission Status
router.route('/:submissionId/seen').put(updateSubmissionSeenStatus)

export default router;