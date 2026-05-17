import { Link, useLocation } from "react-router-dom";
import { FaHome, FaPlusCircle, FaRegListAlt } from "react-icons/fa";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex justify-between items-center px-6 py-3 shadow-md bg-white sticky top-0 z-50">
      {/* Brand */}
      <Link to="/">
        <h1 className="text-2xl font-bold text-blue-600">SocialHub</h1>
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-10">
        {/* Home - all posts */}
        <Link to="/">
          <div className="flex items-center gap-1 cursor-pointer">
            <FaHome
              className={`text-xl ${
                isActive("/")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            />
            <span className="text-sm hidden md:block">Home</span>
          </div>
        </Link>

        {/* Create Post */}
        <Link to="/create">
          <div className="flex items-center gap-1 cursor-pointer">
            <FaPlusCircle
              className={`text-xl ${
                isActive("/create")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-green-500"
              }`}
            />
            <span className="text-sm hidden md:block">Create</span>
          </div>
        </Link>

        {/* My Posts */}
        <Link to="/myposts">
          <div className="flex items-center gap-1 cursor-pointer">
            <FaRegListAlt
              className={`text-xl ${
                isActive("/myposts")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-purple-500"
              }`}
            />
            <span className="text-sm hidden md:block">My Posts</span>
          </div>
        </Link>
      </div>

      {/* Profile Avatar */}
      <Link to="/profile">
        <img
          src={
            user?.profilepic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          className="w-10 h-10 rounded-full cursor-pointer border object-cover hover:scale-105 transition"
        />
      </Link>
    </div>
  );
};

export default Header;
