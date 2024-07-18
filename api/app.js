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

// Routes Import
import userRoutes from "./routes/user.routes.js"
import studentRoutes from "./routes/student.routes.js"

app.use('/api/v1/student', studentRoutes)
app.use("/api/v1/", userRoutes)

export default app;