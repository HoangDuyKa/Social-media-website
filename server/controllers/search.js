import Post from "../models/Post.js";
import User from "../models/User.js";

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
        description: { $regex: query, $options: "i" },
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
      });
    }

    res.status(200).json({ users, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  //   try {
  //     const { query } = req.query;

  //     // Tách query thành các từ để tìm kiếm theo họ tên
  //     const nameParts = query.split(" ");
  //     const firstNameQuery = nameParts[0];
  //     const lastNameQuery = nameParts.length > 1 ? nameParts[1] : "";

  //     // Tìm kiếm người dùng theo tên
  //     const users = await User.find({
  //       $or: [
  //         { firstName: { $regex: firstNameQuery, $options: "i" } },
  //         { lastName: { $regex: lastNameQuery, $options: "i" } },
  //         { email: { $regex: query, $options: "i" } },
  //       ],
  //     });

  //     const postRegex = new RegExp(query, "i");

  //     const posts = await Post.find({
  //       description: postRegex,
  //     }).populate("userId", "name email");

  //     res.status(200).json({ users, posts });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
};
