import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const AdvertManagement = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.auth.token);
  const [ads, setAds] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const [adData, setAdData] = useState({
    websiteUrl: "",
    description: "",
    expireInHours: "", // Người dùng nhập số giờ quảng cáo được bật
    branch: "", // Người dùng nhập số giờ quảng cáo được bật
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch ads from the API
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch(`${apiUrl}/ads`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      // Tính toán số giờ còn lại
      const formattedAds = data.map((ad) => ({
        id: ad._id, // Dùng _id của MongoDB làm id
        imageUrl: ad.imageUrl,
        branch: ad.branch,
        websiteUrl: ad.websiteUrl,
        description: ad.description,
        hoursRemaining: ad.hoursRemaining,
        // hoursRemaining: calculateHoursRemaining(ad.expireDate), // Tính số giờ còn lại
        enabled: ad.enabled,
      }));

      setAds(formattedAds);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  // // Hàm tính số giờ còn lại dựa trên expireDate
  // const calculateHoursRemaining = (expireDate) => {
  //   const currentTime = new Date();
  //   const timeDifference = new Date(expireDate) - currentTime;
  //   return Math.floor(timeDifference / (1000 * 60 * 60), 0);  // Chuyển mili-giây thành giờ
  // };

  // Handle form submission to create a new ad
  const handleCreateAd = async () => {
    const formData = new FormData();
    formData.append("picture", selectedFile); // Append selected file for upload
    formData.append("websiteUrl", adData.websiteUrl);
    formData.append("branch", adData.branch);
    formData.append("description", adData.description);
    formData.append("expireInHours", adData.expireInHours); // Truyền số giờ quảng cáo được bật

    try {
      const response = await fetch(`${apiUrl}/ads/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send FormData containing the file and other ad data
      });

      const newAds = await response.json();
      const newAd = newAds.savedAd;

      // Thêm quảng cáo mới vào danh sách
      if (newAd && newAd._id) {
        setAds((prev) => [
          ...prev,
          {
            id: newAd._id, // Dùng _id làm id cho quảng cáo mới
            imageUrl: newAd.imageUrl,
            branch: newAd.branch,
            websiteUrl: newAd.websiteUrl,
            description: newAd.description,
            // hoursRemaining: calculateHoursRemaining(newAd.expireDate), // Tính số giờ còn lại
            hoursRemaining: newAds.hoursRemaining,
            enabled: newAd.enabled,
          },
        ]);
        toast.success("Ad created successfully!");
      } else {
        toast.error("Failed to create ad: Missing ID");
      }
    } catch (error) {
      toast.error("Error creating ad.");
    }
  };

  const handleDeleteAd = async (id) => {
    try {
      await fetch(`${apiUrl}/ads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds((prev) => prev.filter((ad) => ad.id !== id));
      toast.success("Ad deleted successfully!");
    } catch (error) {
      toast.error("Error deleting ad.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "imageUrl", headerName: "Image URL", width: 200 },
    { field: "branch", headerName: "Branch", width: 200 },
    { field: "websiteUrl", headerName: "Website URL", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    // { field: "hoursRemaining", headerName: "Hours Remaining", width: 150 },
    {
      field: "hoursRemaining",
      headerName: "Hours Remaining",
      width: 150,
      // Render custom logic để hiển thị "Expired" nếu hoursRemaining là 0
      renderCell: (params) => (
        <span>{params.value > 0 ? `${params.value} hours` : "Expired"}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 210,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteAd(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const filteredAds = ads.filter(
    (ad) =>
      ad.branch.toLowerCase().includes(searchKey.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchKey.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <div>
        <div style={{ marginBottom: "20px" }}>
          <TextField
            label="Search by branch and description"
            variant="outlined"
            fullWidth
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
      </div>

      <div>
        <TextField
          label="Website URL"
          value={adData.websiteUrl}
          onChange={(e) =>
            setAdData((prev) => ({ ...prev, websiteUrl: e.target.value }))
          }
        />
        <TextField
          label="Branch"
          value={adData.branch}
          onChange={(e) =>
            setAdData((prev) => ({ ...prev, branch: e.target.value }))
          }
        />
        <TextField
          label="Description"
          value={adData.description}
          onChange={(e) =>
            setAdData((prev) => ({ ...prev, description: e.target.value }))
          }
        />
        <TextField
          label="Expire In Hours"
          sx={{ width: "150px" }}
          type="number"
          value={adData.expireInHours}
          onChange={(e) =>
            setAdData((prev) => ({ ...prev, expireInHours: e.target.value }))
          }
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <Button variant="contained" color="primary" onClick={handleCreateAd}>
          Create Ad
        </Button>
      </div>

      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={filteredAds}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id} // Sử dụng trường id
        />
      </div>
    </div>
  );
};

export default AdvertManagement;
