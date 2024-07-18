import { Router } from "express"
import { createAssignment, deleteAssignment, getAllAssignments, getAssignmentById, updateAssignment } from "../controllers/assignment.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(isAuthenticated)

// Create Assignment
router.route('/create').post(createAssignment)

// Get All Assignments
router.route('/all').get(getAllAssignments)

// Get Assignment By Id
router.route('/:id').get(getAssignmentById)

// Update Assignment
router.route('/update/:id').put(updateAssignment)

// Delete Assignment
router.route('/:id').delete(deleteAssignment)

export default router;