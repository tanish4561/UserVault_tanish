# 🚀 UserVault – EmployWise Assignment

A React-based user management application built as part of the **EmployWise Assignment**, demonstrating authentication, user listing, editing, and deletion functionalities using the [Reqres API](https://reqres.in/).

---

## 🌐 Live Demo

🔗 https://uservaulttanish.vercel.app/login

## 📂 GitHub Repository

🔗 https://github.com/tanish4561/UserVault_tanish

---

## 📄 Assignment Overview

This project covers all three levels of the EmployWise assignment:

### Level 1 – Authentication

- Basic login screen with email & password input.
- Login validation using **POST /api/login** endpoint.
- On successful login, token is stored in **localStorage**.
- User is redirected to the Users List page.

**Test Credentials:**
- Email: eve.holt@reqres.in
- Password: cityslicka

---

### Level 2 – Users List

- Fetch and display paginated list of users using **GET /api/users?page=1** endpoint.
- Display user's first name, last name, and avatar.
- Pagination implemented for multiple pages.

---

### Level 3 – Edit, Delete & Update Users

- Edit User:
  - Opens pre-filled form to update user's details.
  - Data updated using **PUT /api/users/{id}** endpoint.
- Delete User:
  - Deletes user using **DELETE /api/users/{id}** endpoint.
  - User is removed from the UI instantly.
- Displays success/error messages for all actions.

---

## 🌟 Bonus Features Implemented

- React Router used for navigation & protected routes.
- Error handling for API responses.
- Form validation on Login & Edit screens.
- Responsive & clean UI using Tailwind CSS.
- Well-structured and reusable component architecture.

---

## 🛠️ Tech Stack

- React
- React Router
- Axios
- Tailwind CSS
- Reqres API

---

## 🚀 Getting Started

1. **Clone the Repository**
```bash
git clone https://github.com/tanish4561/UserVault_tanish.git
cd UserVault_tanish
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run the App Locally**
```bash
npm start
```

---

## 📂 Project Structure

- src/
  - components/
    - Login.jsx
    - UsersList.jsx
    - EditUser.jsx
    - ProtectedRoute.jsx
  - App.jsx
  - index.css
  - utils/
    - api.js

---

## 🔐 Token Persistence & Protected Routes

- Login token is saved in **localStorage** after successful login.
- Protected routes implemented.
- If token is missing, user is redirected to Login Page.

---

## 📬 Submission Details

**GitHub Repository:**
https://github.com/tanish4561/UserVault_tanish

**Live Application:**
https://uservaulttanish.vercel.app/login

---

## 🙌 Acknowledgement

This project was built as part of the **EmployWise Frontend Assignment** using the Reqres API.

