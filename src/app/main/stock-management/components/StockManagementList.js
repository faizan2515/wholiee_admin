import { useDispatch, useSelector } from "react-redux";
import { setProduct, selectProducts } from "../../products/store/productsSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Typography } from "@mui/material";

const StockManagementList = ({ categories }) => {
  const dispatch = useDispatch();
  const { products } = useSelector(selectProducts);

  return (
    <>
      {!_.isEmpty(products) ? (
        <div className="relative overflow-x-auto shadow-md rounded-lg mt-32">
          <table className="w-full text-lg text-left text-gray-900">
            <thead className="uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-24 py-16">
                  name
                </th>
                <th scope="col" className="px-24 py-16">
                  category
                </th>
                <th scope="col" className="px-24 py-16">
                  available quantity
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
              {products.map((product) => (
                <tr className="bg-white border-b" key={product.id}>
                  <td className="px-24 py-20">{product.Product_name}</td>
                  <td className="px-24 py-20">{product.Product_Category}</td>
                  <td className="px-24 py-20">
                    {product.Product_Available_Qty}
                  </td>
                  <td className="px-24 py-20">
                    {
                      categories.find(
                        (category) =>
                          category.category === product.Product_Category
                      )?.category_min_quantity
                    }
                  </td>
                  <td className="px-24 py-20">
                    {
                      categories.find(
                        (category) =>
                          category.category === product.Product_Category
                      )?.category_max_quantity
                    }
                  </td>
                  <td className="px-24 py-20">
                    <FuseSvgIcon
                      size={20}
                      onClick={() => dispatch(setProduct(product))}
                      className="hover:text-blue cursor-pointer"
                    >
                      heroicons-solid:pencil-alt
                    </FuseSvgIcon>
                  </td>
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

export default StockManagementList;
