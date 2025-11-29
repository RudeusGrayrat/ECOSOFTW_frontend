import ButtonOk from "../../../recicle/Buttons/Buttons";
import CardPlegable from "../../../recicle/Divs/CardPlegable";
import Input from "../../../recicle/Inputs/Inputs";
import PopUp from "../../../recicle/popUps";

const Report = ({ descargar, form, setForm, title, options }) => {
  return (
    <div>
      <PopUp />
      <CardPlegable title={title}>
        <div className="flex flex-wrap">
          <Input
            label="Empresa"
            name="empresa"
            type="select"
            options={options}
            value={form.empresa}
            setForm={setForm}
          />
          <Input
            label="Desde"
            name="desde"
            type="month"
            value={form.desde}
            setForm={setForm}
          />
          <Input
            label="Hasta"
            name="hasta"
            type="month"
            month="true"
            value={form.hasta}
            setForm={setForm}
          />
          <ButtonOk
            classe="mt-4"
            children="Generar Reporte"
            type="ok"
            onClick={descargar}
          />
        </div>
      </CardPlegable>
    </div>
  );
};
export default Report;
