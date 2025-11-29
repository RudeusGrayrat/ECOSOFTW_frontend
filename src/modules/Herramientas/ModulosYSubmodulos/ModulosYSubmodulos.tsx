import ReadOrCreate from "../../../components/Principal/Principal";
import List from "./List/List";
import Register from "./Register/Register";

const ModulosYSubmodulos = () => {
  return (
    <ReadOrCreate
      ItemList={List}
      ItemRegister={Register}
      submodule="MODULOS Y SUBMODULOS"
    />
  );
};

export default ModulosYSubmodulos;
