import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";

const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];
// console.log(userIds);

export async function uploadImagesAndCreateUsers(users, cloudinary) {
  try {
    const promises = users.map(async (user) => {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(user.picturePath);
      const imageUrl = result.secure_url;

      // Create a new user object with Cloudinary URL
      const newUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        picturePath: imageUrl, // Set picturePath to Cloudinary URL
        friends: [],
        location: user.location || "",
        occupation: user.occupation || "",
        viewedProfile: user.viewedProfile || 0,
        impressions: user.impressions || 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return newUser;
    });

    // Execute all promises to create new user objects
    const newUsers = await Promise.all(promises);

    // Insert many new users into the database
    await User.insertMany(newUsers);

    console.log("New users created successfully");
  } catch (error) {
    console.error("Error uploading images and creating users:", error);
    throw error;
  }
}

export async function uploadPostImagesAndCreatePosts(posts, cloudinary) {
  try {
    const promises = posts.map(async (post) => {
      // Upload post image to Cloudinary
      const postImageResult = await cloudinary.uploader.upload(
        post.picturePath
      );
      const postImageUrl = postImageResult.secure_url;

      // Find the user by userId
      const user = await User.findById(post.userId);

      if (!user) {
        throw new Error(`User with userId ${post.userId} not found`);
      }

      // Use user's profile image as userPicturePath for the post
      const userPicturePath = user.picturePath;

      // Create a new post object with Cloudinary URL for post image and user's profile image
      const newPost = {
        userId: post.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: post.location || "",
        description: post.description,
        picturePath: postImageUrl,
        userPicturePath: userPicturePath, // Set userPicturePath to user's profile image
        likes: post.likes,
        // || new Map(),
        comments: post.comments,
        // || [],
      };

      return newPost;
    });

    // Execute all promises to create new post objects
    const newPosts = await Promise.all(promises);

    // Insert many new posts into the database
    await Post.insertMany(newPosts);

    console.log("New posts created successfully");
  } catch (error) {
    console.error("Error uploading images and creating posts:", error);
    throw error; // Rethrow the error to propagate it further
  }
}

export const users = [
  {
    _id: userIds[0],
    firstName: "test",
    lastName: "me",
    email: "aaaaaaa@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "../server/public/assets/p11.jpeg",
    friends: [],
    location: "San Fran, CA",
    occupation: "Software Engineer",
    viewedProfile: 14561,
    impressions: 888822,
    createdAt: 1115211422,
    updatedAt: 1115211422,
    __v: 0,
  },
  {
    _id: userIds[1],
    firstName: "Steve",
    lastName: "Ralph",
    email: "thataaa@gmail.com",
    password: "$!FEAS@!O)_IDJda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "../server/public/assets/p3.jpeg",
    friends: [],
    location: "New York, CA",
    occupation: "Degenerate",
    viewedProfile: 12351,
    impressions: 55555,
    createdAt: 1595589072,
    updatedAt: 1595589072,
    __v: 0,
  },
  {
    _id: userIds[2],
    firstName: "Some",
    lastName: "Guy",
    email: "someguy@gmail.com",
    password: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    picturePath: "../server/public/assets/p4.jpeg",
    friends: [],
    location: "Canada, CA",
    occupation: "Data Scientist Hacker",
    viewedProfile: 45468,
    impressions: 19986,
    createdAt: 1288090662,
    updatedAt: 1288090662,
    __v: 0,
  },
  {
    _id: userIds[3],
    firstName: "Whatcha",
    lastName: "Doing",
    email: "whatchadoing@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "../server/public/assets/p6.jpeg",
    friends: [],
    location: "Korea, CA",
    occupation: "Educator",
    viewedProfile: 41024,
    impressions: 55316,
    createdAt: 1219214568,
    updatedAt: 1219214568,
    __v: 0,
  },
  {
    _id: userIds[4],
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "../server/public/assets/p5.jpeg",
    friends: [],
    location: "Utah, CA",
    occupation: "Hacker",
    viewedProfile: 40212,
    impressions: 7758,
    createdAt: 1493463661,
    updatedAt: 1493463661,
    __v: 0,
  },
  {
    _id: userIds[5],
    firstName: "Harvey",
    lastName: "Dunn",
    email: "harveydunn@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "../server/public/assets/p7.jpeg",
    friends: [],
    location: "Los Angeles, CA",
    occupation: "Journalist",
    viewedProfile: 976,
    impressions: 4658,
    createdAt: 1381326073,
    updatedAt: 1381326073,
    __v: 0,
  },
  {
    _id: userIds[6],
    firstName: "Carly",
    lastName: "Vowel",
    email: "carlyvowel@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "../server/public/assets/p8.jpeg",
    friends: [],
    location: "Chicago, IL",
    occupation: "Nurse",
    viewedProfile: 1510,
    impressions: 77579,
    createdAt: 1714704324,
    updatedAt: 1642716557,
    __v: 0,
  },
  {
    _id: userIds[7],
    firstName: "Jessica",
    lastName: "Dunn",
    email: "jessicadunn@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    picturePath: "../server/public/assets/p9.jpeg",
    friends: [],
    location: "Washington, DC",
    occupation: "A Student",
    viewedProfile: 19420,
    impressions: 82970,
    createdAt: 1369908044,
    updatedAt: 1359322268,
    __v: 0,
  },
];

export const posts = [
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[1],
    firstName: "Steve",
    lastName: "Ralph",
    location: "New York, CA",
    description: "Some really long random description",
    picturePath: "../server/public/assets/post1.jpeg",
    // userPicturePath: "p3.jpeg",
    likes: new Map([
      [userIds[0], true],
      [userIds[2], true],
      [userIds[3], true],
      [userIds[4], true],
    ]),
    comments: [
      "random comment",
      "another random comment",
      "yet another random comment",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[3],
    firstName: "Whatcha",
    lastName: "Doing",
    location: "Korea, CA",
    description:
      "Another really long random description. This one is longer than the previous one.",
    picturePath: "../server/public/assets/post2.jpeg",
    // userPicturePath: "p6.jpeg",
    likes: new Map([
      [userIds[7], true],
      [userIds[4], true],
      [userIds[1], true],
      [userIds[2], true],
    ]),
    comments: [
      "one more random comment",
      "and another random comment",
      "no more random comments",
      "I lied, one more random comment",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[4],
    firstName: "Jane",
    lastName: "Doe",
    location: "Utah, CA",
    description:
      "This is the last really long random description. This one is longer than the previous one.",
    picturePath: "../server/public/assets/post3.jpeg",
    // userPicturePath: "p5.jpeg",
    likes: new Map([
      [userIds[1], true],
      [userIds[6], true],
      [userIds[3], true],
      [userIds[5], true],
    ]),
    comments: [
      "one more random comment",
      "I lied, one more random comment",
      "I lied again, one more random comment",
      "Why am I doing this?",
      "I'm bored",
    ],
  },
  // {
  //   _id: new mongoose.Types.ObjectId(),
  //   userId: userIds[5],
  //   firstName: "Harvey",
  //   lastName: "Dunn",
  //   location: "Los Angeles, CA",
  //   description:
  //     "This is the last really long random description. This one is longer than the previous one. Man I'm bored. I'm going to keep typing until I run out of things to say.",
  //   picturePath: "../server/public/assets/post4.jpeg",
  //   // userPicturePath: "p7.jpeg",
  //   likes: new Map([
  //     [userIds[1], true],
  //     [userIds[6], true],
  //     [userIds[3], true],
  //   ]),
  //   comments: [
  //     "I lied again, one more random comment",
  //     "Why am I doing this?",
  //     "I'm bored",
  //     "I'm still bored",
  //     "All I want to do is play video games",
  //     "I'm going to play video games",
  //   ],
  // },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[6],
    firstName: "Carly",
    lastName: "Vowel",
    location: "Chicago, IL",
    description:
      "Just a short description. I'm tired of typing. I'm going to play video games now.",
    picturePath: "../server/public/assets/post5.jpeg",
    // userPicturePath: "p8.jpeg",
    likes: new Map([
      [userIds[1], true],
      [userIds[3], true],
      [userIds[5], true],
      [userIds[7], true],
    ]),
    comments: [
      "I lied again, one more random comment",
      "Why am I doing this?",
      "Man I'm bored",
      "What should I do?",
      "I'm going to play video games",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[7],
    firstName: "Jessica",
    lastName: "Dunn",
    location: "Washington, DC",
    description:
      "For the last time, I'm going to play video games now. I'm tired of typing. I'm going to play video games now.",
    picturePath: "../server/public/assets/post6.jpeg",
    // userPicturePath: "p9.jpeg",
    likes: new Map([
      [userIds[1], true],
      [userIds[2], true],
    ]),

    comments: [
      "Can I play video games now?",
      "No let's actually study",
      "Never mind, I'm going to play video games",
      "Stop it.",
      "Michael, stop it.",
    ],
  },
];
