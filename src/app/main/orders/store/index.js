import { combineReducers } from "@reduxjs/toolkit";
import orders from "./ordersSlice";

const reducer = combineReducers({
  orders,
});

export default reducer;
