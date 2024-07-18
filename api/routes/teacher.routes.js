import { Router } from "express"
import { assignStudents, createTeacher } from "../controllers/teacher.controller.js";


const router = Router();

// Create Teacher
router.route('/register').post(createTeacher)

// Assign Student to Teacher
router.route('/assign-students/:teacherId').put(assignStudents)

export default router;