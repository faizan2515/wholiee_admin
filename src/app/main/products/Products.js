import _ from "@lodash";
import { Button, Typography } from "@mui/material";
import withReducer from "app/store/withReducer";
import reducer from "./store";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  getUserProducts,
  selectProducts,
} from "./store/productsSlice";
import { useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ProductsList from "./components/ProductsList";
import ProductDialog from "./components/ProductDialog";
import { selectUser } from "app/store/userSlice";

const Products = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { isLoading } = useSelector(selectProducts);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user.role === "admin") {
      dispatch(getProducts());
    } else if (user.role === "wholeseller") {
      dispatch(getUserProducts(user.data.id));
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
              Products
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
        <ProductsList />
      </div>
      <ProductDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default withReducer("products", reducer)(Products);
