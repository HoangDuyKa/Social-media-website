import mongoose from "mongoose";

const SavePostSchema = new mongoose.Schema({
  userSave: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
});

const SavePost = mongoose.model("SavePosts", SavePostSchema);

export default SavePost;
