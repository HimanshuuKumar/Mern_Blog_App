import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";

const CreateBlogs = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("blogimg", image);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://mern-blog-app-jg3k.onrender.com/api/blogs/create",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(res.data);

      alert("Blog created successfully!");

      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.log(error);
      alert("Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
            Create New Post
          </h1>

          {/* Title */}
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Description */}
          <textarea
            placeholder="Write something..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          {/* Image */}
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mb-4"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateBlogs;
