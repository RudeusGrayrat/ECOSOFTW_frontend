import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../components/Otros/Home";
import Error from "../components/Otros/Error";
import SideBar from "../components/SideBar/SideBar";
import ModulesRoutes from "./modulesRoutes";
import FormClientes from "../modules/Comercial/Clientes/FormClientes";
import ProtectedRoute from "../ProtecteRoute";
import Nav from "../components/Nav/Nav";
import ModuleRoute from "./ModuleRoute";
import Login from "../components/Otros/Login";
import ConsultaInforme from "../modules/Calidad/InformesEnsayo/ConsultaInforme";
import Notificaciones from "../components/Otros/Notificaciones";

export const AppRoutes = () => {
  const location = useLocation();
  const publicLayout = ["/formulario/clientes", "/"].includes(location.pathname) || location.pathname.startsWith("/consulta-informes");
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {!publicLayout && <SideBar />}

      <div className="w-full h-full overflow-y-auto ">
        {!publicLayout && <Nav />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Error />} />
          <Route path="/formulario/clientes" element={<FormClientes />} />
          <Route path="/consulta-informes" element={<ConsultaInforme />} />
          <Route path="/consulta-informes/:token" element={<ConsultaInforme />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/:module/:submodule" element={<ModulesRoutes />} />
            <Route path="/:module" element={<ModuleRoute />} />
            <Route path="/home" element={<Home />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
          </Route>
        </Routes>
      </div>
    </div >
  )
};
