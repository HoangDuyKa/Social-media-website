import Ads from "../models/ads.js";

/* CREATE */
export const createAds = async (req, res) => {
  try {
    const { websiteUrl, description, expireInHours, branch } = req.body;
    const imageUrl = req.file.path; 
    console.log(imageUrl);
    //calculate time when expired base on expireInHours that user input
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + parseInt(expireInHours, 10));

    const hoursRemaining = parseFloat(expireInHours);

    const newAd = new Ads({
      imageUrl,
      branch,
      websiteUrl,
      description,
      expireDate,
      enabled: true,
    });

    const savedAd = await newAd.save();
    res.status(201).json({ savedAd, hoursRemaining });

    //auto disable ads after expiring
    setTimeout(async () => {
      await Ads.findByIdAndUpdate(savedAd._id, { enabled: false });
      console.log(
        `Ad ${savedAd._id} has been disabled after ${expireInHours} hours`
      );
    }, parseInt(expireInHours, 10) * 3600000); // convert milisecond to hour
  } catch (error) {
    res.status(500).json({ error: "Failed to create ad" });
  }
};

/* READ */
export const getRandomAds = async (req, res) => {
  try {
    const ads = await Ads.find({ enabled: true }); //only get enable ads
    if (ads.length === 0) {
      return res.status(404).json({ message: "No ads available" });
    }

    //random a ads to get
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    res.status(200).json(randomAd);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch random ad" });
  }
};

export const getAllAds = async (req, res) => {
  try {
    const ads = await Ads.find(); // Lấy tất cả quảng cáo từ database

    //calculate remain hours for each ads
    const currentTime = new Date();
    const adsWithRemainingHours = ads.map((ad) => {
      const expireDate = new Date(ad.expireDate);
      const timeDifference = expireDate - currentTime; // calculate time different milisecond
      const hoursRemaining = Math.max(timeDifference / (1000 * 60 * 60), 0); // alculate hour remaining by convert from milisecond
      console.log(hoursRemaining);

      return {
        ...ad.toObject(), // Keep all remain field of ads
        // hoursRemaining: Math.floor(hoursRemaining),  // hours remaining
        hoursRemaining: hoursRemaining.toFixed(2), // hours remaining, keep 2 number after comma
      };
    });

    res.status(200).json(adsWithRemainingHours);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ads" });
  }
};

/* DELETE */
export const destroyAds = async (req, res) => {
  try {
    const { id } = req.params;
    await Ads.findByIdAndDelete(id);
    console.log("delete");
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ad" });
  }
};

