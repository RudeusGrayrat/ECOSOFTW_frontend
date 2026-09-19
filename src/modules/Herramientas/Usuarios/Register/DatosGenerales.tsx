import InputP from "../../../../components/Ui/Input/InputP";
import InputArchivoConfig from "../../../Calidad/Configuracion/Register/InputArchivoConfig";

const DatosGenerales = ({ form, setForm, editing = false, disabled = false, onUploadAsset, onDeleteAsset }) => {
    return (
        <div className="flex flex-wrap">
            <InputP label="Usuario" name="userName" type="text" ancho="w-80!" value={form.userName} setForm={setForm} />
            <InputP label="Colaborador" name="colaborador" type="text" ancho="w-96!" value={form.colaborador} setForm={setForm} />
            <InputP label="Correo Electrónico" name="correoElectronico" type="text" ancho="w-96!" value={form.correoElectronico} setForm={setForm} />
            <InputP label="Puesto" name="puesto" type="text" ancho="w-80!" value={form.puesto} setForm={setForm} />
            <InputP label="Teléfono" name="telefono" type="text" ancho="w-72!" value={form.telefono} setForm={setForm} />
            <InputArchivoConfig label="Foto de usuario" accept=".png,.jpg,.jpeg,image/png,image/jpeg" currentFile={form.photoArchivo?.filename} selectedFile={form.photoFile} disabled={disabled} showUpload={editing} downloadUrl={form._id ? `/herramientas/public/usuarios/${form._id}/foto` : undefined} onSelect={(file) => setForm((current) => ({ ...current, photoFile: file }))} onUpload={() => onUploadAsset?.("foto", form.photoFile)} onDelete={() => form.photoFile ? setForm((current) => ({ ...current, photoFile: null })) : onDeleteAsset?.("foto")} />
            <InputArchivoConfig label="Firma" accept=".png,.jpg,.jpeg,image/png,image/jpeg" currentFile={form.firmaArchivo?.filename} selectedFile={form.firmaFile} disabled={disabled} showUpload={editing} downloadUrl={form._id ? `/herramientas/public/usuarios/${form._id}/firma` : undefined} onSelect={(file) => setForm((current) => ({ ...current, firmaFile: file }))} onUpload={() => onUploadAsset?.("firma", form.firmaFile)} onDelete={() => form.firmaFile ? setForm((current) => ({ ...current, firmaFile: null })) : onDeleteAsset?.("firma")} />
            <InputP label={editing ? "Nueva Contraseña" : "Contraseña"} name="password" type="password" ancho="w-80!" value={form.password} setForm={setForm} />
        </div>
    )
}

export default DatosGenerales;
