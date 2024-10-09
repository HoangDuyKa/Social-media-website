import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Dữ liệu mẫu cho biểu đồ
const barData = [
  { name: "Tháng 1", posts: 30 },
  { name: "Tháng 2", posts: 45 },
  { name: "Tháng 3", posts: 60 },
  { name: "Tháng 4", posts: 50 },
  { name: "Tháng 5", posts: 70 },
  { name: "Tháng 6", posts: 80 },
];

const pieData = [
  { name: "Hôm nay", value: 10 },
  { name: "Tháng này", value: 150 },
];

const COLORS = ["#0088FE", "#00C49F"];

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  // Thống kê số lượng bài viết và người dùng
  const totalPosts = 200; // Thay bằng dữ liệu thực tế
  const usersToday = 10; // Thay bằng dữ liệu thực tế
  const usersThisMonth = 150; // Thay bằng dữ liệu thực tế

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Widget Tổng Số Bài Viết */}
        <Grid item xs={12} sm={4}>
          <Item>
            <Typography variant="h6">Tổng Số Bài Viết</Typography>
            <Typography variant="h4">{totalPosts}</Typography>
          </Item>
        </Grid>
        {/* Widget Người Dùng Hôm Nay */}
        <Grid item xs={12} sm={4}>
          <Item>
            <Typography variant="h6">Người Dùng Hôm Nay</Typography>
            <Typography variant="h4">{usersToday}</Typography>
          </Item>
        </Grid>
        {/* Widget Người Dùng Tháng Này */}
        <Grid item xs={12} sm={4}>
          <Item>
            <Typography variant="h6">Người Dùng Tháng Này</Typography>
            <Typography variant="h4">{usersThisMonth}</Typography>
          </Item>
        </Grid>
        {/* Biểu đồ Cột Số Bài Viết Theo Tháng */}
        <Grid item xs={12} md={8}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Số Bài Viết Theo Tháng
            </Typography>
            <BarChart width={600} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="posts" fill="#8884d8" />
            </BarChart>
          </Item>
        </Grid>
        {/* Biểu đồ Tròn Thống Kê Người Dùng */}
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6" gutterBottom>
              Thống Kê Người Dùng
            </Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
