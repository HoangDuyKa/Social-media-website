import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.js";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  // params: async (req, file) => {
  //   let folder, resource_type, public_id, fileExtension;
  //   if (file.mimetype.startsWith("image/")) {
  //     folder = "images";
  //     resource_type = "image";
  //     public_id = `image-${Date.now()}-${path.basename(
  //       file.originalname,
  //       path.extname(file.originalname)
  //     )}`;
  //   } else if (file.mimetype.startsWith("video/")) {
  //     folder = "videos";
  //     resource_type = "video";
  //     public_id = `video-${Date.now()}-${path.basename(
  //       file.originalname,
  //       path.extname(file.originalname)
  //     )}`;
  //   } else {
  //     // console.log(file.mimetype.split("/")[0]);
  //     folder = "files";
  //     resource_type = "auto";
  //     fileExtension = path.extname(file.originalname).substring(1);
  //     public_id = `file-${Date.now()}-${path.basename(
  //       file.originalname,
  //       path.extname(file.originalname)
  //     )}`;
  //     // throw new Error("Unsupported file type");
  //   }
  //   console.log("public_id", public_id);
  //   return {
  //     folder: folder,
  //     resource_type: resource_type,
  //     public_id: public_id,
  //     format: fileExtension ? fileExtension : null,
  //   };
  // },
  params: async (req, file) => {
    let folder = "files";
    let resource_type = "raw";

    if (file.mimetype.startsWith("image/")) {
      folder = "images";
      resource_type = "image";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "videos";
      resource_type = "video";
    } else if (file.mimetype.startsWith("audio/")) {
      folder = "audio";
      resource_type = "video";
    }
    // const folderMap = {
    //   Image: "images",
    //   Video: "videos",
    //   Audio: "audio",
    //   File: "files",
    // };
    // const resourceTypeMap = {
    //   Image: "image",
    //   Video: "video",
    //   Audio: "video",
    //   File: "raw",
    // };
    // const folder = folderMap[req.body.fileType] || "files";
    // const resource_type = resourceTypeMap[req.body.fileType] || "raw";

    const fileExtension = path.extname(file.originalname).substring(1); // Get file extension without the dot
    const public_id = `file-${Date.now()}-${path.basename(
      file.originalname,
      path.extname(file.originalname)
    )}`;
    const format = fileExtension ? fileExtension : null;
    // console.log("folder", folder);
    // console.log("resource_type", resource_type);
    // console.log("public_id", public_id);
    // console.log("format", format);

    return {
      folder: folder,
      resource_type: resource_type,
      public_id: public_id,
      format: format, // Ensure the file extension is included in the URL
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Limit file size to 100MB (adjust as needed)
});

/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   }
// );
