# 🚀 FastAPI Task Management System

A full-stack **Task Management System** built using **FastAPI, React (Vite), MongoDB Atlas, JWT Authentication, and Role-Based Access Control (RBAC)**.

The project allows users to register, log in securely, create and manage their own tasks, while providing an **Admin Panel** to monitor users, view their tasks, send policy warnings, and manage the platform.

---

# 📌 Features

## 👤 User Authentication

* User Signup
* User Login
* JWT Access Token Authentication
* Refresh Token Authentication
* Protected APIs using OAuth2
* Secure Route Protection

---

# 🔐 Role Based Access Control (RBAC)

Two roles are implemented:

### User

* Login
* Create Tasks
* Update Tasks
* Delete Own Tasks
* View Own Tasks

### Admin

* View All Users
* Delete Users
* View Tasks of Any User
* Send Warning Email to Users
* Monitor User Activities

---

# 🗄 Database

MongoDB Atlas is used as the cloud database.

Collections:

* users
* tasks

Relationship:

* Each task stores the **user_id** as a foreign key.
* One User → Multiple Tasks

---

# ⚙ Backend (FastAPI)

Implemented APIs:

## Authentication

* POST /signup
* POST /login
* POST /refresh_token

## User APIs

* GET /users
* DELETE /users/{id}

## Task APIs

* GET /tasks
* POST /tasks
* PUT /tasks/{task_id}
* DELETE /tasks/{task_id}

## Admin APIs

* GET /admin/user/{user_id}
* GET /admin/tasks/{id}
* POST /send-warning/{task_id}

---

# 🔑 JWT Authentication

The project uses JWT Tokens.

* Access Token
* Refresh Token
* Token Validation
* Protected Routes

Refresh Token is used to generate a new Access Token without requiring the user to log in again.

---

# 🖥 Frontend (React + Vite)

Frontend pages include:

* Login Page
* Signup Page
* User Task Page
* Admin Dashboard
* User Notes Page

React Hooks used:

* useState
* useEffect
* useNavigate
* useParams

---

# 👨‍💼 Admin Dashboard

The Admin Panel allows:

* View all registered users
* Delete users
* Open any user's task list
* View all tasks
* Send policy warning to a user

---

# 📧 Warning Email System

Admin can send a warning message to users whose task violates platform policy.

Example warning:

> Your task violates our policy.
>
> Please delete it immediately.
>
> Failure to do so may result in strict action against your account.

The project supports sending warning emails using Python's **smtplib** and Gmail SMTP.

---

# 🔄 Token Refresh System

Implemented Refresh Token functionality:

* Access Token expires after a fixed time
* Refresh Token generates a new Access Token
* User remains logged in without logging in again

---

# 🔥 Technologies Used

### Backend

* FastAPI
* Python
* JWT
* OAuth2
* Pydantic
* smtplib

### Frontend

* React
* Vite
* TypeScript
* Bootstrap

### Database

* MongoDB Atlas

### Authentication

* JWT Authentication
* Refresh Tokens

---

# 📂 Project Structure

```
FastAPI-Project/

│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── ...
│
├── main.py
├── database.py
├── .env
├── requirements.txt
└── README.md
```

---

# 🚀 Future Improvements

* Password Hashing (bcrypt)
* Email Verification
* Forgot Password
* Task Categories
* Task Search
* Pagination
* Admin Analytics Dashboard
* User Profile Management

---

# 📚 What I Learned

During this project, I learned:

* Building REST APIs with FastAPI
* MongoDB Atlas Integration
* JWT Authentication
* Refresh Token Implementation
* OAuth2 Security
* Role-Based Authentication
* CRUD Operations
* React API Integration
* State Management with Hooks
* Route Protection
* Foreign Key Relationships in MongoDB
* Sending Emails using SMTP
* Admin Dashboard Development
* Full Stack Application Development

---

# 🎯 Project Goal

The goal of this project is to build a secure full-stack task management application where users can manage their own tasks while administrators can monitor platform activities and enforce platform policies through an admin dashboard and warning notification system.
