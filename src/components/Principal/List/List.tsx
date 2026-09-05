import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useRef, useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import "./stylePrueba.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import useSendMessage from "../../Ui/Messages/sendMessage";
import PopUp from "../../Ui/Messages/PopUp";
import { useAuth } from "../../../context/AuthContext";

const cloneFilters = (filters) => filters ? JSON.parse(JSON.stringify(filters)) : null;

const flattenActionChildren = (children) => {
    return React.Children.toArray(children).flatMap((child) => {
        if (React.isValidElement(child) && child.type === React.Fragment) {
            return flattenActionChildren(child.props.children);
        }
        return child ? [child] : [];
    });
};

const MoreActions = ({ rowId, actions, openActionsRow, setOpenActionsRow }) => {
    const overlayRef = useRef(null);
    const isOpen = openActionsRow === rowId;
    const hasOverflow = actions.length > 4;
    const visibleActions = hasOverflow ? actions.slice(0, 3) : actions;
    const hiddenActions = hasOverflow ? actions.slice(3) : [];

    return (
        <div className={`list-row-actions ${isOpen ? "is-open" : ""}`}>
            {visibleActions.map((action, index) => (
                <React.Fragment key={`visible-action-${rowId}-${index}`}>
                    {action}
                </React.Fragment>
            ))}
            {hasOverflow && (
                <>
                    <button
                        type="button"
                        className={`list-action-more ${isOpen ? "is-open" : ""}`}
                        aria-label={isOpen ? "Cerrar acciones" : "Más acciones"}
                        data-pr-tooltip={isOpen ? "Cerrar acciones" : "Más acciones"}
                        data-pr-position="top"
                        onClick={(event) => {
                            event.stopPropagation();
                            overlayRef.current?.toggle(event);
                        }}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <OverlayPanel
                        ref={overlayRef}
                        className="list-row-actions__overlay"
                        onShow={() => setOpenActionsRow(rowId)}
                        onHide={() => setOpenActionsRow((current) => current === rowId ? null : current)}
                    >
                        <div
                            className="list-row-actions__menu"
                            onClick={(event) => {
                                event.stopPropagation();
                                overlayRef.current?.hide();
                            }}
                        >
                            {hiddenActions.map((action, index) => (
                                <React.Fragment key={`hidden-action-${rowId}-${index}`}>
                                    {action}
                                </React.Fragment>
                            ))}
                        </div>
                    </OverlayPanel>
                </>
            )}
        </div>
    );
};

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
    ExtraActions,
    contenido,
    children,
    reload = true,
    rowClick,
    onSearch,
    tableFilters = null,
    selectable = false,
    BulkActions,
    HeaderActions,
    fetchData,
    title,
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
    const errorForms = useSelector((state) => state.errorAndResponse);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [pagina, setPagina] = useState(0);
    const [limite, setLimite] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState(() => cloneFilters(tableFilters));
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [openActionsRow, setOpenActionsRow] = useState(null);

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
            rowData.state === "APROBADO" || rowData.estado === "APROBADO";
        const isActivo =
            rowData.state === "ACTIVO" || rowData.estado === "ACTIVO";
        const isInactivo =
            rowData.state === "INACTIVO" || rowData.estado === "INACTIVO";
        const isDisapproved =
            rowData.state === "ANULADO" || rowData.estado === "ANULADO";
        const isAnulado =
            rowData.state === "ANULADO" || rowData.estado === "ANULADO";
        const extraActions = ExtraActions
            ? flattenActionChildren(ExtraActions({ rowData, reload: reloading }))
            : [];
        const actions = [
            permissionRead && (
                <Button
                    icon="pi pi-eye"
                    data-pr-tooltip="Ver detalle"
                    data-pr-position="top"
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
            ),
            permissionApprove && (
                <Button
                    icon={"pi pi-check"}
                    data-pr-tooltip="Aprobar o activar"
                    data-pr-position="top"
                    rounded
                    outlined
                    className={` text-green-500 rounded-full
          ${isApproved || isActivo ? "cursor-not-allowed opacity-30" : ""}
          mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out 
          ${selectedRowId === rowData._id && showApprove
                            ? "shadow-inner translate-y-[2px]"
                            : "shadow-xl"
                        }
          `}
                    onClick={() => handleShowApprove(rowData)}
                    disabled={isApproved || isActivo}
                />
            ),
            permissionDisapprove && (
                <Button
                    icon={"pi pi-times"}
                    rounded
                    data-pr-tooltip="Desactivar o anular"
                    data-pr-position="top"
                    outlined
                    className={`text-orange-600! rounded-full
          ${isDisapproved || isInactivo ? "cursor-not-allowed opacity-30" : ""}
          mx-1! bg-[#f7f6f6bb] transition-all duration-150 ease-in-out 
          ${selectedRowId === rowData._id && showDisapprove
                            ? "shadow-inner translate-y-[2px]"
                            : "shadow-xl"
                        }
          `}
                    onClick={() => handleShowDisapprove(rowData)}
                    disabled={isDisapproved || isInactivo}
                />
            ),
            permissionEdit && (
                <Button
                    icon="pi pi-pencil"
                    data-pr-tooltip="Editar"
                    data-pr-position="top"
                    rounded
                    outlined
                    className={` text-blue-500! rounded-full 
            ${isAnulado || isApproved || isInactivo ? "cursor-not-allowed opacity-30" : ""}
          mx-1! bg-[#f7f6f6bb]  transition-all duration-150 ease-in-out 
          ${selectedRowId === rowData._id && showEdit
                            ? "shadow-inner translate-y-[2px]"
                            : "shadow-xl"
                        }
          `}
                    onClick={() => handleShowEdit(rowData)}
                    disabled={isAnulado || isApproved || isInactivo}
                />
            ),
            permissionDelete && (
                <Button
                    icon="pi pi-trash"
                    data-pr-tooltip="Eliminar"
                    data-pr-position="top"
                    rounded
                    outlined
                    className={` text-red-600 rounded-full 
          ${isApproved || isActivo ? "cursor-not-allowed opacity-30" : ""}
          mx-1! bg-[#f7f6f6bb]  transition-all duration-150 ease-in-out 
          ${selectedRowId === rowData._id && showDelete
                            ? "shadow-inner translate-y-[2px]"
                            : "shadow-xl"
                        }
          `}
                    severity="danger"
                    onClick={() => handleShowDelete(rowData)}
                    disabled={isApproved || isActivo}
                />
            ),
            ...extraActions,
        ].filter(Boolean);
        return (
            <MoreActions
                rowId={rowData._id}
                actions={actions}
                openActionsRow={openActionsRow}
                setOpenActionsRow={setOpenActionsRow}
            />
        );
    };
    const [loading, setLoading] = useState(false);
    const fetchAll = async (pagina, limite, searchTerm, columnFilters = filters) => {
        try {
            setLoading(true);
            const result = await fetchData(pagina, limite, searchTerm, columnFilters, { sortField, sortOrder });
            setContent(result.data || []);
            setTotalRecords(result.total || 0);
        } catch (error) {
            sendMessage(error.message || "Error al cargar los datos", "Error");
        } finally {
            setLoading(false);
        }
    };

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
    const reloading = async () => {
        await fetchAll(pagina, limite, searchTerm, filters);
    };

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const header = (
        <div className="flex flex-wrap items-center justify-between gap-3 pr-20">
            <div>
                {BulkActions ? (
                    <BulkActions
                        selectedItems={selectedProducts || []}
                        clearSelection={() => setSelectedProducts([])}
                        reload={reloading}
                    />
                ) : null}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search pl-2!" />
                    <InputText
                        type="search"
                        value={searchTerm}
                        onChange={(e) => {
                            setPagina(0); // Reinicia a la primera página
                            setSearchTerm(e.target.value);
                        }}
                        placeholder="Buscar..."
                        className="p-2! border-none! rounded-xl! pl-11! focus:shadow-inner! focus:translate-x-px! ease-in-out!  shadow-lg bg-linear-to-r! from-gray-50! to-gray-100! "
                    />
                </IconField>
                {filters ? (
                    <Button
                        icon="pi pi-filter-slash"
                        data-pr-tooltip="Limpiar filtros"
                        data-pr-position="top"
                        className=" w-16! text-blue-900!  rounded-xl!  active:shadow-inner! focus:translate-x-px! ease-in-out!  shadow-lg! bg-linear-to-r! from-gray-50! to-gray-100! "
                        onClick={() => {
                            setPagina(0);
                            setFilters(cloneFilters(tableFilters));
                        }}
                    />
                ) : null}
                {HeaderActions ? (
                    <HeaderActions
                        reload={reloading}
                        loading={loading}
                    />
                ) : null}
                {reload ? (
                    <Button
                        icon="pi pi-refresh"
                        data-pr-tooltip="Recargar"
                        data-pr-position="top"
                        className=" w-16! text-green-600!  rounded-xl!  active:shadow-inner! focus:translate-x-px! ease-in-out!  shadow-lg! bg-linear-to-r! from-gray-50! to-gray-100! "
                        onClick={() => {
                            reloading();
                        }}
                    />
                ) : null}
            </div>
        </div>
    );

    useEffect(() => {
        if (!fetchData) return; // Si no se pasa fetchData, no hace nada.
        fetchAll(pagina, limite, searchTerm, filters);
    }, [pagina, limite, searchTerm, filters, sortField, sortOrder]);
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
                <ApproveItem setShowApprove={setShowApprove} selected={selected} reload={reloading} />
            )}
            {showDisapprove && (
                <DisapproveItem
                    setShowDisapprove={setShowDisapprove}
                    selected={selected}
                    reload={reloading}
                />
            )}
            {showEdit && (
                <EditItem
                    setShowPopUp={setShowPopUp}
                    setShowEdit={setShowEdit}
                    selected={selected}
                    reload={reloading}
                />
            )}
            {showDelete && (
                <DeleteItem
                    setShowDelete={setShowDelete}
                    selected={selected}
                    reload={reloading}
                />
            )}
            <div className="w-full border-2 m-2 mt-0 border-gray-100 rounded-xl shadow-lg bg-white">
                <DataTable
                    ref={dt}
                    value={content}
                    lazy
                    reorderableColumns
                    removableSort
                    filterDisplay={filters ? "menu" : undefined}
                    filters={filters || undefined}
                    onFilter={(e) => {
                        setPagina(0);
                        setFilters(e.filters);
                    }}
                    sortField={sortField || undefined}
                    sortOrder={sortOrder || undefined}
                    onSort={(e) => {
                        setPagina(0);
                        setSortField(e.sortField);
                        setSortOrder(e.sortOrder);
                    }}
                    key={title + "Table"}
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
                    {selectable && <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} reorderable={false}></Column>}
                    {children}
                    <Column body={actionBodyTemplate} exportable={false} reorderable={false}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default ListPrincipal;
