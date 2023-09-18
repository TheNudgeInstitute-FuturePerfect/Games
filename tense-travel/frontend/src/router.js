import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./features/word-game/Home";

export default createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      // {
      //   path: "/",
      //   element: <Home />,
      // },
    ],
  },
]);
