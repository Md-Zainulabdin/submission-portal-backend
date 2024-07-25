import { Router } from "express"

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from "../controllers/course.controller.js";

const router = Router();

router.use(isAuthenticated)
router.use(isAdmin)

// Course Routes
router.route('/course/create').post(createCourse)
router.route('/course/all').get(getAllCourses)
router.route('/course/:id').get(getCourseById)
router.route('/course/update/:id').put(updateCourse)
router.route('/course/delete/:id').delete(deleteCourse)

export default router;