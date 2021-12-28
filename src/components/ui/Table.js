import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";

export const Table = ({value, header, size, columns, pagination, rowNumbers, selectionType, sortRemove,
   fieldSort, orderSort, filterDplay, filtersValues, edit, exportData, deleteOne}) => {
  const dt = useRef(null)
  const [selectedElement, setSelectedElement] = useState(null);
  const [{elementDialog}, dispatch] = useStateValue()
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false);
  // const [product, setProduct] = useState(emptyProduct);

  //header and columns
  const h = <div className="table-header">{header}</div>;

  const dynamicColumns = columns.map((col,i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={fieldSort === null ? false : true}
    filter={filterDplay === null ? false : true} />;
  });

  const exportColumns = columns.map(col => ({ title: col.header, dataKey: col.field }));

  const hideDeleteElementDialog = () => {
    setDeleteDialog(false);
  }
  
  const hideDeleteElementsDialog = () => {
    setDeleteMultipleDialog(false);
  }
  
  //deleting elements
  const deleteElement= () => {
      deleteOne()
      setDeleteDialog(false);
  }

  const confirmDeleteElement = (element) => {
    dispatch({
      type: actionTypes.SET_ELEMENT_DIALOG,
      elementDialog: element
    })
    setDeleteDialog(true)
  }

  const deleteElements = () => {
    //bulk delete
      setDeleteMultipleDialog(false);
  }

  //editing elements
  const editElement = (elem) => {
    dispatch({type: actionTypes.SET_EDIT_DIALOG, editDialog:true})
    dispatch({
      type: actionTypes.SET_ELEMENT_DIALOG,
      elementDialog: elem
    })
  }

  const exportPdf = () => {
    import('jspdf').then(jsPDF => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default(0, 0);
            doc.autoTable(exportColumns, value);
            doc.save(`${header}.pdf`);
        })
    })
  }

  const exportExcel = () => {
      import('xlsx').then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(value);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          saveAsExcelFile(excelBuffer, header);
      });
  }

  const saveAsExcelFile = (buffer, fileName) => {
      import('file-saver').then(FileSaver => {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          console.log(fileName)
          const data = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
      });
  }

  const actionBodyTemplate = (rowData) => {
    return (
        <div className="action-table">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" data-pr-tooltip="Editar" onClick={() => editElement(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" data-pr-tooltip="Eliminar" onClick={() => confirmDeleteElement(rowData)} />
        </div>
    );
  }

  //toolbar templates
  const leftToolbarTemplate = () => {
    if(edit)
      return (
          <div>
              <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => {
                dispatch({type: actionTypes.SET_ELEMENT_DIALOG, elementDialog: {}})
                dispatch({type: actionTypes.SET_EDIT_DIALOG, editDialog: true})
                }
                } />
              <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" /* onClick={confirmDeleteSelected} */ disabled={!selectedElement || !selectedElement.length} />
          </div>
      )
    else
        return undefined
  }
  
  const rightToolbarTemplate = () => {
    if(exportData)
      return (
        <div className="p-d-flex p-ai-center export-buttons">
          <Button type="button" icon="pi pi-file" onClick={() => dt.current.exportCSV()} className="mr-2" data-pr-tooltip="CSV" />
          <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success mr-2" data-pr-tooltip="XLS" />
          <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="PDF" />
          {/* <Button type="button" icon="pi pi-filter" onClick={() => exportCSV(true)} className="p-button-info ml-auto" data-pr-tooltip="Selection Only" /> */}
        </div>
      )
    else
        return undefined
}

  //dialogs
  const deleteDialogFooter = (
    <React.Fragment>
        <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteElement} />
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteElementDialog} />
    </React.Fragment>
  );

  const deleteMultipleDialogFooter = (
      <React.Fragment>
          <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteElements} />
          <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteElementsDialog} />
      </React.Fragment>
  );

  return (
    <div>
      <div className="card mx-3">
        <Tooltip target=".export-buttons>button" position="bottom" />
        <Tooltip target=".action-table>button" position="bottom" />
        {exportData || edit ? <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> : undefined}
        <DataTable
          value={value} ref={dt} size={size} exportFilename={header}
          responsiveLayout="scroll"
          paginator={value.length < rowNumbers[0] ? false : pagination} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate={`{first} - {last} of {totalRecords}`}  className="p-mt-6"
          rows={rowNumbers[0]} rowsPerPageOptions={rowNumbers}
          header={h} footer={`Filas: ${value ? value.length : 0}`}
          selectionMode={selectionType} selection={selectedElement} onSelectionChange={e => setSelectedElement(e.value)}
          removableSort={sortRemove} sortField={fieldSort} sortOrder={orderSort} filterDisplay={filterDplay} filters={filtersValues}
        >
          {selectionType === "multiple" ? <Column selectionMode="multiple" exportable={false}/> : undefined}
          {dynamicColumns}
          {edit ? <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column> : undefined}
        </DataTable>

        <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={hideDeleteElementDialog}>
                <div className="flex flex-row align-content-end confirmation-content mt-3">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {elementDialog && <span className="mt-2">¿Está seguro que desea eliminar el elemento?</span>}
                </div>
        </Dialog>

            <Dialog visible={deleteMultipleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMultipleDialogFooter} onHide={hideDeleteElementsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {elementDialog && <span>¿Está seguro que desea eliminar los elementos seleccionados?</span>}
                </div>
            </Dialog>
      </div>
    </div>
  );
};
