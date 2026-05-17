import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

import { Calendar, User, ArrowLeft, Heart, Trash2 } from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.log("Invalid user data in localStorage");
  }

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/blogs/${id}`);

      setBlog(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // LIKE BLOG
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:4000/api/blogs/like/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setBlog({
        ...blog,
        likes: res.data.likes,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // ADD COMMENT
  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `http://localhost:4000/api/blogs/comment/${id}`,
        {
          text: comment,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setBlog({
        ...blog,
        comments: res.data,
      });

      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:4000/api/blogs/comment/${id}/${commentId}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setBlog({
        ...blog,
        comments: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isLiked = blog?.likes?.includes(user?._id);

  if (loading) {
    return (
      <>
        <Header />

        <div className="flex justify-center items-center h-[80vh] bg-gray-100">
          <h1 className="text-3xl font-semibold text-gray-500 animate-pulse">
            Loading...
          </h1>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Header />

        <div className="flex justify-center items-center h-[80vh] bg-gray-100">
          <h1 className="text-3xl font-semibold text-red-500">
            Blog Not Found
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 m-6 text-gray-600 hover:text-black transition font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* IMAGE */}
          <div className="overflow-hidden">
            <img
              src={blog.blogimg}
              alt={blog.title}
              className="w-full h-[450px] object-cover hover:scale-105 transition duration-500"
            />
          </div>

          <div className="p-8 md:p-10">
            {/* TITLE */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                {blog.title}
              </h1>
            </div>

            {/* LIKE BUTTON */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-3 px-4.5 py-2 rounded-2xl mb-8 shadow-lg transition-all duration-300 border backdrop-blur-md
              
  ${
    isLiked
      ? "bg-red-50 border-red-200 hover:bg-red-100"
      : "bg-white border-gray-200 hover:bg-gray-100"
  }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all duration-300
                  
    ${isLiked ? "bg-red-500 shadow-md shadow-red-300" : "bg-gray-200"}`}
              >
                <Heart
                  size={16}
                  fill={isLiked ? "white" : "transparent"}
                  color={isLiked ? "white" : "#4B5563"}
                  className={`transition-transform duration-300 ${
                    isLiked ? "scale-110" : ""
                  }`}
                />
              </div>

              <span
                className={`font-semibold text-lg
                  
    ${isLiked ? "text-red-600" : "text-gray-700"}`}
              >
                {blog.likes?.length || 0}
              </span>
            </button>
            {/* AUTHOR + DATE */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-10 border-b pb-6">
              <div className="flex items-center gap-2">
                <User size={18} />

                <span className="font-medium">
                  {blog.user?.name || "Unknown Author"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} />

                <span className="font-medium">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="text-gray-700 text-lg md:text-xl leading-10 whitespace-pre-line font-light">
              {blog.description}
            </div>

            {/* COMMENTS */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Comments
              </h2>

              {/* ADD COMMENT */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
                />

                <button
                  onClick={handleComment}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition font-medium"
                >
                  Post
                </button>
              </div>

              {/* COMMENTS LIST */}
              <div className="space-y-5">
                {blog.comments?.length > 0 ? (
                  blog.comments.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gray-100 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {item.user?.name || "User"}
                          </h3>

                          <p className="text-gray-700 break-words">
                            {item.text}
                          </p>
                        </div>

                        {item?.user?._id === user?._id && (
                          <button
                            onClick={() => handleDeleteComment(item._id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-100 rounded-2xl p-6 text-center text-gray-500">
                    No comments yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
