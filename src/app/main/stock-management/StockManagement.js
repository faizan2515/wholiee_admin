import _ from "@lodash";
import { Typography } from "@mui/material";
import withReducer from "app/store/withReducer";
import reducer from "../products/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  getUserProducts,
  selectProducts,
} from "../products/store/productsSlice";
import { useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import StockManagementList from "./components/StockManagementList";
import StockManagementDialog from "./components/StockManagementDialog";
import { selectUser } from "app/store/userSlice";
import { getCategories } from "../categories/store/categoriesSlice";

const StockManagement = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { isLoading } = useSelector(selectProducts);
  const [open, setOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLocalLoading(true);
    if (user.role === "admin") {
      dispatch(getCategories()).then((response) => {
        setCategories(response.payload.data.data);
        setLocalLoading(false);
        dispatch(getProducts());
      });
    } else if (user.role === "wholeseller") {
      dispatch(getCategories()).then((response) => {
        setCategories(response.payload.data.data);
        setLocalLoading(false);
        dispatch(getUserProducts(user.data.id));
      });
    }
  }, [dispatch]);

  if (isLoading || localLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="w-full container p-24 md:p-32">
        <div className="flex flex-auto items-center min-w-0">
          <div className="flex flex-col flex-auto">
            <Typography className="text-3xl font-semibold tracking-tight leading-8">
              Stock Management
            </Typography>
          </div>
        </div>
        <StockManagementList categories={categories} />
      </div>
      <StockManagementDialog
        open={open}
        setOpen={setOpen}
        categories={categories}
      />
    </>
  );
};

export default withReducer("products", reducer)(StockManagement);
