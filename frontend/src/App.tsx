import { Outlet, Route, Routes } from "react-router";
import Login from "./pages/Login/Login";
import Layout from "./pages/Layout/Layout";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Sessions from "./pages/Sessions/Sessions";
import SingleSession from "./pages/Sessions/SingleSession";
import History from "./pages/History/History";
import Scripts from "./pages/Scripts/Scripts";
import Logout from "./pages/Logout/Logout";
import NotFound from "./pages/NotFound/NotFound";
import Example from "./pages/Example/Example";

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="sessions" element={<Outlet />}>
          <Route index element={<Sessions />} />
          <Route path=":id" element={<SingleSession />} />
        </Route>
        <Route path="history" element={<History />}></Route>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="scripts" element={<Scripts />} />
        <Route path="logout" element={<Logout />} />
        <Route path="example/:id?" element={<Example />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
