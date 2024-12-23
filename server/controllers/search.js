import Post from "../models/Post.js";
import User from "../models/User.js";

/* READ */
export const getSearchs = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);

    // Tách query thành các từ
    const nameParts = query.split(" ");
    let users = [];
    let posts = [];

    if (nameParts.length === 1) {
      const firstNameQuery = nameParts[0];

      // Tìm kiếm người dùng theo firstName
      users = await User.find({
        firstName: { $regex: firstNameQuery, $options: "i" },
      });

      // Tìm kiếm bài viết theo mô tả
      posts = await Post.find({
        isAnniversaryPost: false,
        status: "public",
        description: { $regex: query, $options: "i" },
      })
        .populate({
          path: "comments.userComment",
          select: "_id firstName lastName picturePath location",
        })
        .populate({
          path: "userPost",
          select: "_id firstName lastName picturePath location",
        });
    } else {
      const firstNameQuery = nameParts[0];
      const lastNameQuery = nameParts.slice(1).join(" ");

      // Tìm kiếm người dùng theo firstName và lastName
      users = await User.find({
        $or: [
          { firstName: { $regex: firstNameQuery, $options: "i" } },
          { lastName: { $regex: lastNameQuery, $options: "i" } },
        ],
      });

      // Tìm kiếm bài viết theo mô tả
      posts = await Post.find({
        description: { $regex: query, $options: "i" },
      })
        .populate({
          path: "comments.userComment",
          select: "_id firstName lastName picturePath location",
        })
        .populate({
          path: "userPost",
          select: "_id firstName lastName picturePath location",
        });
    }

    console.log(posts, users);
    res.status(200).json({ users, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
