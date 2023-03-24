import _ from "@lodash";
import { Button, Typography } from "@mui/material";
import withReducer from "app/store/withReducer";
import reducer from "./store";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, selectOrders } from "./store/ordersSlice";
import { useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import OrdersList from "./components/OrdersList";
import OrderDialog from "./components/OrderDialog";

const Orders = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectOrders);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrders());
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
              Orders
            </Typography>
          </div>
          <div className="flex items-center sm:mt-0 sm:mx-8 space-x-12">
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
          </div>
        </div>
        <OrdersList />
      </div>
      <OrderDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default withReducer("orders", reducer)(Orders);