import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useRef, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./stylePrueba.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import useSendMessage from "../../Ui/Messages/sendMessage";
import PopUp from "../../Ui/Messages/PopUp";
import { useAuth } from "../../../context/AuthContext";

const ListPrincipal = ({
    permissionEdit,
    permissionDelete,
    permissionRead,
    permissionApprove,
    permissionDisapprove,
    ApproveItem,
    DisapproveItem,
    DeleteItem,
    EditItem,
    DetailItem,
    contenido,
    children,
    reload,
    rowClick,
    onSearch,
    fetchData,
    ...OtheProps
}) => {
    const dt = useRef(null);
    const [selected, setSelected] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [showDisapprove, setShowDisapprove] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const { setResponse, setErrors } = useAuth();
    const errorForms = useSelector((state) => state.error);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [pagina, setPagina] = useState(0);
    const [limite, setLimite] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);

    const [content, setContent] = useState(contenido || []);
    const sendMessage = useSendMessage();
    const handleShowEdit = (item) => {
        setSelected(item);
        setShowEdit(true);
    };
    const [selectedRowId, setSelectedRowId] = useState(null);
    const handleShowApprove = (item) => {
        setSelected(item);
        setShowApprove(true);
        setSelectedRowId(item._id);
    };
    const handleShowDisapprove = (item) => {
        setSelected(item);
        setShowDisapprove(true);
        setSelectedRowId(item._id);
    };
    const handleShowDelete = (item) => {
        setSelected(item);
        setShowDelete(true);
        setSelectedRowId(item._id);
    };
    const handleShowDetail = (item) => {
        setSelected(item);
        setShowDetail(true);
        setSelectedRowId(item._id);
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("view", item._id); // Añade o actualiza sin eliminar los demás
        navigate(`${location.pathname}?${searchParams.toString()}`);
    };
    const handleClosePopUp = () => {
        sendMessage("", "");
        setShowPopUp(false);
        setResponse(null);
        setErrors(null);
    };
    useEffect(() => {
        if (errorForms?.message) {
            setShowPopUp(true);
        }
    }, [errorForms]);

    const actionBodyTemplate = (rowData) => {
        const isApproved =
            rowData.state === "APROBADO" || rowData.state === "ACTIVO";
        return (
            <React.Fragment>
                {permissionRead && (
                    <Button
                        icon="pi pi-eye"
                        title="Ver Detalle"
                        rounded
                        outlined
                        className={`  text-black! rounded-full mx-1! bg-[#f7f6f6bb]  transition-all duration-150 ease-in-out 
              ${selectedRowId === rowData._id && showDetail
                                ? "shadow-inner translate-y-[2px]"
                                : "shadow-xl"
                            }
              `}
                        onClick={() => handleShowDetail(rowData)}
                    />
                )}
                {permissionApprove && (
                    <Button
                        icon={"pi pi-check"}
                        title="Aprobar o Activar"
                        rounded
                        outlined
                        className={` text-green-500 rounded-full
              ${isApproved ? "cursor-not-allowed opacity-30" : ""}
              mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out 
              ${selectedRowId === rowData._id && showApprove
                                ? "shadow-inner translate-y-[2px]"
                                : "shadow-xl"
                            }
              `}
                        onClick={() => handleShowApprove(rowData)}
                        disabled={isApproved}
                    />
                )}
                {permissionDisapprove && (
                    <Button
                        icon={"pi pi-times"}
                        rounded
                        title="Desaprobar o Desactivar"
                        outlined
                        className={`text-orange-600 rounded-full
              ${!isApproved ? "cursor-not-allowed opacity-30" : ""}
              mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out 
              ${selectedRowId === rowData._id && showDisapprove
                                ? "shadow-inner translate-y-[2px]"
                                : "shadow-xl"
                            }
              `}
                        onClick={() => handleShowDisapprove(rowData)}
                        disabled={!isApproved}
                    />
                )}
                {permissionEdit && (
                    <Button
                        icon="pi pi-pencil"
                        title="Editar"
                        rounded
                        outlined
                        className={` text-blue-500! rounded-full 
              ${rowData.state === "APROBADO"
                                ? "cursor-not-allowed opacity-30"
                                : ""
                            }
              mx-1! bg-[#f7f6f6bb]  transition-all duration-150 ease-in-out 
              ${selectedRowId === rowData._id && showEdit
                                ? "shadow-inner translate-y-[2px]"
                                : "shadow-xl"
                            }
              `}
                        onClick={() => handleShowEdit(rowData)}
                        disabled={rowData.state === "APROBADO"}
                    />
                )}
                {permissionDelete && (
                    <Button
                        icon="pi pi-trash"
                        title="Eliminar"
                        rounded
                        outlined
                        className={` text-red-600 rounded-full 
              ${rowData.state === "APROBADO"
                                ? "cursor-not-allowed opacity-30"
                                : ""
                            }
              mx-1! bg-[#f7f6f6bb]  transition-all duration-150 ease-in-out 
              ${selectedRowId === rowData._id && showDelete
                                ? "shadow-inner translate-y-[2px]"
                                : "shadow-xl"
                            }
              `}
                        severity="danger"
                        onClick={() => handleShowDelete(rowData)}
                        disabled={rowData.state === "APROBADO"}
                    />
                )}
            </React.Fragment>
        );
    };
    const [loading, setLoading] = useState(false);
    const useEffectAsync = async () => {
        setLoading(true);
        if (content?.length === 0) {
            setLoading(false);
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
    };
    useEffect(() => {
        useEffectAsync();
    }, []);
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        // const editId = queryParams.get("edit");
        const viewId = queryParams.get("view");

        // if (editId && content.length > 0) {
        //   const item = content.find((i) => i._id === editId);
        //   if (item) {
        //     setSelected(item);
        //     setShowEdit(true);
        //     setSelectedRowId(item._id);
        //   }
        // }

        if (viewId && content.length > 0) {
            const item = content.find((i) => i._id === viewId);
            if (item) {
                setSelected(item);
                setShowDetail(true);
                setSelectedRowId(item._id);
            }
        }
    }, [location.search, content]);

    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const header = (
        <div className="flex flex-wrap pr-20 justify-end gap-2 ">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search pl-2" />
                <InputText
                    type="search"
                    value={searchTerm}
                    onChange={(e) => {
                        setPagina(0); // Reinicia a la primera página
                        setSearchTerm(e.target.value);
                    }}
                    placeholder="Buscar..."
                    className="p-2 rounded-xl! pl-11 focus:shadow-inner focus:translate-x-px ease-in-out  shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 "
                />
            </IconField>
            {reload ? (
                <Button
                    icon="pi pi-refresh"
                    className="p-2!  rounded-xl!  active:shadow-inner focus:translate-x-px ease-in-out  shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 "
                    onClick={() => {
                        reload();
                        useEffectAsync();
                    }}
                />
            ) : null}
        </div>
    );

    const fetchAll = async (pagina, limite, searchTerm) => {
        try {
            const result = await fetchData(pagina, limite, searchTerm);
            setContent(result.data || []);
            setTotalRecords(result.total || 0);
        } catch (error) {
            sendMessage(error.message || "Error al cargar los datos", "Error");
        }
    };

    useEffect(() => {
        if (!fetchData) return; // Si no se pasa fetchData, no hace nada.
        fetchAll(pagina, limite, searchTerm);
    }, [pagina, limite, searchTerm]);
    useEffect(() => {
        if (contenido) {
            setContent(contenido);
        }
    }, [contenido]);

    return (
        <div className="flex justify-center items-center">
            {showPopUp && <PopUp onClose={handleClosePopUp} message={errorForms} />}
            {showDetail && (
                <DetailItem setShowDetail={setShowDetail} selected={selected} />
            )}
            {showApprove && (
                <ApproveItem setShowApprove={setShowApprove} selected={selected} />
            )}
            {showDisapprove && (
                <DisapproveItem
                    setShowDisapprove={setShowDisapprove}
                    selected={selected}
                />
            )}
            {showEdit && (
                <EditItem
                    setShowPopUp={setShowPopUp}
                    setShowEdit={setShowEdit}
                    selected={selected}
                />
            )}
            {showDelete && (
                <DeleteItem
                    setShowDelete={setShowDelete}
                    selected={selected}
                    reload={reload}
                />
            )}
            <div className="w-full border-2 m-2 mt-0 border-gray-100 rounded-xl shadow-lg bg-white">
                <DataTable
                    ref={dt}
                    value={content}
                    lazy
                    selection={selectedProducts}
                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="_id"
                    loading={loading}
                    paginator
                    onRowClick={rowClick}
                    // first={OtheProps.page * OtheProps.rows}
                    // totalRecords={OtheProps.totalRecords}
                    // onPage={(e) => OtheProps?.onPageChange(e)}
                    rows={limite}
                    first={pagina * limite}
                    totalRecords={totalRecords}
                    onPage={(e) => {
                        setPagina(e.page);
                        setLimite(e.rows);
                        const searchParams = new URLSearchParams(location.search);
                        searchParams.set("page", e.page + 1); // +1 si quieres que inicie en 1
                        navigate(`${location.pathname}?${searchParams.toString()}`);
                    }}
                    rowsPerPageOptions={[5, 10, 20, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    globalFilter={globalFilter}
                    header={header}
                    {...OtheProps}
                >
                    {children}
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default ListPrincipal;
