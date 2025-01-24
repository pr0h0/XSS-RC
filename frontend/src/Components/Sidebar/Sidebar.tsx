import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import Icon from "../Icon/Icon";

export default function Sidebar() {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setToggle(localStorage.getItem("sidebarToggle") === "true");
  }, []);

  const handleToggle = () => {
    setToggle((p) => {
      localStorage.setItem("sidebarToggle", (!p).toString());
      return !p;
    });
  };

  return (
    <aside
      id="sidebar"
      className={`bg-white flex flex-col ${
        toggle ? "w-72" : "w-auto"
      } py-4 px-5 border-r border-solid border-black h-screen`}
    >
      <nav className="w-full flex flex-col">
        <ul className="w-full flex flex-col gap-8">
          <li>
            <div
              className="flex font-medium items-center justify-start text-gray-900"
              title="XSS - RC"
            >
              <Icon
                name="eye"
                className="min-w-10 w-10 h-10 text-white p-2 bg-blue-500 rounded-full"
              />
              <span className={`ml-3 text-xl ${toggle ? "" : "hidden"}`}>
                XSS - RC
              </span>
            </div>
            <hr className="mt-4 border-t border-gray-500" />
          </li>
          <li>
            <button
              title="Toggle sidebar"
              className="w-full h-8 flex items-center justify-start gap-4 cursor-pointer hover:brightness-0 text-blue-500"
              onClick={handleToggle}
            >
              <Icon name="hamburger" className="w-10 min-w-10 h-10 ml-1" />
              <span className={`flex-1 text-left ${toggle ? "" : "hidden"}`}>
                Toggle Sidebar
              </span>
            </button>
            <hr className="mt-8 border-t border-gray-500" />
          </li>
          <li>
            <NavLink
              title="Home"
              className="w-full h-8 flex items-center justify-start gap-4 hover:brightness-0 text-blue-500"
              to="/"
            >
              <Icon name="home" className="min-w-10 w-10 h-10" />
              <span className={`${toggle ? "" : "hidden"}`}>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              title="Dashboard"
              className="w-full h-8 flex items-center justify-start gap-4 hover:brightness-0 text-blue-500"
              to="/dashboard"
            >
              <Icon name="dashboard" className="min-w-10 w-10 h-10" />
              <span className={`${toggle ? "" : "hidden"}`}>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              title="Sessions"
              className="w-full h-8 flex items-center justify-start gap-4 hover:brightness-0 text-blue-500"
              to="/sessions"
            >
              <Icon name="session" className="min-w-10 w-10 h-10" />
              <span className={`${toggle ? "" : "hidden"}`}>Sessions</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              title="History"
              className="w-full h-8 flex items-center justify-start gap-4 hover:brightness-0 text-blue-500"
              to="/history"
            >
              <Icon name="history" className="min-w-10 w-10 h-10" />
              <span className={`${toggle ? "" : "hidden"}`}>History</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              title="Scripts"
              className="w-full h-8 flex items-center justify-start gap-4 hover:brightness-0 text-blue-500"
              to="/scripts"
            >
              <Icon name="script" className="min-w-10 w-10 h-10" />
              <span className={`${toggle ? "" : "hidden"}`}>Scripts</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              title="Logout"
              className="w-full h-8 flex items-center justify-start gap-4 hover:brightness-0 text-blue-500"
              to="/logout"
            >
             <Icon name="logout" className="min-w-10 w-10 h-10" />
              <span className={`${toggle ? "" : "hidden"}`}>Logout</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
