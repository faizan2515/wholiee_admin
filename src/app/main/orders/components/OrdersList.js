import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrder,
  getOrders,
  selectOrders,
  setOrder,
} from "../store/ordersSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

const OrdersList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    isOpen: false,
    id: null,
  });
  const { orders } = useSelector(selectOrders);

  const handleDelete = (id) => {
    dispatch(deleteOrder(id)).then(() => {
      dispatch(getOrders());
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
                first name
              </th>
              <th scope="col" className="px-24 py-16">
                last name
              </th>
              <th scope="col" className="px-24 py-16">
                email
              </th>
              <th scope="col" className="px-24 py-16">
                country
              </th>
              <th scope="col" className="px-24 py-16">
                city
              </th>
              <th scope="col" className="px-24 py-16">
                state
              </th>
              <th scope="col" className="px-24 py-16">
                address
              </th>
              <th scope="col" className="px-24 py-16">
                zipcode
              </th>
              <th scope="col" className="px-24 py-16">
                product ids
              </th>
              <th scope="col" className="px-24 py-16">
                total
              </th>

              <th scope="col" className="px-24 py-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="bg-white border-b" key={order.id}>
                <td className="px-24 py-20">{order.First_name}</td>
                <td className="px-24 py-20">{order.Last_name}</td>
                <td className="px-24 py-20">{order.Email}</td>
                <td className="px-24 py-20">{order.Country}</td>
                <td className="px-24 py-20">{order.City}</td>
                <td className="px-24 py-20">{order.State}</td>
                <td className="px-24 py-20">{order.Address}</td>
                <td className="px-24 py-20">{order.Zipcode}</td>
                <td className="px-24 py-20">{order.Product_ids}</td>
                <td className="px-24 py-20">{order.Total}</td>
                <td className="px-24 py-20 flex gap-10">
                  <FuseSvgIcon
                    size={20}
                    onClick={() => dispatch(setOrder(order))}
                    className="hover:text-blue cursor-pointer"
                  >
                    heroicons-solid:pencil-alt
                  </FuseSvgIcon>
                  <FuseSvgIcon
                    size={20}
                    onClick={() => setOpen({ isOpen: true, id: order.id })}
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

export default OrdersList;
