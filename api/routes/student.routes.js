import { Router } from "express"
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { createStudent, getAllStudents } from "../controllers/student.controller.js";
import { getStudentSubmissions } from "../controllers/submission.controller.js";


const router = Router();

// Create Student
router.route('/register').post(createStudent)

router.use(isAuthenticated)

// Fetch All Student
router.route('/all').get(getAllStudents)

// Fetch Student Submission 
router.route('/submissions').put(getStudentSubmissions)

export default router;