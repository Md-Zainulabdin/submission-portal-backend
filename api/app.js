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

app.use("/api/v1/users", userRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/student', studentRoutes)
app.use('/api/v1/teacher', teacherRoutes)
app.use('/api/v1/assignment', assignmentRoutes)
app.use('/api/v1/submission', submissionRoutes)

export default app;