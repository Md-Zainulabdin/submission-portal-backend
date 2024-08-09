import { Router } from "express"
import { getUserById, login } from "../controllers/auth.controller.js";

const router = Router();

// Login
router.route('/login').post(login)
router.route('/user/:id').get(getUserById)

export default router;