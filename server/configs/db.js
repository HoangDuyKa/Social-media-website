import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

export default connectToMongoDB;

// mongoose
//   .connect(process.env.MONGO_URL, {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   })
//   .then(() => {
//     server.listen(PORT, () => console.log(`Server Port: ${PORT}`));

//     /* ADD DATA ONE TIME */
//     // User.insertMany(users);
//     // Post.insertMany(posts);
//     // uploadImagesAndCreateUsers(users, cloudinary).then(() =>
//     //   uploadPostImagesAndCreatePosts(posts, cloudinary)
//     // );
//   })
//   .catch((error) => console.log(`${error} did not connect`));
