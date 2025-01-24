import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import authService from "../../services/AuthService";
import { StateContext } from "../../data/stateContext";

export default function Logout() {
  const { update } = useContext(StateContext);
  const navigate = useNavigate();

  useEffect(() => {
    authService.logout().finally(() => {
      update({
        hasAccess: false,
        history: [],
        scripts: [],
        sessions: [],
      }).then(() => {
        navigate("/login");
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
