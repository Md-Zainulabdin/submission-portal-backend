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

export default app;