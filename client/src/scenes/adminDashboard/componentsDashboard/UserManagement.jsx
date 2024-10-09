import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const UserManagement = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(params.row.id)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const rows = [
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "User" },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "Admin" },
  ];

  const handleEdit = (id) => {
    // Xử lý khi click nút sửa
    console.log("Edit user:", id);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
};

export default UserManagement;
