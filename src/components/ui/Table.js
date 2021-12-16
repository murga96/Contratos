import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";

export const Table = ({value, header, size, columns, pagination, rowNumbers, selectionType, sortRemove,
   fieldSort, orderSort, filterDplay, filtersValues, edit, ElementDialog, exportData, h1}) => {
  const dt = useRef(null)
  const [selectedElement, setSelectedElement] = useState(null);
  const [elements, setElements] = useState(null);
  const [element, setElement] = useState(null);
  const [elementDialog, setElementDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false);
  // const [product, setProduct] = useState(emptyProduct);

  //header and columns
  const h = <div className="table-header">{header}</div>;

  console.log(fieldSort, orderSort, filterDplay, filtersValues,sortRemove)

  const dynamicColumns = columns.map((col,i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={fieldSort === null ? false : true}
    filter={filterDplay === null ? false : true} />;
  });

  //hiding elements
  const hideElementDialog = () => {
    setElementDialog(false);
  }

  const hideDeleteElementDialog = () => {
    setDeleteDialog(false);
  }
  
  const hideDeleteElementsDialog = () => {
    setDeleteMultipleDialog(false);
  }
  
  //deleting elements
  const deleteElement= () => {
      setDeleteDialog(false);
  }

  const confirmDeleteElement = (element) => {
    console.log(element,"DeleteProduct")
    setElement(element)
    setDeleteDialog(true)
  }

  const deleteElements = () => {
      setDeleteMultipleDialog(false);
  }

  //saving elements
  const saveElement = (product) => {
    console.log(product,"EditProduct")
  }

  //editing elements
  const editElement = (product) => {
    h1 = true    
    //setElementDialog(true)
  }

  //exporting
  const exportCSV = () => {
    dt.current.exportCSV();
  }

  // const exportPdf = () => {
  //   import('jspdf').then(jsPDF => {
  //       import('jspdf-autotable').then(() => {
  //           const doc = new jsPDF.default(0, 0);
  //           doc.autoTable(exportColumns, value);
  //           doc.save('products.pdf');
  //       })
  //   })
  // }

  // const exportExcel = () => {
  //     import('xlsx').then(xlsx => {
  //         const worksheet = xlsx.utils.json_to_sheet(products);
  //         const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //         const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  //         saveAsExcelFile(excelBuffer, 'products');
  //     });
  // }

  // const saveAsExcelFile = (buffer, fileName) => {
  //     import('file-saver').then(FileSaver => {
  //         let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //         let EXCEL_EXTENSION = '.xlsx';
  //         const data = new Blob([buffer], {
  //             type: EXCEL_TYPE
  //         });
  //         FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  //     });
  // }

  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editElement(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteElement(rowData)} />
        </React.Fragment>
    );
  }

  //toolbar templates
  const leftToolbarTemplate = () => {
    if(edit)
      return (
          <React.Fragment>
              <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" /* onClick={openNew} */ />
              <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" /* onClick={confirmDeleteSelected} */ disabled={!selectedElement || !selectedElement.length} />
          </React.Fragment>
      )
    else
        return undefined
  }
  
  const rightToolbarTemplate = () => {
    if(exportData)
      return (
          <React.Fragment>
              {/* <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="p-mr-2 p-d-inline-block" onUpload={importCSV} /> */}
              <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
          </React.Fragment>
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

  const elementDialogFooter = (
    <React.Fragment>
        <Button label="Guardar" icon="pi pi-times" className="p-button-text" onClick={saveElement} />
        <Button label="Cancelar" icon="pi pi-check" className="p-button-text" onClick={hideElementDialog} />
    </React.Fragment>
);


  return (
    <div>
      <div className="card mx-3">
        {exportData || edit ? <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> : undefined}
        <DataTable
          value={value} ref={dt}
          /* dataKey="idTipoContrato" */ size={size}
          responsiveLayout="scroll"
          paginator={pagination} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate={`{first} - {last} of {totalRecords}`}  className="p-mt-6"
          rows={rowNumbers[0]} rowsPerPageOptions={rowNumbers}
          header={h} footer={`Filas: ${value ? value.length : 0}`}
          selectionMode={selectionType} selection={selectedElement} onSelectionChange={e => setSelectedElement(e.value)}
          removableSort={sortRemove} sortField={fieldSort} sortOrder={orderSort} filterDisplay={filterDplay} filters={filtersValues}
        >
          {selectionType === "multiple" ? <Column selectionMode="multiple" exportable={false}/> : undefined}
          {/* <Column field="idTipoContrato" header="idTipoContrato" hidden={true}/> */}
          {dynamicColumns}
          {edit ? <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column> : undefined}
        </DataTable>

        <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={hideDeleteElementDialog}>
                <div className="flex flex-row align-content-end confirmation-content mt-3">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {element && <span className="mt-2">¿Está seguro que desea eliminar el elemento?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteMultipleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMultipleDialogFooter} onHide={hideDeleteElementsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {element && <span>¿Está seguro que desea eliminar los elementos seleccionados?</span>}
                </div>
        </Dialog>
      </div>
    </div>
  );
};
