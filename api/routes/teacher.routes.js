import { Router } from "express"
import { createTeacher } from "../controllers/teacher.controller.js";


const router = Router();

// Create Teacher
router.route('/register').post(createTeacher)


export default router;