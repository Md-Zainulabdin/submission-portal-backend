import { Router } from "express"

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

import { createBatch, deleteBatch, getAllBatches, getBatchById, updateBatch } from "../controllers/batch.controller.js";

const router = Router();
router.route('/all').get(getAllBatches)

router.use(isAuthenticated)
router.use(isAdmin)

// Batch Routes
router.route('/create').post(createBatch)
router.route('/:id').get(getBatchById)
router.route('/update/:id').put(updateBatch)
router.route('/delete/:id').delete(deleteBatch)

export default router;