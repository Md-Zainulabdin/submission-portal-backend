import { Router } from "express"

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

import { createBatch, deleteBatch, getAllBatches, getBatchById, updateBatch } from "../controllers/batch.controller.js";

const router = Router();

router.use(isAuthenticated)
router.use(isAdmin)

// Batch Routes
router.route('/batch/create').post(createBatch)
router.route('/batch/all').get(getAllBatches)
router.route('/batch/:id').get(getBatchById)
router.route('/batch/update/:id').put(updateBatch)
router.route('/batch/delete/:id').delete(deleteBatch)

export default router;