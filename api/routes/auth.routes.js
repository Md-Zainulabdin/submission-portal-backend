import { Router } from "express"
import { login } from "../controllers/auth.controller.js";

const router = Router();

// Login
router.route('/login').post(login)

export default router;