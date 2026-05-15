import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import BlogDescription from "../components/BlogDescription";
const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://mern-blog-app-jg3k.onrender.com/api/blogs/getblogs", {
        headers: { Authorization: token },
      });
      setBlogs(res.data.blogs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />

      {/* Feed Container */}
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-2xl mx-auto space-y-4 px-4">
          {/* Page Title (LinkedIn style removed heavy heading) */}
          <div className="text-sm text-gray-500">Home • Feed</div>

          {/* Posts */}
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    className="w-11 h-11 rounded-full object-cover"
                    alt="user"
                  />

                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {blog.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Software Developer • Just now
                    </p>
                  </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600">⋯</button>
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                <h2 className="text-[18px] font-semibold text-gray-900 leading-snug">
                  {blog.title}
                </h2>

                <BlogDescription text={blog.description} />
              </div>

              {/* Image (LinkedIn style full width but subtle) */}
              {blog.blogimg && (
                <div className="border-t border-b border-gray-100">
                  <img
                    src={blog.blogimg}
                    className="w-full max-h-[420px] object-cover"
                    alt="post"
                  />
                </div>
              )}

              {/* Reactions Bar (LinkedIn feel) */}
              <div className="flex justify-between px-4 py-2 text-xs text-gray-500">
                <div className="flex gap-4">
                  <button className="hover:text-blue-600">👍 Like</button>
                  <button className="hover:text-blue-600">💬 Comment</button>
                  <button className="hover:text-blue-600">🔁 Repost</button>
                </div>

                <button className="hover:text-gray-700">🔖 Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
