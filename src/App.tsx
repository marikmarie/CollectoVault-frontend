
// // src/App.tsx

// // src/App.tsx
// import React , {type JSX} from "react";
// import { RouterProvider } from "react-router-dom";
// import { AppRoutes } from "./routes/AppRoutes";
// import "./index.css"; // TailwindCSS

// const App: React.FC = (): JSX.Element => {
//   return (

//       <RouterProvider router={AppRoutes} />
//  );
// };

// export default App;


import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={AppRoutes} />
    </AuthProvider>
  );
}
