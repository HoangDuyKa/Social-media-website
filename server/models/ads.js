import mongoose from "mongoose";

const AdSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    branch: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    description: { type: String, required: true },
    expireDate: { type: Date, required: true },
    enabled: { type: Boolean, default: true },
  });

  const Ads = mongoose.model("Adverts", AdSchema);


export default Ads