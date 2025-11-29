import InputNormal from "../../../../components/Ui/Input/Normal";

const GastosGenerales = ({ form }) => {
    return (
        <div className="flex flex-wrap justify-center items-center pt-2">
            <InputNormal
                label="Descripción"
                type="text"
                ancho="w-96"
                disabled={true}
                name="descripcion"
                value={form.descripcion}
            />
            <InputNormal
                label="Subtotal"
                type="text"
                onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) {
                        e.preventDefault();
                    }
                }}
                disabled={true}
                name="subtotal"
                value={form.subtotal}
            />
        </div>
    )
}

export default GastosGenerales;