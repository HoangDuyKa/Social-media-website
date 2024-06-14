import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const commentSchema = new mongoose.Schema({
  userComment: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  commentText: String,
  createdAt: Date,
  updatedAt: Date,
  replies: [
    {
      replyId: mongoose.Schema.Types.ObjectId,
      userReply: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      replyText: String,
      createdAt: Date,
      updatedAt: Date,
    },
  ],
});

const postSchema = mongoose.Schema(
  {
    // userId: {
    //   type: String,
    //   required: true,
    // },
    // firstName: {
    //   type: String,
    //   required: true,
    // },
    // lastName: {
    //   type: String,
    //   required: true,
    // },
    // userPicturePath: String,
    userPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: String,
    description: String,
    file: {
      path: String,
      fileType: String,
      fileName: String,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

postSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
