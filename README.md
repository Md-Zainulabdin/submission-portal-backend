SMIT Assignment Submission Portal - Backend
Welcome to the backend of the SMIT Assignment Submission Portal. This backend is built using Node.js, Express.js, and MongoDB, with authentication handled by JSON Web Tokens (JWT).

Table of Contents
Features
Technologies Used
Installation
Environment Variables
API Endpoints
Authentication
Contributing
License
Features
User authentication and authorization
CRUD operations for assignments
CRUD operations for submissions
Role-based access control (students and teachers)
Secure password hashing
Token-based authentication with JWT
Detailed error handling
Technologies Used
Node.js: JavaScript runtime for server-side programming
Express.js: Web framework for Node.js
MongoDB: NoSQL database
Mongoose: ODM for MongoDB
jsonwebtoken: For handling JWT authentication
Installation
Clone the repository:

sh
Copy code
git clone https://github.com/yourusername/smit-assignment-portal.git
cd smit-assignment-portal/backend
Install dependencies:

sh
Copy code
npm install
Set up environment variables: Create a .env file in the root directory and add the necessary environment variables (see below for required variables).

Start the server:

sh
Copy code
npm start
Environment Variables
Create a .env file in the root of your project and add the following environment variables:

env
Copy code
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
API Endpoints
Authentication
Register: POST /api/v1/auth/register
Login: POST /api/v1/auth/login
Assignments
Create Assignment: POST /api/v1/assignments (Teacher only)
Get All Assignments: GET /api/v1/assignments
Get Assignment by ID: GET /api/v1/assignments/:id
Update Assignment: PUT /api/v1/assignments/:id (Teacher only)
Delete Assignment: DELETE /api/v1/assignments/:id (Teacher only)
Submissions
Create Submission: POST /api/v1/submissions
Get All Submissions: GET /api/v1/submissions
Get Submission by ID: GET /api/v1/submissions/:id
Update Submission: PUT /api/v1/submissions/:id (Teacher only)
Delete Submission: DELETE /api/v1/submissions/:id
Authentication
Authentication is handled using JSON Web Tokens (JWT). Upon successful login or registration, a token is returned which must be included in the Authorization header of requests that require authentication.

Example
sh
Copy code
Authorization: Bearer your_jwt_token
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

Fork the repository
Create a new branch: git checkout -b my-feature-branch
Commit your changes: git commit -m 'Add some feature'
Push to the branch: git push origin my-feature-branch
Submit a pull request
License
This project is licensed under the MIT License - see the LICENSE file for details.

