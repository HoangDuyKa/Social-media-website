import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.auth.token);
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();

  // Fetch posts from the API when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      // Map the fetched data to match the DataGrid row format
      const formattedPosts = data.map((post) => ({
        id: post._id,
        title: post.description,
        author: post.userPost?.firstName + " " + post.userPost?.lastName, // Adjust as needed to show the author's name
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${id}/adminForce`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const formattedPosts = data.map((post) => ({
        id: post._id,
        title: post.description,
        author: post.userPost.firstName + " " + post.userPost.lastName, // Adjust as needed to show the author's name
      }));

      setPosts(formattedPosts);
      if (data.error) {
        throw new Error(data.error);
      }
      // dispatch(setPosts({ posts: data }));
      toast.success("Deleted Forever Successfully");
    } catch (error) {
      toast.error(error.message);
    }
    // console.log("Delete post:", id);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 300 },
    { field: "author", headerName: "Author", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              navigate(`/detail/post/${params.row.id}`);
            }}
          >
            Detail
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
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchKey.toLowerCase()) ||
      post.author.toLowerCase().includes(searchKey.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Search by title and author"
          variant="outlined"
          fullWidth
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={filteredPosts} columns={columns} pageSize={5} />
      </div>
    </div>
  );
};

export default PostManagement;
