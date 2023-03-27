import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrder,
  getOrders,
  getSupplierOrders,
  selectOrders,
  setOrder,
  updateOrder,
} from "../store/ordersSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { selectUser } from "app/store/userSlice";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const orderStatus = ["Pending", "Accepted", "Rejected", "Completed"];

const OrdersList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    isOpen: false,
    id: null,
  });
  const { orders } = useSelector(selectOrders);
  const { role, data } = useSelector(selectUser);

  const handleDelete = (id) => {
    dispatch(deleteOrder(id)).then(() => {
      dispatch(getOrders());
    });
  };

  const handleStatusChange = (e, order) => {
    const updateOrderStatus = { ...order, status: e.target.value };
    dispatch(updateOrder(updateOrderStatus)).then(() => {
      if (role === "admin") {
        dispatch(getOrders());
      } else {
        dispatch(getSupplierOrders(data.id));
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
                product quantities
              </th>
              <th scope="col" className="px-24 py-16">
                total
              </th>

              <th scope="col" className="px-24 py-16">
                status
              </th>
              {role === "admin" && (
                <th scope="col" className="px-24 py-16">
                  Action
                </th>
              )}
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
                <td className="px-24 py-20">{order.quantity}</td>
                <td className="px-24 py-20">{order.Total}</td>
                <td className="px-24 py-20">
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(e, order)}
                      displayEmpty
                    >
                      {orderStatus.map((status) => (
                        <MenuItem value={status} key={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </td>
                {role === "admin" && (
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
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrdersList;
