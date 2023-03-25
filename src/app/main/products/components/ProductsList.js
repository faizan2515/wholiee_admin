import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getProducts,
  getUserProducts,
  selectProducts,
  setProduct,
} from "../store/productsSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { selectUser } from "app/store/userSlice";
import { Typography } from "@mui/material";

const ProductsList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    isOpen: false,
    id: null,
  });
  const { products } = useSelector(selectProducts);
  const { role, data } = useSelector(selectUser);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id)).then(() => {
      if (role === "admin") {
        dispatch(getProducts());
      } else if (role === "wholeseller") {
        dispatch(getUserProducts(data.id));
      }
    });
  };

  return (
    <>
      <ConfirmationDialog
        open={open}
        setOpen={setOpen}
        handleDelete={handleDelete}
      />
      {!_.isEmpty(products) ? (
        <div className="relative overflow-x-auto shadow-md rounded-lg mt-32">
          <table className="w-full text-lg text-left text-gray-900">
            <thead className="uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-24 py-16">
                  id
                </th>
                <th scope="col" className="px-24 py-16">
                  name
                </th>
                <th scope="col" className="px-24 py-16">
                  description
                </th>
                <th scope="col" className="px-24 py-16">
                  category
                </th>
                <th scope="col" className="px-24 py-16">
                  image
                </th>
                <th scope="col" className="px-24 py-16">
                  available quantity
                </th>
                <th scope="col" className="px-24 py-16">
                  price per item
                </th>
                <th scope="col" className="px-24 py-16">
                  status
                </th>

                {/* {role === "admin" && ( */}
                <th scope="col" className="px-24 py-16">
                  Action
                </th>
                {/* )} */}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="bg-white border-b" key={product.id}>
                  <td className="px-24 py-20">{product.id}</td>
                  <td className="px-24 py-20">{product.Product_name}</td>
                  <td className="px-24 py-20">{product.Product_Description}</td>
                  <td className="px-24 py-20">{product.Product_Category}</td>
                  <td className="px-24 py-20">
                    <img src={product.Product_Image} className="w-32" />
                  </td>
                  <td className="px-24 py-20">
                    {product.Product_Available_Qty}
                  </td>
                  <td className="px-24 py-20">{product.Product_Per_Price}</td>
                  <td className="px-24 py-20">
                    {product.Product_status === "Pending" ? (
                      <p className="bg-yellow-900 text-white text-center rounded-full p-4">
                        Pending
                      </p>
                    ) : product.Product_status === "Approved" ? (
                      <p className="bg-green-900 text-white text-center rounded-full p-4">
                        Approved
                      </p>
                    ) : (
                      <p className="bg-red-900 text-white text-center rounded-full p-4">
                        Rejected
                      </p>
                    )}
                  </td>
                  {/* {role === "admin" && ( */}
                  <td className="px-24 py-20 flex gap-10">
                    <FuseSvgIcon
                      size={20}
                      onClick={() => dispatch(setProduct(product))}
                      className="hover:text-blue cursor-pointer"
                    >
                      heroicons-solid:pencil-alt
                    </FuseSvgIcon>
                    <FuseSvgIcon
                      size={20}
                      onClick={() => setOpen({ isOpen: true, id: product.id })}
                      className="hover:text-red cursor-pointer"
                    >
                      heroicons-solid:trash
                    </FuseSvgIcon>
                  </td>
                  {/* )} */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Typography className="text-center mt-40 text-2xl font-medium  text-gray-400">
          No products found
        </Typography>
      )}
    </>
  );
};

export default ProductsList;
