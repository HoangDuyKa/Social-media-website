import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

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
    userPost : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
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
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
