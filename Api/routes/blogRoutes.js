import express from "express";

import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";
import {
  createBlog,
  getMyBlogs,
  getAllBlogs,
  DeleteBlogs,
  getSingleBlog,
  likeBlog,
  addComment,
  deleteComment,
} from "../controllers/Blog.js";

const router = express.Router();

router.post("/create", auth, upload.single("blogimg"), createBlog);

router.get("/me", auth, getMyBlogs);

router.get("/getblogs", auth, getAllBlogs);

router.delete("/deleteblogs/:id", auth, DeleteBlogs);

router.get("/:id", getSingleBlog);

router.put("/like/:id", auth, likeBlog);

router.post("/comment/:id", auth, addComment);

router.delete("/comment/:blogId/:commentId", auth, deleteComment);

export default router;
