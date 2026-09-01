import ReadOrCreate from "../../../components/Principal/Principal";
import ListInformesEnsayo from "./List/List";
import RegisterInformesEnsayo from "./Register/Register";

const InformesEnsayo = () => {
    return (
        <ReadOrCreate
            ItemList={ListInformesEnsayo}
            ItemRegister={RegisterInformesEnsayo}
            submodule="INFORMES DE ENSAYO" />
    )
};

export default InformesEnsayo;
