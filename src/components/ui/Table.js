
import React, { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Form } from "./Form";
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { get, pick, hasIn } from 'lodash'
import { Dropdown } from "primereact/dropdown";

export const Table = ({value, header, size, columns, pagination, rowNumbers, selectionType, sortRemove,
   fieldSort, orderSort, filterDplay, filtersValues, edit, exportData, removeOne, removeSeveral, formProps,
   emptyElement, additionalButtons}) => {
  const dt = useRef(null)
  const [selectedElement, setSelectedElement] = useState(null);
  const [element, setElement] = useState({})
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false);

  //header and columns
  const h = <div className="table-header">{header}</div>;

  const bodyChecker = (rowData, item) => {
    if (typeof rowData[item.field] === "boolean") {
      return rowData[item.field] ? <i className="pi pi-check-circle" style={{'color': "#008000", "fontSize": "1.3rem" }}></i> : <i className="pi pi-times-circle" style={{'color': 'red', "fontSize": "1.3rem"}}></i>;
    } else if(Array.isArray(rowData[item.field])){
      if(rowData[item.field].length > 0){
        //llave del objeto
        console.log("bodyArray")
        const objectKey = Object.keys(rowData[item.field][0])
        //Obtengo el segundo item del arreglo para mostrarlo en la cadena
        console.log(rowData[item.field].map((i) =>  Object.keys(i).length === 1 ? i[objectKey][Object.keys(i[objectKey])[1]] : i[Object.keys(i)[1]]
        ).toString(),"return bodyArray")
        return rowData[item.field].map((i) =>  Object.keys(i).length === 1 ? i[objectKey][Object.keys(i[objectKey])[1]] : i[Object.keys(i)[1]]
        ).toString()
      }
    }else {
      return get(rowData, item.field);
    }
  };
  const filterChecker = (options) => {
    console.log(options, 'options')
    /* if(hasIn(col, 'filterElement')){
        return col.filterElement;
    }else{
      return undefined;
    } */
  }

  // const datatypeChecker = (i) => {
  //   let type = value && typeof Object.values(value[0])[i+1]
  //   if (type === "string") {
  //     return "text"
  //   } else if(type === "number"){
  //     return "numeric";
  //   }
  //   else{
  //     return type;
  //   }
  // };

  const verifiedRowFilterTemplate = (options) => {
    console.log(options, 'options')
      return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />
    }

  const dynamicColumns = columns.map((col, i) => {
      return <Column key={col.field} field={col.field} header={col.header} sortable={fieldSort === null ? false : true}/*  style={{flex: 1,justifyContent: "center"}} */
      body={bodyChecker} dataType= {value && typeof Object.values(value[0])[i+1]=== "number" ? "numeric" : "text"} 
      filterElement={value && typeof Object.values(value[0])[i+1] === "boolean"? verifiedRowFilterTemplate : undefined}
      filter={filterDplay === null ? false : true}  />;
  });
  const exportColumns = columns.map(col => ({ title: col.header, dataKey: col.field }));

  const changeValuesFormData = (elem, edit) => {
    let i = edit ? 1 : 0
    const entries = Object.entries(elem)
    console.log(elem, "elem")
    console.log(columns)
    for (let index = 0; index < formProps.data.length; index++) {
      if( index % 2 !== 0) {
        console.log(i,"i")
        console.log(entries[i][1])
        const value = entries[i][1]

        if(Array.isArray(value)){
          if(value.length > 0){
            console.log("array")
            //llave del objeto
            const objectKey = Object.keys(value[0])
            console.log(value.map((item) => item[objectKey][Object.keys(item[objectKey])[0]], "map"))
            //Obtengo el primer item dependiendo si es un objeto con llave o no
            formProps.data[index].defaultValue = value.map((item) =>  Object.keys(item).length === 1 ? (item[objectKey][Object.keys(item[objectKey])[0]]) : (item[Object.keys(item)[0]])
            )
          }else {
            formProps.data[index].defaultValue = value
          }
        }else if(typeof value === 'object'){ //Es objeto el valor
          console.log("object")
          //Obtener el id en vez del nombre (el id siempre ira primero en la consulta graphql)
          formProps.data[index].defaultValue = Object.values(value)[0]
        }else{
          console.log("normal")
          formProps.data[index].defaultValue = value
        }
        i++;
      }
    }
    console.log(formProps.data, "valuesFormData")
  }

  const hideEditDialog = () => {
    setEditDialog(false)
  };

  const hideDeleteElementDialog = () => {
    setDeleteDialog(false);
  }
  
  const hideDeleteElementsDialog = () => {
    setDeleteMultipleDialog(false);
  }
  
  //deleting elements
  const deleteElement= () => {
    removeOne[1][Object.keys(removeOne[1])[0]] = element[Object.keys(element)[0]]
    try {
      removeOne[0]({ variables: removeOne[1] });
    } catch (error) {
      alert(error);
    }
    setDeleteDialog(false);
  }

  const confirmDeleteElement = (element) => {
    setElement(element)
    setDeleteDialog(true)
  }

  const confirmDeleteSelected = () => {
    setDeleteMultipleDialog(true)
  }

  const deleteElements = () => {
    //bulk delete
    const arr = []
    dt.current.props.selection.map((item) => {
      arr.push(Object.values(item)[0])
    })
    removeSeveral[1][Object.keys(removeSeveral[1])[0]] = arr
    try {
      removeSeveral[0]({ variables: removeSeveral[1] });
    } catch (error) {
      alert(error);
    }
    setDeleteMultipleDialog(false);
  }

  //editing elements
  const editElement = (elem) => {
    setElement(elem)
    changeValuesFormData(elem, true)
    setEditDialog(true)
  }
  const saveElement = (data) => {
    console.log("handle", data)
    let temp = {};
    if(Object.keys(element)[0].includes("id")){
      Object.assign(temp, pick(element, Object.keys(element)[0]))
    }
    Object.assign(temp, data)
    console.log(temp, "temp")
    Object.assign(formProps.variables[Object.keys(formProps.variables)[0]], temp)
    console.log( formProps.variables, "formVariables")
    try {
      formProps.handle({ variables: formProps.variables})
    } catch (error) {
      console.log("object")
      alert(error);
    }
    setEditDialog(false)
  };

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
        <div className="action-table flex">
          {additionalButtons && additionalButtons.map(item => React.cloneElement(item[0], {"onClick": () => item[1](rowData)})) }
          {edit && <div>   
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" data-pr-tooltip="Editar" onClick={() => editElement(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning " data-pr-tooltip="Eliminar" onClick={() => confirmDeleteElement(rowData)} />
          </div>
          }
        </div>
    );
  }

  //toolbar templates
  const leftToolbarTemplate = () => {
    if(edit)
      return (
          <div>
              <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => {
                setElement(emptyElement)
                changeValuesFormData(emptyElement, false)
                setEditDialog(true)
                }
                } />
              <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedElement || !selectedElement.length} />
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
          paginator={value?.length <= rowNumbers[0] ? false : pagination} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate={`{first} - {last} of {totalRecords}`}  className="p-mt-6"
          rows={rowNumbers[0]} rowsPerPageOptions={rowNumbers}
          header={h} footer={`Filas: ${value ? value.length : 0}`}
          selectionMode={selectionType} selection={selectedElement} onSelectionChange={e => {setSelectedElement(e.value)}}
          removableSort={sortRemove} sortField={fieldSort} sortOrder={orderSort} filterDisplay={filterDplay} filters={filtersValues}
        >
          {selectionType === "multiple" ? <Column selectionMode="multiple" exportable={false}/> : undefined}
          {dynamicColumns}
          {edit || additionalButtons ? <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column> : undefined}
        </DataTable>

        <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirmación" modal footer={deleteDialogFooter} onHide={hideDeleteElementDialog}>
                <div className="flex flex-row align-content-end confirmation-content mt-3">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {element && <span className="mt-2">¿Está seguro que desea eliminar el elemento?</span>}
                </div>
        </Dialog>

            <Dialog visible={deleteMultipleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMultipleDialogFooter} onHide={hideDeleteElementsDialog}>
                <div className="flex flex-row align-content-end confirmation-content mt-3">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {element && <span>¿Está seguro que desea eliminar los elementos seleccionados?</span>}
                </div>
            </Dialog>

            <Dialog
            visible={editDialog}
            style={{ width: "450px" }}
            header={
              Object.keys(element).length === 0 ? "Insertar" : "Detalles"
            }
            modal
            breakpoints={{ "992px": "50vw", "768px": "65vw", "572px": "80vw" }}
            resizable={false}
            className=""
            onHide={() => {
              setEditDialog(false)
            }}
          >
            <Form
              data={formProps.data}
              schema={formProps.schema}
              handle={saveElement}
              cancel={hideEditDialog}
              buttonsNames={formProps.buttonsNames}
            />
          </Dialog>

      </div>
    </div>
  );
};
