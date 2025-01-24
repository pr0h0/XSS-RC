import { Outlet, useNavigate } from "react-router";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Footer from "../../Components/Footer/Footer";
import LayoutWrapper from "../../Components/LayoutWrapper/LayoutWrapper";
import { useContext, useEffect, useState } from "react";
import { StateContext } from "../../data/stateContext";
import LogService from "../../services/LogService";
import authService from "../../services/AuthService";
import Loading from "../../Components/Loading/Loading";
import dataService from "../../services/DataService";

export default function Layout() {
  const { value, update } = useContext(StateContext);
  const [hasAccess, setHasAccess] = useState(value.hasAccess);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const hasAccess = await authService.check();
        setHasAccess(hasAccess);
        update({ hasAccess });
        const data = await dataService.getInitialData();
        update(data);
        setLoading(false);
      } catch (e: unknown) {
        LogService.log(e as Error);
        navigation("/login");
      }
    })();
  }, [value.hasAccess]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <LayoutWrapper className="justify-center items-center">
        <Loading />
      </LayoutWrapper>
    );
  }

  if (!hasAccess) {
    navigation("/login");
  }

  return (
    <LayoutWrapper>
      <Sidebar />
      <div className="flex flex-col flex-1 h-full max-h-screen overflow-auto">
        <Outlet />
        <Footer />
      </div>
    </LayoutWrapper>
  );
}
