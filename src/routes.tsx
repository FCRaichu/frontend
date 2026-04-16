import { createBrowserRouter } from "react-router-dom";
import { queryClient } from "./QueryClient";

import { playersLoader } from "./features/donation/api/player";

import RootLayout from "./layouts/RootLayout";
import PostWriteBaseLayout from "./layouts/PostBaseLayout";
import MyPostLayout from "./layouts/MyPostLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Donation from "./pages/Donation";
import PostDetail from "./pages/PostDetail";

import RecordWriteStep from "./features/post/components/write/RecordWriteStep";
import { GamePicker } from "./features/post/components/write/GamePickerStep";
import { AllPosts } from "./features/post/components/list/AllPosts";
import Betting from "./pages/Betting";
import Admin from "./pages/Admin";

// React Router 팀에서 권장하는 Data APIs & 객체 스타일 방식을 사용해 보았다.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "admin", element: <Admin /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      {
        path: "donation",
        element: <Donation />,
        loader: playersLoader(queryClient),
      },
      {
        path: "betting",
        element: <Betting />,
      },
      {
        path: "post",
        element: <PostWriteBaseLayout />,
        children: [
          { index: true, element: <GamePicker /> },
          { path: "new", element: <RecordWriteStep /> },
          { path: "edit/:postId", element: <RecordWriteStep /> },
        ],
      },
      {
        path: "post/:userId",
        element: <MyPostLayout />,
        children: [
          { path: "all", element: <AllPosts /> },
          { path: "detail/:postId", element: <PostDetail /> },
        ],
      },
    ],
  },
]);
