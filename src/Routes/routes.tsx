import { Route, Routes, useLocation } from "react-router-dom";
import Login from "../components/Login";
import Home from "../components/Home";
import Error from "../components/Error";
import SideBar from "../components/SideBar/SideBar";
import ModulesRoutes from "./modulesRoutes";
import FormClientes from "../modules/Comercial/Clientes/FormClientes";
import ProtectedRoute from "../ProtecteRoute";
import Nav from "../components/Nav/Nav";
import ModuleRoute from "./ModuleRoute";

export const AppRoutes = () => {
  const location = useLocation();
  const paths = ["/formulario/clientes", "/"].includes(location.pathname);
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {!paths && <SideBar />}

      <div className="w-full h-full overflow-y-auto ">
        {!paths && <Nav notifications={[]} />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Error />} />
          <Route path="/formulario/clientes" element={<FormClientes />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/:module/:submodule" element={<ModulesRoutes />} />
            <Route path="/:module" element={<ModuleRoute />} />
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </div>
    </div >
  )
};
