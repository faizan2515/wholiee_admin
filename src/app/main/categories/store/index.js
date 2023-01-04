import { combineReducers } from "@reduxjs/toolkit";
import categories from "./categoriesSlice";

const reducer = combineReducers({
  categories,
});

export default reducer;
