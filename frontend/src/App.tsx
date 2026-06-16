import { Routes, Route, useNavigate,Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import TaskPages from "./pages/TaskPages";
import UserNotes from "./pages/UserNotes";


function App() {

  const role = sessionStorage.getItem("role");
   const navigate = useNavigate();

  return (
    <Routes>

      <Route
  path="/"
  element={
    <Login
      onLoginSuccess={() => {}}
      onSwitchToSignup={() => navigate("/signup")}
    />
  }
/>
<Route
  path="/admin/user/:id"
  element={
    role === "admin" ? (
      <UserNotes />
    ) : (
      <Navigate to="/" />
    )
  }
/>
      <Route
  path="/signup"
  element={
    <Signup
      onSwitchToLogin={() => navigate("/")}
    />
  }
/>

      <Route
        path="/tasks"
        element={
          role === "user" ? (
            <TaskPages />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin"
        element={
          role === "admin" ? (
            <Admin />
          ) : (
            <Navigate to="/" />
          )
        }
      />

    </Routes>
  );
}

export default App;