// import React from 'react'

// import './index.css'
// import AppRoutes from './routes/AppRoutes'

// const App: React.FC = () => {
//   return (
//     <AppRoutes />
//   );
// }

// export default App


// src/App.tsx

// src/App.tsx
import React , {type JSX} from "react";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import "./index.css"; // TailwindCSS

const App: React.FC = (): JSX.Element => {
  return (

      <RouterProvider router={AppRoutes} />

  );
};

export default App;
