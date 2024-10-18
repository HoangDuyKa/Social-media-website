import Ads from "../models/ads.js";
import cron from "node-cron"

export const getAllAds = async (req,res)=>{
    try {
        const ads = await Ads.find();  // Lấy tất cả quảng cáo từ database

        // Tính số giờ còn lại cho mỗi quảng cáo
        const currentTime = new Date();
        const adsWithRemainingHours = ads.map(ad => {
          const expireDate = new Date(ad.expireDate);
          const timeDifference = expireDate - currentTime;  // Tính chênh lệch thời gian (mili-giây)
          const hoursRemaining = Math.max(timeDifference / (1000 * 60 * 60), 0);  // Chuyển đổi mili-giây thành giờ
          console.log(hoursRemaining)
    
          return {
            ...ad.toObject(),  // Giữ lại tất cả thuộc tính khác của quảng cáo
            // hoursRemaining: Math.floor(hoursRemaining),  // Số giờ còn lại
            hoursRemaining: hoursRemaining.toFixed(2),  // Số giờ còn lại, giữ lại 2 chữ số sau dấu phẩy
          };
        });
    
        res.status(200).json(adsWithRemainingHours);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch ads" });
      }
}

export const createAds = async (req,res)=>{
    try {
        const { websiteUrl, description, expireInHours,branch } = req.body;
        const imageUrl = req.file.path; // Đường dẫn của ảnh sau khi được tải lên Cloudinary
        console.log(imageUrl)
        // Tính toán thời gian hết hạn (expireDate) dựa trên số giờ người dùng nhập
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + parseInt(expireInHours, 10));
    
      const hoursRemaining = parseFloat(expireInHours);

        // Tạo quảng cáo mới
        const newAd = new Ads({
            imageUrl,
            branch,
            websiteUrl,
            description,
            expireDate,
            enabled: true,
        });
    
        const savedAd = await newAd.save();
        res.status(201).json({savedAd,hoursRemaining});
    
        // Tự động vô hiệu hóa quảng cáo sau khi hết hạn
        setTimeout(async () => {
            await Ads.findByIdAndUpdate(savedAd._id, { enabled: false });
            console.log(`Ad ${savedAd._id} has been disabled after ${expireInHours} hours`);
        }, parseInt(expireInHours, 10) * 3600000); // Chuyển đổi giờ sang mili-giây
        } catch (error) {
        res.status(500).json({ error: "Failed to create ad" });
        }
}

export const destroyAds = async (req,res)=>{
    try {
        const { id } = req.params;
        await Ads.findByIdAndDelete(id);
        console.log("delete")
        res.status(200).json({ message: "Ad deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete ad" });
      }
}

export const getRandomAds = async (req,res)=>{
    try {
        const ads = await Ads.find({ enabled: true }); // Chỉ lấy những quảng cáo đang bật
        if (ads.length === 0) {
          return res.status(404).json({ message: "No ads available" });
        }
    
        // Lấy ngẫu nhiên một quảng cáo
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        res.status(200).json(randomAd);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch random ad" });
      }
}

// // Kiểm tra và vô hiệu hóa các quảng cáo đã hết hạn mỗi giờ
// cron.schedule("0 * * * *", async () => {
//     const now = new Date();
//     await Ads.updateMany({ expireDate: { $lte: now }, enabled: true }, { enabled: false });
//     console.log("Expired ads have been disabled.");
//   });