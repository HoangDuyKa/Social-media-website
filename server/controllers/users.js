import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";
import bcrypt from "bcrypt";
import { createNotifications } from "./notification.js";

/* CREATE */

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsers = async (req, res, next) => {
  const all_users = await User.find().select(
    "firstName lastName _id picturePath"
  );

  const this_user = req.user;

  const remaining_users = all_users.filter(
    (user) =>
      !this_user.friends.includes(user._id) &&
      user._id.toString() !== req.user._id.toString()
  );

  res.status(200).json({
    status: "success",
    data: remaining_users,
    message: "Users found successfully!",
  });
};

// export const getUserFriends = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath }) => {
//         return {
//           _id,
//           firstName,
//           lastName,
//           occupation,
//           location,
//           picturePath,
//         };
//       }
//     );
//     res.status(200).json(formattedFriends);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    // Sort friends by dateAdded (assuming each friend has a 'dateAdded' field)
    const sortedFriends = user.friends.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    // Limit the result to a maximum of 6 friends
    const topFriends = sortedFriends.slice(0, 6);

    // Fetch data for the top 6 friends
    const friends = await Promise.all(
      topFriends.map((friendId) => User.findById(friendId))
    );

    // Format the friend data
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    // Send the formatted friend data as the response
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRequests = async (req, res, next) => {
  const requests = await FriendRequest.find({ recipient: req.user._id })
    .populate("sender")
    .select("_id firstName lastName picturePath");

  res.status(200).json({
    status: "success",
    data: requests,
    message: "Requests found successfully!",
  });
};

export const getOnlineUsersInformation = async (req, res) => {
  try {
    const { onlineUsers } = req.body; // Array of user IDs from the client
    const currentUserId = req.user.id; // Assuming the authenticated user's ID is in the token payload

    if (!Array.isArray(onlineUsers) || onlineUsers.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or empty onlineUsers array." });
    }

    // Exclude the current userId from the query
    const users = await User.find({
      _id: { $in: onlineUsers, $ne: currentUserId }, // $ne excludes the current user
    }).select("_id firstName lastName occupation picturePath");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching online users:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// export const getFriends = async (req, res, next) => {
//   const this_user = await User.findById(req.user._id).populate(
//     "friends",
//     "_id firstName lastName"
//   );
//   res.status(200).json({
//     status: "success",
//     data: this_user.friends,
//     message: "Friends found successfully!",
//   });
// };

/* UPDATE */
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const {
    firstName,
    lastName,
    email,
    password,
    newPassword,
    location,
    occupation,
  } = req.body;
  let picturePath = req.body.picture;
  console.log("req.params", req.params);
  console.log("req.body", req.body);
  console.log("req.file:", req.file); // Debugging
  console.log("picturePath", picturePath);

  if (req.file) {
    picturePath = req.file.path;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.firstName = firstName.trim();
    user.lastName = lastName.trim();
    user.email = email.trim();
    user.location = location.trim();
    user.occupation = occupation.trim();
    if (picturePath) user.picturePath = picturePath;

    if (newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials. " });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    const notificationMessage = `${user.firstName} sent you a friend request`;
    const senderImage = user.picturePath;

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((_id) => _id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);

      if (id !== user._id) {
        createNotifications(
          friendId,
          senderImage,
          "friend_request",
          notificationMessage,
          friendId
        );
      }
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const lockUser = async (req, res) => {
  try {
    const { id } = req.params; // id of post
    const user = await User.findById(id);
    const isLocked = user.lock === true;
    if (isLocked) {
      user.lock = false;
    } else {
      user.lock = true;
    }
    await user.save();

    const loggedInUserId = req.user._id.toString();
    const remainUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json({
      status: "success",
      data: remainUser,
      message: isLocked ? "Unlock User Successfully" : "Lock User Successfully",
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const destroyUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.deleteOne({ _id: id });
    const loggedInUserId = req.user._id.toString();
    const remainUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(remainUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
