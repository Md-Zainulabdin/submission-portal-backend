import { Router } from "express"

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getLeaderboard, getWidgetData } from "../controllers/dashboard.controller.js";


const router = Router();

router.use(isAuthenticated)

// Get Leaderboard Data
router.route('/leaderboard').get(getLeaderboard)

// Get Widget Data
router.route('/widget-data').get(getWidgetData)

export default router;