import { Router } from "express"
import { getAllStudents } from "../controllers/student.controller.js";

const router = Router();

router.route('/all').get(getAllStudents)


export default router;