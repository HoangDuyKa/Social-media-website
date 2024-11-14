import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const commentSchema = new mongoose.Schema({
  userComment: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  commentText: String,
  createdAt: Date,
  updatedAt: Date,
  replies: [
    {
      replyCommentId: mongoose.Schema.Types.ObjectId,
      userReplyComment: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      replyCommentText: String,
      replyingTo: String,
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
    status: { type: String, enum: ["private", "public"], default: "public" },
    comments: [commentSchema],
    anniversariesCelebrated: { type: Number, default: 0 }, // Add this field
    isAnniversaryPost: { type: Boolean, default: false },
    // alreadyAniversary: { type: Boolean, default: false },
    alreadyAniversary: { type: String, default: "None" },
  },
  { timestamps: true }
);

postSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
