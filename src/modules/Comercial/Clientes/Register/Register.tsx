import { useState } from "react";
import ClientesRegister from "./Clientes";
import CardPlegable from "../../../../components/Ui/Otros/CardPlegable";

const RegisterClientesComercial = ({ }) => {
    const [form, setForm] = useState({});
    return (
        <div className="px-5 ">
            <CardPlegable title="Registro de Clientes" >
                <ClientesRegister
                    form={form}
                    setForm={setForm}
                />
            </CardPlegable>
        </div>
    );
}
export default RegisterClientesComercial;