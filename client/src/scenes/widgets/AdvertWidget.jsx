import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.auth.token);
  const [ads, setAds] = useState([]);

   // Fetch ads from the API
   useEffect(() => {
    fetchAds();
  }, []);

  const handleNavigation = () => {
    // Điều hướng đến một URL bên ngoài
    // window.location.href = ads.websiteUrl; // Điều hướng đến URL từ ads.websiteUrl

    window.open(ads.websiteUrl, '_blank'); // Mở URL trong tab mới
  };

  const fetchAds = async () => {
    try {
      const response = await fetch(`${apiUrl}/ads/random`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  return (
    <WidgetWrapper style={{ maxHeight: '350px', overflow: 'hidden', cursor:"pointer" }} onClick={handleNavigation}>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween >
      <img
        // width="100%"
        width={250}
        height="auto"
        alt="advert"
        // src="https://res.cloudinary.com/dv2rpmss3/image/upload/v1717973473/images/Ads.jpg"
        src={ads.imageUrl}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween style={{maxWidth:"250px"}}>
        <Typography color={main}>{ads.branch}</Typography>
        <Typography  sx={{
       display: '-webkit-box',
       WebkitLineClamp: 1, // Giới hạn số dòng
       WebkitBoxOrient: 'vertical',
       overflow: 'hidden',
       textOverflow: 'ellipsis',
       flexGrow: 1, // Cho phép websiteUrl chiếm hết phần còn lại của dòng
       marginLeft: '8px', // Khoảng cách giữa branch và websiteUrl
    }} color={medium}>{ads.websiteUrl}</Typography>
        {/* <Typography color={main}>MikaCosmetics</Typography>
        
        <Typography color={medium}>mikacosmetics.com</Typography> */}
      </FlexBetween>
      {/* <Typography color={medium} m="0.5rem 0">
        Your pathway to stunning and immaculate beauty and made sure your skin
        is exfoliating skin and shining like light.
      </Typography> */}
       <Typography color={medium} m="0.5rem 0"  sx={{
      display: '-webkit-box',
      WebkitLineClamp: 4, // Giới hạn số dòng
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}>
        {ads.description}
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
