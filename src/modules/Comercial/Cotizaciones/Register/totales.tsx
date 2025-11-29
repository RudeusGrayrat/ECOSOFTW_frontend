import InputNormal from "../../../../components/Ui/Input/Normal";

const Totales = ({ form, setForm }) => {
    return (
        <div className="flex flex-wrap justify-center items-center pt-2">
            <InputNormal
                label="Total sin IGV"
                type="text"
                disabled={true}
                name="totalSinIgv"
                value={form.totalSinIgv}
                setForm={setForm}
            />
            <InputNormal
                label="IGV"
                type="text"
                disabled={true}
                name="igv"
                value={form.igv}
                setForm={setForm}
            />
            <InputNormal
                label="Total con IGV"
                type="text"
                disabled={true}
                name="totalConIgv"
                value={form.totalConIgv}
                setForm={setForm}
            />
        </div>
    );
};

export default Totales;