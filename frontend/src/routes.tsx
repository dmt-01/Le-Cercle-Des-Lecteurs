import { Route, Routes } from "react-router";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
    </Routes>
  );
}

export default Router;