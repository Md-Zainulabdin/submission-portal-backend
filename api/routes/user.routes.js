import { Router } from "express"

const router = Router();

const fakeUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com" },
  { id: 4, name: "Bob Brown", email: "bob@example.com" }
];

router.get('/all', (req, res) => {
  res.json(fakeUsers);
});

export default router;