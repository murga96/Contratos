import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { get, omit } from "lodash";
import moment from "moment";
import { useNavigate } from "react-router";
import { fireError } from "../../utils";
import { confirmDialog } from "primereact/confirmdialog";
import { useExport } from "./useExport";
import { DialogComponent } from "../dialog";

/*
* Función que comprueba el tipo de elemento y devuelve el body de la columna de PrimeReact
*/
export const columnBodyChecker = (rowData, item) => {
  const field = item.field
  const value = get(rowData, field) 
  const defaultDataType = item.column.props.dataType
  if (typeof value === "boolean") {
    //boolean
    return (
      <i className={value ? "pi pi-check-circle text-red-500 text-xl"
       : "pi pi-times-circle text-green-500 text-xl"}/>
    )
  }
  else if (defaultDataType === "date") {
    //date 
    return moment(value).format("DD/MM/YYYY");
  } 
  else if (Array.isArray(value)) {
    //array
    if (value.length > 0) {
      //llaves del objeto
      const objectKeys = Object.keys(value[0]);
      //Obtengo el segundo item del arreglo para mostrarlo en la cadena
      return value.map((item) => item[objectKeys[1]]).join(", ");
    }
  } else {
    //text and object
    return value;
  }
};


/*
* CRUD genérico para el modelo de datos que utiliza DataTable de PrimeReact como componente principal
*/
export const Table = ({
  children,
  value,
  header,
  size,
  pagination,
  rowNumbers,
  selectionType,
  sortRemove,
  fieldSort,
  orderSort,
  filterDplay,
  filtersValues,
  edit,
  expand=false,
  expandTemplate,
  exportData,
  removeOne,
  removeSeveral,
  renderForm,
  actionSubmit,
  emptyElement,
  additionalButtons,
  editLinks,
}) => {
  const dt = useRef(null);
  const navigate = useNavigate();
  const [element, setElement] = useState({});
  const [defaultValues, setDefaultValues] = useState([]);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const { exportPdf, exportExcel } = useExport(children, value, header);

  //header and columns
  const h = <div className="table-header">{header}</div>;

  //First column component
  const firstColumn = () => {
    //expanded table
    if(expand) 
      return (<Column expander style={{width: '3rem'}} exportable={false} />)
    //checkbox multiple selection 
    else if(selectionType === "multiple")
      return (<Column selectionMode="multiple" exportable={false} />)
  }

  const changeValuesFormData = (elem) => {
    setDefaultValues(omit(elem,Object.keys(elem)[0]))
  };

  //delete elements
  const confirmDialogDelete = (element) => {
      confirmDialog({
          message: '¿Está seguro que desea eliminar el elemento?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => deleteElement(element),
      });
  }
  const confirmDialogBulkDelete = () => {
      confirmDialog({
          message: '¿Está seguro que desea eliminar los elementos seleccionados?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          accept: () => deleteElements(),
      });
  }
  
  const deleteElement = (value) => {
    try {
      removeOne(value[Object.keys(value)[0]]);
      setSelectedElement([]);
    } catch (error) {
      fireError(error);
    }
  };
  
  const deleteElements = () => {
    //bulk delete
    try {
      removeSeveral(dt.current.props.selection.map((item) => item[Object.keys(item)[0]]));
    } catch (error) {
      fireError(error);
    }
  };
  //adding element
  const newElement = ()=> {
    if (!editLinks) {
      setDefaultValues([])
      setIsInEditMode(false)
      setEditDialog(true);
    } else {
      navigate(editLinks[0]);
    }
  }
  //editing element
  const editElement = (elem) => {
    setIsInEditMode(true)
    setElement(elem);
    changeValuesFormData(elem, true);
    setEditDialog(true);
  };
  //submit form handler
  const saveElement = (data) => {
    //Modificar
    if (isInEditMode) {
      actionSubmit('modify', Object.assign({}, element, data))
    } else {
      //Insertar
      actionSubmit('create', data)
    }
    setEditDialog(false);
  };
  
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action-table flex ">
        {additionalButtons &&
          additionalButtons.map((item) =>
            React.cloneElement(item[0], { onClick: () => item[1](rowData) })
          )}
        {edit && (
          <div className="action-table flex">
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-text p-button-success"
              data-pr-tooltip="Editar"
              onClick={() =>
                editLinks
                  ? navigate(`${editLinks[1]}/${Object.values(rowData)[0]}`)
                  : editElement(rowData)
              }
            />
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-text p-button-danger"
              data-pr-tooltip="Eliminar"
              onClick={() => confirmDialogDelete(rowData)}
            />
          </div>
        )}
      </div>
    );
  };

  //toolbar templates
  const leftToolbarTemplate = () => {
      return (
        <>
          {edit && (
            <div class="grid w-9rem sm:w-auto">
              <div class="col-12 md:col-6">
                <Button
                  label="Nuevo"
                  icon="pi pi-plus"
                  className="p-button-success w-8rem"
                  onClick={() => newElement()}
                />
              </div>
              <div class="col-12 md:col-6">
                <Button
                  label="Eliminar"
                  icon="pi pi-trash"
                  className="p-button-danger w-8rem"
                  onClick={confirmDialogBulkDelete}
                  disabled={!selectedElement || !selectedElement.length}
                />
              </div>
            </div>
          )}
        </>
      );
  };

  const rightToolbarTemplate = () => {
    if (exportData)
      return (
        <>
          {exportData && (
              <div className="export-buttons grid w-7rem sm:w-auto">
                <div className="col-6 sm:col-4 md:col-4">
                  <Button
                    type="button"
                    icon="pi pi-file"
                    onClick={() => dt.current.exportCSV()}
                    data-pr-tooltip="CSV"
                  />
                </div>
                <div className="col-6 sm:col-8 md:col-4">
                  <Button
                    type="button"
                    icon="pi pi-file-excel"
                    onClick={exportExcel}
                    className="p-button-success"
                    data-pr-tooltip="XLS"
                  />
                </div>
                <div className="col-6 md:col-4">
                  <Button
                    type="button"
                    icon="pi pi-file-pdf"
                    onClick={exportPdf}
                    className="p-button-warning"
                    data-pr-tooltip="PDF"
                  />
                </div>
              </div>   
            )
          }
        </>
      );
    else return undefined;
  };

  return (
    <div class="p-card p-4">
      <Tooltip target=".export-buttons>button" position="bottom" />
      <Tooltip target=".action-table>button" position="bottom" />
      {(exportData || edit) && (
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />
      )}
      <DataTable
        value={value}
        ref={dt}
        size={size}
        exportFilename={header}
        responsiveLayout="scroll"
        paginator={value?.length <= rowNumbers[0] ? false : pagination}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`{first} - {last} de {totalRecords}`}
        className="p-mt-6"
        rows={rowNumbers[0]}
        rowsPerPageOptions={rowNumbers}
        header={h}
        footer={`Filas: ${value ? value.length : 0}`}
        selectionMode={selectionType}
        selection={selectedElement}
        onSelectionChange={(e) => {
          setSelectedElement(e.value);
        }}
        removableSort={sortRemove}
        sortField={fieldSort}
        sortOrder={orderSort}
        filterDisplay={filterDplay}
        filters={filtersValues}
        expandedRows={expand && expandedRows}
        onRowToggle={expand ? (e) => setExpandedRows(e.data) : undefined}
        rowExpansionTemplate={expand && expandTemplate}
      >
        {firstColumn()}
        {children}
        {(edit || additionalButtons) && (
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        )}
      </DataTable>
      <DialogComponent 
        title={ !isInEditMode ? "Insertar" : "Detalles"}
        visible={editDialog} 
        hide={() => setEditDialog(false)} >
          {renderForm(saveElement, defaultValues)}
      </DialogComponent>
    </div>
  );
};
