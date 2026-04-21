import { Route, Routes } from "react-router";

function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <h1 className="text-3xl font-bold text-blue-600 p-8">
            Tailwind fonctionne !
          </h1>
        }
      />
    </Routes>
  );
}

export default Router;
