import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getCategories,
  selectCategories,
  setCategory,
} from "../store/categoriesSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

const CategoriesList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    isOpen: false,
    id: null,
  });
  const { categories } = useSelector(selectCategories);

  const handleDelete = (id) => {
    dispatch(deleteCategory(id)).then(() => {
      dispatch(getCategories());
    });
  };

  return (
    <>
      <ConfirmationDialog
        open={open}
        setOpen={setOpen}
        handleDelete={handleDelete}
      />
      <div className="relative overflow-x-auto shadow-md rounded-lg mt-32">
        <table className="w-full text-lg text-left text-gray-900">
          <thead className="uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-24 py-16">
                name
              </th>
              <th scope="col" className="px-24 py-16">
                min quantity
              </th>
              <th scope="col" className="px-24 py-16">
                max quantity
              </th>

              <th scope="col" className="px-24 py-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr className="bg-white border-b" key={category.id}>
                <td className="px-24 py-20">{category.category}</td>
                <td className="px-24 py-20">
                  {category.category_min_quantity}
                </td>
                <td className="px-24 py-20">
                  {category.category_max_quantity}
                </td>
                <td className="px-24 py-20 flex gap-10">
                  <FuseSvgIcon
                    size={20}
                    onClick={() => dispatch(setCategory(category))}
                    className="hover:text-blue cursor-pointer"
                  >
                    heroicons-solid:pencil-alt
                  </FuseSvgIcon>
                  <FuseSvgIcon
                    size={20}
                    onClick={() => setOpen({ isOpen: true, id: category.id })}
                    className="hover:text-red cursor-pointer"
                  >
                    heroicons-solid:trash
                  </FuseSvgIcon>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CategoriesList;
