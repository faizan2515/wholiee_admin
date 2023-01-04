import _ from "@lodash";
import { Button, Typography } from "@mui/material";
import withReducer from "app/store/withReducer";
import reducer from "./store";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, selectCategories } from "./store/categoriesSlice";
import { useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import CategoriesList from "./components/CategoriesList";
import CategoryDialog from "./components/CategoryDialog";

const Categories = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectCategories);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="w-full container p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0">
          <div className="flex flex-col flex-auto">
            <Typography className="text-3xl font-semibold tracking-tight leading-8">
              Categories
            </Typography>
          </div>
          <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
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
        <CategoriesList />
      </div>
      <CategoryDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default withReducer("categories", reducer)(Categories);
