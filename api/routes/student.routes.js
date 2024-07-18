import { Router } from "express"
import { createStudent, getAllStudents } from "../controllers/student.controller.js";

const router = Router();

router.route('/register').post(createStudent)

router.route('/all').get(getAllStudents)


export default router;