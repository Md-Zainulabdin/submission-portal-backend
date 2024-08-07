import { Router } from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { createStudent, deleteStudent, getStudentByTeacher } from "../controllers/student.controller.js";
import { getStudentSubmissions } from "../controllers/submission.controller.js";


const router = Router();

// Create Student
router.route('/register').post(createStudent)

router.use(isAuthenticated)

// Fetch All Student
router.route('/all').get(getStudentByTeacher)

// Delete Student
router.route('/delete/:id').delete(deleteStudent)

// Fetch Student Submission 
router.route('/submissions').put(getStudentSubmissions)

export default router;