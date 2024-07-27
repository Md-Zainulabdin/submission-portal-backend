import cors from 'cors'; // Cross-Origin Resource Sharing
import express from 'express';

const app = express();

// Middleware configuration
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handling
app.get('/', (req, res) => {
  res.send('Hello from server');
});

// Import Routes
import studentRoutes from "./routes/student.routes.js"
import teacherRoutes from "./routes/teacher.routes.js"
import authRoutes from "./routes/auth.routes.js"
import assignmentRoutes from "./routes/assignment.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import courseRoutes from "./routes/course.routes.js"
import batchRoutes from "./routes/batch.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/student', studentRoutes)
app.use('/api/v1/teacher', teacherRoutes)
app.use('/api/v1/assignment', assignmentRoutes)
app.use('/api/v1/submission', submissionRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/batch', batchRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)

export default app;