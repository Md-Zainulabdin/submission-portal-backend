import { Router } from "express"

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from "../controllers/course.controller.js";

const router = Router();

router.use(isAuthenticated)
router.use(isAdmin)

// Course Routes
router.route('/create').post(createCourse)
router.route('/all').get(getAllCourses)
router.route('/:id').get(getCourseById)
router.route('/update/:id').put(updateCourse)
router.route('/delete/:id').delete(deleteCourse)

export default router;