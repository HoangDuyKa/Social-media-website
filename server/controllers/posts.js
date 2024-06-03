import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, fileType, fileName } = req.body;
    // let fileUrl = "";
    // console.log(req.files);
    // if (req.files) {
    //   if (req.files.picture) {
    //     fileUrl = "image " + req.files.picture[0].path;
    //   } else if (req.files.video) {
    //     fileUrl = "video " + req.files.video[0].path;
    //   } else if (req.files.file) {
    //     fileUrl = "file " + req.files.file[0].path;
    //   } else {
    //     fileUrl = "noFile";
    //   }
    // }

    let filePath = "noFile";
    if (req.file) {
      filePath = req.file.path;
    }

    console.log(req.file);
    console.log(req.body);
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      // picturePath: fileUrl,
      file: {
        path: filePath,
        fileType: fileType,
        fileName: fileName,
      },
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
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
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserTrash = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.findWithDeleted({ deleted: true });

    const deletedPost = post.filter((post) => post.userId === userId);
    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserComment, commentText } = req.body;
    console.log(req.body);
    const post = await Post.findById(id);
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        comments: [
          ...post.comments,
          {
            UserComment,
            commentText,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        ],
      },
      { new: true }
    );

    res.status(200).json(updatedPost);

    // if (isLiked) {
    //   post.likes.delete(userId);
    // } else {
    //   post.likes.set(userId, true);
    // }

    // const updatedPost = await Post.findByIdAndUpdate(
    //   id,
    //   { likes: post.likes },
    //   { new: true }
    // );

    // res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const restorePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.restore({ _id: id });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.delete({ _id: id });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const destroyPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.deleteOne({ _id: id });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
