import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  getUsers,
  selectUsers,
  setUser,
} from "../store/usersSlice";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { selectUser } from "app/store/userSlice";

const ProductsList = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState({
    isOpen: false,
    id: null,
  });
  const { users } = useSelector(selectUsers);
  const { role } = useSelector(selectUser);

  const handleDelete = (id) => {
    dispatch(deleteUser(id)).then(() => {
      dispatch(getUsers());
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
                email
              </th>
              <th scope="col" className="px-24 py-16">
                name
              </th>
              <th scope="col" className="px-24 py-16">
                role
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
            {users.map((user) => (
              <tr className="bg-white border-b" key={user.id}>
                <td className="px-24 py-20">{user.email}</td>
                <td className="px-24 py-20">{user.name}</td>
                <td className="px-24 py-20 uppercase">{user.role}</td>
                <td className="px-24 py-20">
                  {user.status === "Pending" ? (
                    <p className="bg-yellow-900 text-white text-center rounded-full p-4">
                      Pending
                    </p>
                  ) : user.status === "Approved" ? (
                    <p className="bg-green-900 text-white text-center rounded-full p-4">
                      Approved
                    </p>
                  ) : user.status === "Rejected" ? (
                    <p className="bg-red-900 text-white text-center rounded-full p-4">
                      Rejected
                    </p>
                  ) : (
                    user.status
                  )}
                </td>

                {role === "admin" && (
                  <td className="px-24 py-20 flex gap-10">
                    <FuseSvgIcon
                      size={20}
                      onClick={() => dispatch(setUser(user))}
                      className="hover:text-blue cursor-pointer"
                    >
                      heroicons-solid:pencil-alt
                    </FuseSvgIcon>
                    {/* <FuseSvgIcon
                      size={20}
                      onClick={() => setOpen({ isOpen: true, id: user.id })}
                      className="hover:text-red cursor-pointer"
                    >
                      heroicons-solid:trash
                    </FuseSvgIcon> */}
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

export default ProductsList;
