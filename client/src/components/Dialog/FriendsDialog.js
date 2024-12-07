import React, { useEffect } from "react";
import { Dialog, DialogContent, Slide, Stack, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  FriendElement,
  FriendRequestElement,
  UserElement,
} from "components/UserElement";
import { FetchFriendRequests, FetchUsers } from "Redux/Slice/app";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UsersList = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.app);

  //   const { token } = useSelector((state) => state.auth);
  //   const getUsers = async () => {
  //     const response = await fetch(`http://localhost:3001/users/get-users`, {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await response.json();
  //     dispatch(updateUsers({ users: data.data }));
  //   };

  useEffect(() => {
    dispatch(FetchUsers());
    // getUsers();
  }, []);

  return (
    <>
      {users.map((el, idx) => {
        return <UserElement key={idx} {...el} />;
      })}
    </>
  );
};

const FriendsList = () => {
  const { friends } = useSelector((state) => state.auth.user);

  return (
    <>
      {friends.length >= 1 ? (
        friends.map((el, idx) => {
          return <FriendElement key={idx} {...el} />;
        })
      ) : (
        <div>There are no friend</div>
      )}
    </>
  );
};

const RequestsList = () => {
  const dispatch = useDispatch();

  const { friendRequests } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, []);

  return (
    <>
      {friendRequests ? (
        friendRequests.map((el, idx) => {
          return <FriendRequestElement key={idx} {...el.sender} id={el._id} />;
        })
      ) : (
        <div>There are no friend request</div>
      )}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      {/* <DialogTitle>{"Friends"}</DialogTitle> */}
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Explore" />
          <Tab label="Friends" />
          <Tab label="Requests" />
        </Tabs>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.4}>
            {(() => {
              switch (value) {
                case 0: // display all users in this list
                  return <UsersList />;

                case 1: // display friends in this list
                  return <FriendsList />;

                case 2: // display request in this list
                  return <RequestsList />;

                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
