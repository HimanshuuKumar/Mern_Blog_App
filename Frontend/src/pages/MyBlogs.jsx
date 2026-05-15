import React, { useState, useEffect } from "react";
import { Trash2, User, Calendar, Loader, Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch Blogs
  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("https://mern-blog-app-jg3k.onrender.com/api/blogs/me", {
        headers: {
          Authorization: token,
        },
      });

      setBlogs(res.data.blogs);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  // Delete Blog
  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(blogId);

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:4000/api/blogs/deleteblogs/${blogId}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      // Remove deleted blog instantly
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.log(err);
      setError("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />

            <p className="text-gray-600 text-sm">Loading your blogs...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>

              <p className="text-gray-500 mt-1">
                Manage all your published posts
              </p>
            </div>

            <button
              onClick={() => navigate("/create")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Blog
            </button>
          </div>

          {/* Blog Count */}
          {blogs.length > 0 && (
            <div className="mb-6">
              <span className="bg-blue-100 text-blue-700 text-sm px-4 py-1 rounded-full font-medium">
                {blogs.length} {blogs.length === 1 ? "Blog" : "Blogs"}
              </span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Empty State */}
          {blogs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Plus className="w-10 h-10 text-gray-400" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Blogs Yet
              </h2>

              <p className="text-gray-500 mb-6">
                Start sharing your thoughts with the world.
              </p>

              <button
                onClick={() => navigate("/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
              >
                Create Your First Blog
              </button>
            </div>
          ) : (
            // Blogs Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                >
                  {/* Blog Image */}
                  {blog.blogimg ? (
                    <div className="overflow-hidden">
                      <img
                        src={blog.blogimg}
                        alt={blog.title}
                        className="w-full h-56 object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                  )}

                  {/* Blog Content */}
                  <div className="p-5">
                    {/* Top */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {blog.title}
                      </h2>

                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        {deletingId === blog._id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-5">
                      {blog.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{blog.user?.name || "Anonymous"}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Read More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBlogs;
