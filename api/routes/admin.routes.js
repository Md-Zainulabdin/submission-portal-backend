import { Router } from "express"
import { createAdmin } from "../controllers/admin.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from "../controllers/course.controller.js";
import { createBatch, deleteBatch, getAllBatches, getBatchById, updateBatch } from "../controllers/batch.controller.js";

import { assignStudents } from "../controllers/teacher.controller.js";


const router = Router();

// Create Admin
router.route('/register').post(createAdmin)

router.use(isAuthenticated)
router.use(isAdmin)

// Assign Student to Teacher
router.route('/assign-students/:teacherId').put(assignStudents)

// Course Routes
router.route('/course/create').post(createCourse)
router.route('/course/all').get(getAllCourses)
router.route('/course/:id').get(getCourseById)
router.route('/course/update/:id').put(updateCourse)
router.route('/course/delete/:id').delete(deleteCourse)

// Batch Routes
router.route('/batch/create').post(createBatch)
router.route('/batch/all').get(getAllBatches)
router.route('/batch/:id').get(getBatchById)
router.route('/batch/update/:id').put(updateBatch)
router.route('/batch/delete/:id').delete(deleteBatch)



export default router;