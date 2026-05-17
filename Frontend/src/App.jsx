import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateBlogs from "./pages/createBlog";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import MyBlogs from "./pages/MyBlogs";
import BlogDetails from "./pages/BlogDetails";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/*dynamic route*/}
        <Route path="/signup" element={token ? <Home /> : <Signup />} />
        <Route path="/" element={token ? <Home /> : <Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/create" element={<CreateBlogs />} />
        <Route path="/myposts" element={<MyBlogs />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
