import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
// import { getReceiverSocketId, io } from "../socket/socket.js";
import { createNotifications } from "./notification.js";
import SavePost from "../models/SavePost.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, fileType, fileName } = req.body;
    let filePath = "noFile";
    if (req.file) {
      filePath = req.file.path;
    }

    // const user = await User.findById(userId);
    const newPost = new Post({
      // userId,
      // firstName: user.firstName,
      // lastName: user.lastName,
      // location: user.location,
      // userPicturePath: user.picturePath,
      userPost: userId,
      description,
      file: {
        path: filePath,
        fileType: fileType,
        fileName: fileName,
      },
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find({ isAnniversaryPost: false })
      .populate("userPost", "_id firstName lastName picturePath location")
      .sort({ createdAt: -1 });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find({ isAnniversaryPost: false })
      .populate("userPost", "_id firstName lastName picturePath location")
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      });
    // const post = await Post.aggregate([
    //   // { $match: { userId: mongoose.Types.ObjectId(userId) } },
    //   { $sample: { size: 10 } }, // Bạn có thể thay đổi size tùy thuộc vào số lượng bài viết bạn muốn lấy
    // ]);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userPost: userId, isAnniversaryPost: false })
      .populate("userPost", "_id firstName lastName picturePath location")
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserTrash = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.findWithDeleted({
      deleted: true,
    })
      .populate("userPost", "_id firstName lastName picturePath location")
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      });

    const deletedPost = posts.filter(
      (post) => post.userPost._id.toString() === userId
    );
    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserStorage = async (req, res) => {
  try {
    const { userId } = req.params;
    const savedPosts = await SavePost.find({
      userSave: userId,
      // isAnniversaryPost: false,
    })
      .populate("userSave", "_id firstName lastName picturePath location")
      .populate({
        path: "postId",
        populate: [
          {
            path: "userPost",
            select: "_id firstName lastName picturePath location",
          },
          {
            path: "comments.userComment",
            select: "_id firstName lastName picturePath location",
          },
        ],
      });
    const posts = savedPosts.map((save) => save.postId);

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserMemory = async (req, res) => {
  try {
    const { userId } = req.params;
    const memoryPosts = await Post.find({
      userPost: userId,
      isAnniversaryPost: true,
    })
      .populate("userPost", "_id firstName lastName picturePath location")
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      });
    res.status(200).json(memoryPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getDetailPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.find({ _id: postId })
      .populate("userPost", "_id firstName lastName picturePath location")
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      });

    console.log("post", post);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params; // id of post
    const { userId, postUserId } = req.body; //userId of like post
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    const user = await User.findById(userId);
    const notificationMessage = `${user.firstName} has liked your post`;
    // const senderImage = user.picturePath;

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
      if (userId !== postUserId) {
        createNotifications(
          id,
          userId,
          "like",
          notificationMessage,
          postUserId,
          `/detail/post/${id}`
        );
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )
      .populate("userPost", "_id firstName lastName picturePath location")
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userComment, commentText } = req.body;
    const post = await Post.findById(id);
    console.log(req.body);

    // const updatedPost = await Post.findByIdAndUpdate(
    //   id,
    //   {
    //     comments: [
    //       ...post.comments,
    //       {
    //         commentId: new mongoose.Types.ObjectId(),
    //         userComment: userCommentId,
    //         commentText,
    //         updatedAt: new Date(),
    //         createdAt: new Date(),
    //         replies: [],
    //       },
    //     ],
    //   },
    //   { new: true }
    // ).populate("userComment", "_id firstName lastName picturePath location");

    const newComment = {
      userComment,
      commentText,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
    };

    post.comments.push(newComment);

    await post.save();

    let updatedPost = await Post.findById(id)
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .populate({
        path: "userPost",
        select: "_id firstName lastName picturePath location",
      });
    // Populate userPost field
    console.log("updatedPost", updatedPost);
    // const notificationMessage = `${updatedPost.userComment.firstName} had commented your post`;
    const notificationMessage = `${
      updatedPost.comments[updatedPost.comments.length - 1].userComment
        .firstName
    } had commented on your post`;

    if (userComment !== post.userPost.toString()) {
      createNotifications(
        userComment, //id of user comment
        userComment, //id of user comment
        "comment",
        notificationMessage,
        post.userPost, //id of userPost
        `/detail/post/${id}`
      );
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId, newComment } = req.body;
    console.log(req.body);
    console.log(req.params);

    const post = await Post.findById(id)
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .populate({
        path: "userPost",
        select: "_id firstName lastName picturePath location",
      });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment._id.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.commentText = newComment;
    post.markModified("comments");
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId } = req.body;

    // Tìm post bằng id
    const post = await Post.findById(id)
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .populate({
        path: "userPost",
        select: "_id firstName lastName picturePath location",
      });

    const filteredComments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    post.comments = filteredComments;

    // Lưu post sau khi xoá comment
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const replyCommentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userReplyComment, replyCommentId, replyCommentText, replyingTo } =
      req.body;
    // console.log(req.body);
    const post = await Post.findById(id)
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .populate({
        path: "userPost",
        select: "_id firstName lastName picturePath location",
      });
    const comment = post.comments.find(
      (comment) => comment.commentId.toString() === replyCommentId
    );
    comment.replies.push({
      replyCommentId: new mongoose.Types.ObjectId(),
      userReplyComment,
      replyCommentText,
      replyingTo,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    post.markModified("comments");
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const editReplyComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId, newComment } = req.body;
    console.log(req.body);

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.commentId.toString() === commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.commentText = newComment;
    post.markModified("comments");
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReplyComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId } = req.body;

    // Tìm post bằng id
    const post = await Post.findById(id);

    const filteredComments = post.comments.filter(
      (comment) => comment.commentId.toString() !== commentId
    );
    post.comments = filteredComments;

    // Lưu post sau khi xoá comment
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const restorePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.restore({ _id: id, isAnniversaryPost: false })
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .populate({
        path: "userPost",
        select: "_id firstName lastName picturePath location",
      });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.delete({ _id: id });
    const remainPost = await Post.find({ isAnniversaryPost: false })
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .populate({
        path: "userPost",
        select: "_id firstName lastName picturePath location",
      });
    res.status(200).json(remainPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const destroyPost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.deleteOne({ _id: id });
    const remainPost = await Post.findWithDeleted({ deleted: true })
      .populate({
        path: "comments.userComment",
        select: "_id firstName lastName picturePath location",
      })
      .populate({
        path: "userPost",
        select: "_id firstName lastName picturePath location",
      });
    res.status(200).json(remainPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    // Kiểm tra xem bài viết đã được lưu chưa
    const existingSave = await SavePost.findOne({
      userSave: userId,
      postId: id,
    });
    if (existingSave) {
      return res.status(400).json({ error: "Post already saved" });
    }

    // Lưu bài viết
    const newSave = new SavePost({ userSave: userId, postId: id });
    await newSave.save();

    res.status(200).json(newSave);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const unsavePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;

    await SavePost.findOneAndDelete({ userSave: userId, postId });

    res.status(200).json({ message: "Post unsaved successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createAnniversaryPosts = async () => {
  const currentDate = new Date();
  for (let i = 1; i <= 5; i++) {
    const anniversaryDate = new Date();
    anniversaryDate.setFullYear(currentDate.getFullYear() - i);

    const startOfDayAnniversary = new Date(anniversaryDate);
    startOfDayAnniversary.setHours(0, 0, 0, 0);

    const endOfDayAnniversary = new Date(anniversaryDate);
    endOfDayAnniversary.setHours(23, 59, 59, 999);

    const posts = await Post.find({
      createdAt: {
        $gte: startOfDayAnniversary,
        $lte: endOfDayAnniversary,
      },
      deleted: false,
      alreadyAniversary: false,
    });

    for (const post of posts) {
      const years = currentDate.getFullYear() - post.createdAt.getFullYear();

      const newPost = new Post({
        userPost: post.userPost,
        description: post.description,
        file: post.file,
        likes: [],
        comments: [],
        isAnniversaryPost: true,
        anniversariesCelebrated: years,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        post.alreadyAniversary = true;
        await post.save();
        await newPost.save();
        console.log(
          `Created anniversary post for original post ID: ${post._id}`
        );
      } catch (error) {
        console.error(
          `Error creating anniversary post for post ID: ${post._id}`,
          error
        );
      }
    }
  }
};
