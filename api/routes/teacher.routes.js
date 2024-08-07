import { Router } from "express"
import { createTeacher, deleteTeacher, updateTeacher } from "../controllers/teacher.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Create Teacher
router.route('/register').post(createTeacher)

router.use(isAuthenticated)
router.use(isAdmin)

// Update Teacher
router.route('/update/:id').put(updateTeacher)

// Delete Teacher
router.route('/delete/:id').delete(deleteTeacher)


export default router;