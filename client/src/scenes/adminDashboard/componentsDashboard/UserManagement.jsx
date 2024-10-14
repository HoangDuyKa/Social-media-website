import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);

  // Fetch posts from the API when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/getUsersForSidebar`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // const allUsers = data.data;

      // Map the fetched data to match the DataGrid row format
      const formattedUsers = data.map((user) => ({
        id: user._id,
        name: user.firstName + " " + user.lastName, // Adjust as needed to show the author's name
        email: user.email,
        role: user.role,
        lock:user.lock
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/users/${id}/force`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const formattedUsers = data.map((user) => ({
        id: user._id,
        name: user.firstName + " " + user.lastName, // Adjust as needed to show the author's name
        email: user.email,
        role: user.role,
        lock:user.lock
      }));

      setUsers(formattedUsers);
      if (data.error) {
        throw new Error(data.error);
      }
      // dispatch(setPosts({ posts: data }));
      toast.success("Deleted Forever Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLock = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/users/${id}/lock`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();

      const allUsers = data.data;
      const formattedUsers = allUsers.map((user) => ({
        id: user._id,
        name: user.firstName + " " + user.lastName, // Adjust as needed to show the author's name
        email: user.email,
        role: user.role,
        lock:user.lock
      }));

      setUsers(formattedUsers);
      if (data.error) {
        throw new Error(data.error);
      }
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 210  ,
      renderCell: (params) => (
        <>
        <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 10, minWidth:90 }}
            onClick={() => handleLock(params.row.id)}
          >
             {params.row.lock === true ? "Unlock" : "Lock"} 
          </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </Button>
        </>
      ),
    },
  ];

  // const rows = [
  //   { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "User" },
  //   { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "Admin" },
  // ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={users} columns={columns} pageSize={5} />
    </div>
  );
};

export default UserManagement;
