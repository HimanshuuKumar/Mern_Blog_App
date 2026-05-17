import { Blog } from "../Models/Blog.js";
import cloudinary from "../config/cloudinary.js";

//create blogs

export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userid = req.user.id;
    let imageUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "mern_blog_images",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const newBlog = await Blog.create({
      title,
      description,
      blogimg: imageUrl,
      user: userid,
    });
    res.json({ message: "Blog created successfully", newBlog });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//get blog by id

export const getMyBlogs = async (req, res) => {
  try {
    const id = req.user.id;
    const blogs = await Blog.find({ user: id });
    if (blogs.length === 0) return res.json({ message: "Blog not found!" });
    res.json({ message: "blogs fetched successfully", blogs });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//get all blogs

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user").sort({ createdAt: -1 });
    if (blogs.length === 0) return res.json({ message: "Blog not found!" });
    res.json({ message: "all blogs fetched successfully", blogs });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//delete blog

export const DeleteBlogs = async (req, res) => {
  const id = req.params.id;
  const deletedBlog = await Blog.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });
  if (!deletedBlog) {
    return res.json({ message: "this blog does not exist" });
  }
  res.json({ message: "blog deleted successfully", deletedBlog });
};
//get single blog

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("user", "name profilePic")
      .populate("comments.user", "name profilePic");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//like blog

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = blog.likes?.includes(userId);
    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      message: alreadyLiked ? "Blog unliked" : "Blog liked",
      likes: blog.likes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//comment

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const newComment = {
      user: req.user.id,
      text,
    };

    blog.comments.push(newComment);

    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id).populate(
      "comments.user",
      "name",
    );

    res.status(200).json(updatedBlog.comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//delete comment

export const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const comment = blog.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    comment.deleteOne();

    await blog.save();

    const updatedBlog = await Blog.findById(blogId).populate(
      "comments.user",
      "name",
    );

    res.status(200).json(updatedBlog.comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
