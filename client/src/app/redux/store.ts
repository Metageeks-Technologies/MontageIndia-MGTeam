import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./feature/user/slice";
import productSlice from "./feature/product/slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
