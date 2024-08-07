import { Router } from "express"
import { createAdmin } from "../controllers/admin.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

import { assignStudents, getAllTeachers } from "../controllers/teacher.controller.js";
import { getAllStudents } from "../controllers/student.controller.js";


const router = Router();

// Create Admin
router.route('/register').post(createAdmin)

// Get All Students 
router.route('/teachers/all').get(getAllTeachers)

router.use(isAuthenticated)
router.use(isAdmin)

// Assign Student to Teacher
router.route('/assign-students/:teacherId').put(assignStudents)

// Get All Students 
router.route('/students/all').get(getAllStudents)


export default router;