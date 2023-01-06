import _ from "@lodash";
import { Typography } from "@mui/material";
import withReducer from "app/store/withReducer";
import reducer from "./store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import UsersList from "./components/UsersList";
import UserDialog from "./components/UserDialog";
import { selectUser } from "app/store/userSlice";
import { getUsers, selectUsers } from "./store/usersSlice";

const Users = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { isLoading } = useSelector(selectUsers);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user.role === "admin") {
      dispatch(getUsers());
    }
  }, [dispatch]);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="w-full container p-24 md:p-32">
        <div className="flex flex-auto items-center min-w-0">
          <div className="flex flex-col flex-auto">
            <Typography className="text-3xl font-semibold tracking-tight leading-8">
              Users
            </Typography>
          </div>
          {/* <div className="flex items-center sm:mt-0 sm:mx-8 space-x-12">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="secondary"
              onClick={() => setOpen(true)}
              startIcon={
                <FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>
              }
            >
              Add
            </Button>
          </div> */}
        </div>
        <UsersList />
      </div>
      <UserDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default withReducer("users", reducer)(Users);
