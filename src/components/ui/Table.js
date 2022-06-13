import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Form } from "./Form";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { values, get, pick, at } from "lodash";
import moment from "moment";
import { useNavigate } from "react-router";
import { saveAs } from "file-saver";
import { MultiSelect } from "primereact/multiselect";
import { FilterService } from "primereact/api";
import { fireError } from "../utils";

export const Table = ({
  value,
  header,
  size,
  columns,
  pagination,
  rowNumbers,
  selectionType,
  sortRemove,
  fieldSort,
  orderSort,
  filterDplay,
  filtersValues,
  edit,
  exportData,
  removeOne,
  removeSeveral,
  formProps,
  emptyElement,
  additionalButtons,
  editLinks,
}) => {
  const dt = useRef(null);
  const navigate = useNavigate();
  const [selectedElement, setSelectedElement] = useState(null);
  const [element, setElement] = useState({});
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  //header and columns
  const h = <div className="table-header">{header}</div>;
  console.log(value);
  const bodyChecker = (rowData, item) => {
    const havePoint = item.field.split(".").length !== 0;
    if (typeof get(rowData, item.field) === "boolean") {
      return get(rowData, item.field) ? (
        <i
          className="pi pi-check-circle"
          style={{ color: "#008000", fontSize: "1.3rem" }}
        ></i>
      ) : (
        <i
          className="pi pi-times-circle"
          style={{ color: "red", fontSize: "1.3rem" }}
        ></i>
      );
    } else if (item.column.props.dataType === "date") {
      return moment(get(rowData, item.field)).format("DD/MM/YYYY");
    } else if (
      havePoint &&
      Array.isArray(get(rowData, item.field.split(".")[0]))
    ) {
      const array = get(rowData, item.field.split(".")[0]);
      if (array.length > 0) {
        //llave del objeto
        const objectKey = Object.keys(array[0]);
        //Obtengo el segundo item del arreglo para mostrarlo en la cadena
        // console.log(get(rowData, item.field).map((i) =>  Object.keys(i).length === 1 ? i[objectKey][Object.keys(i[objectKey])[1]] : i[Object.keys(i)[1]]).toString())
        return array
          .map((i) =>
            Object.keys(i).length === 1
              ? i[objectKey][Object.keys(i[objectKey])[1]]
              : i[Object.keys(i)[1]]
          )
          .join(", ");
      }
    } else {
      return get(rowData, item.field);
    }
  };

  const datatypeChecker = (col, i) => {
    let ret = "";
    const type = value.length > 0 && typeof Object.values(value[0])[i + 1];
    if (col.type) {
      console.log(col, "object");
      ret = col.type;
    } else if (type === "number") {
      ret = "numeric";
    } else {
      ret = "text";
    }
    return ret;
  };

  const verifiedRowFilterTemplate = (options) => {
    return (
      <TriStateCheckbox
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.value)}
      />
    );
  };
  console.log(value, columns);
  const dynamicColumns = columns.map((col, i) => {
    return (
      <Column
        key={!col.filterElement ? col.field : undefined}
        field={col.field}
        header={col.header}
        sortable={
          fieldSort === null ? false : true
        } /*  style={{flex: 1,justifyContent: "center"}} */
        body={bodyChecker}
        dataType={datatypeChecker(col, i)}
        filterField={col.filterField && col.filterField}
        filterElement={
          col.filterElement
            ? (options) =>
                React.cloneElement(<col.filterElement options={options} />, {
                  onChange: (e) =>
                    dt.current.filter(
                      e.value,
                      col.filterField,
                      col.filterMatchModeOptions[0].value
                    ),
                })
            : col.filterElement1
            ? col.filterElement1
            : undefined
        }
        filterMatchModeOptions={col.filterMatchModeOptions}
        filter={filterDplay === null ? false : true}
        filterHeaderClassName="w-max"
      />
    );
  });
  const exportColumns = columns.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const changeValuesFormData = (elem, edit) => {
    let i = edit ? 1 : 0;
    console.log(elem, "elem");
    let fp = formProps?.data;
    if (Array.isArray(formProps?.data[0])) {
      if (
        Object.keys(elem).length === 0 ||
        !Object.keys(elem)[0].includes("id")
      ) {
        fp = formProps?.data[0];
      } else {
        fp = formProps?.data[1];
      }
    }
    for (let index = 0; index < formProps.data.length; index++) {
      // delete fp[0].defaultValue
      console.log(formProps.data[index].name)
      const entries = Object.entries(elem);

        let value = entries[i][1];
        if (Array.isArray(value)) {
          if (value.length > 0) {
            console.log("array");
            //llaves del objeto
            const objectKey = Object.keys(value[0]);
            //Obtengo el primer item dependiendo si es un objeto con llave o no
            fp[index].defaultValue = value.map((item) => {
              return Object.keys(item).length === 1
                ? item[objectKey][Object.keys(item[objectKey])[0]]
                : item;
            });
          } else {
            fp[index].defaultValue = value;
          }
        } else if (typeof value === "object" && value) {
          //Es objeto el valor
          console.log("object");
          //Obtener el id en vez del nombre (el id siempre ira primero en la consulta graphql)
          formProps.data[index].defaultValue = Object.values(value)[0];
        } else {
          console.log("normal");
          fp[index].defaultValue = value;
        }
        i++;
      }
    
    setFormData(fp);
  };

  const hideEditDialog = () => {
    setEditDialog(false);
  };

  const hideDeleteElementDialog = () => {
    setDeleteDialog(false);
  };

  const hideDeleteElementsDialog = () => {
    setDeleteMultipleDialog(false);
  };

  //deleting elements
  const deleteElement = () => {
    removeOne[1][Object.keys(removeOne[1])[0]] =
      element[Object.keys(element)[0]];
    try {
      removeOne[0]({ variables: removeOne[1] });
    } catch (error) {
      fireError(error);
    }
    setDeleteDialog(false);
  };

  const confirmDeleteElement = (element) => {
    setElement(element);
    setDeleteDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteMultipleDialog(true);
  };

  const deleteElements = () => {
    //bulk delete
    const arr = [];
    dt.current.props.selection.map((item) => arr.push(Object.values(item)[0]));
    removeSeveral[1][Object.keys(removeSeveral[1])[0]] = arr;
    try {
      removeSeveral[0]({ variables: removeSeveral[1] });
    } catch (error) {
      fireError(error);
    }
    setDeleteMultipleDialog(false);
  };

  //editing elements
  const editElement = (elem) => {
    setElement(elem);
    changeValuesFormData(elem, true);
    setEditDialog(true);
  };
  const saveElement = (data) => {
    console.log("handle", data);
    let temp = {};
    if (Object.keys(element)[0].includes("id")) {
      Object.assign(temp, pick(element, Object.keys(element)[0]));
    }
    Object.assign(temp, data);
    console.log(temp, "temp");
    Object.assign(
      formProps.variables[Object.keys(formProps.variables)[0]],
      temp
    );
    console.log(formProps.variables, "formVariables");
    try {
      formProps.handle({ variables: formProps.variables });
    } catch (error) {
      console.log("object");
      fireError(error);
    }
    setEditDialog(false);
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0, "letter", true);
        let arr = [];
        let temp = [];
        value.map((index) => {
          exportColumns.map((x) => {
            const havePoint = x.dataKey.split(".").length !== 0;
            if (
              havePoint &&
              Array.isArray(get(index, x.dataKey.split(".")[0]))
            ) {
              const array = get(index, x.dataKey.split(".")[0]);
              if (array.length > 0) {
                //llave del objeto
                console.log("bodyArray");
                const objectKey = Object.keys(array[0]);
                console.log(objectKey);
                //Obtengo el segundo item del arreglo para mostrarlo en la cadena
                // console.log(get(rowData, item.field).map((i) =>  Object.keys(i).length === 1 ? i[objectKey][Object.keys(i[objectKey])[1]] : i[Object.keys(i)[1]]).toString())
                temp.push(
                  array
                    .map((i) =>
                      Object.keys(i).length === 1
                        ? i[objectKey][Object.keys(i[objectKey])[1]]
                        : i[Object.keys(i)[1]]
                    )
                    .toString()
                );
              }
            } else {
              temp.push(get(index, x.dataKey));
            }
          });
          arr.push(temp);
          temp = [];
        });
        console.log(arr);
        // doc.autoTableSetDefaults(
        //   {
        //     headStyles: { fillColor: "#ed2939" }, // Purple
        //   },
        //   doc
        // )
        doc.autoTable({
          head: [exportColumns.map((i) => i.title)],
          startY: doc.autoTable() + 50,
          margin: { horizontal: 10 },
          styles: { overflow: "linebreak" },
          bodyStyles: { valign: "top" },
          theme: "striped",
          showHead: "everyPage",
          body: arr,
        });

        doc.save(`${header}.pdf`);
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      let arr = [];
      let obj = {};
      value.map((v) => {
        exportColumns.map((col) => {
          const havePoint = col.dataKey.split(".").length !== 0;
          if (havePoint && Array.isArray(get(v, col.dataKey.split(".")[0]))) {
            const array = get(v, col.dataKey.split(".")[0]);
            if (array.length > 0) {
              //llave del objeto
              console.log("bodyArray");
              const objectKey = Object.keys(array[0]);
              console.log(objectKey);
              //Obtengo el segundo item del arreglo para mostrarlo en la cadena
              // console.log(get(rowData, item.field).map((i) =>  Object.keys(i).length === 1 ? i[objectKey][Object.keys(i[objectKey])[1]] : i[Object.keys(i)[1]]).toString())
              obj[col.title] = array
                .map((i) =>
                  Object.keys(i).length === 1
                    ? i[objectKey][Object.keys(i[objectKey])[1]]
                    : i[Object.keys(i)[1]]
                )
                .toString();
            }
          } else {
            obj[col.title] = get(v, col.dataKey);
          }
        });
        arr.push(obj);
        obj = {};
      });
      const worksheet = xlsx.utils.json_to_sheet(arr);
      const workbook = { Sheets: { Datos: worksheet }, SheetNames: ["Datos"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, header);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    saveAs(data, fileName + EXCEL_EXTENSION);
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
              onClick={() => confirmDeleteElement(rowData)}
            />
          </div>
        )}
      </div>
    );
  };

  //toolbar templates
  const leftToolbarTemplate = () => {
    if (edit)
      return (
        <div>
          <Button
            label="Nuevo"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={() => {
              if (!editLinks) {
                setElement(emptyElement);
                changeValuesFormData(emptyElement, false);
                setEditDialog(true);
              } else {
                navigate(editLinks[0]);
              }
            }}
          />
          <Button
            label="Eliminar"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedElement || !selectedElement.length}
          />
        </div>
      );
    else return undefined;
  };

  const rightToolbarTemplate = () => {
    if (exportData)
      return (
        <div className="p-d-flex p-ai-center export-buttons">
          <Button
            type="button"
            icon="pi pi-file"
            onClick={() => dt.current.exportCSV()}
            className="mr-2"
            data-pr-tooltip="CSV"
          />
          <Button
            type="button"
            icon="pi pi-file-excel"
            onClick={exportExcel}
            className="p-button-success mr-2"
            data-pr-tooltip="XLS"
          />
          <Button
            type="button"
            icon="pi pi-file-pdf"
            onClick={exportPdf}
            className="p-button-warning p-mr-2"
            data-pr-tooltip="PDF"
          />
          {/* <Button type="button" icon="pi pi-filter" onClick={() => exportCSV(true)} className="p-button-info ml-auto" data-pr-tooltip="Selection Only" /> */}
        </div>
      );
    else return undefined;
  };

  //dialogs
  const deleteDialogFooter = (
    <React.Fragment>
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteElement}
      />
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteElementDialog}
      />
    </React.Fragment>
  );

  const deleteMultipleDialogFooter = (
    <React.Fragment>
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteElements}
      />
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteElementsDialog}
      />
    </React.Fragment>
  );
  return (
    <div class="p-card p-4">
      <Tooltip target=".export-buttons>button" position="bottom" />
      <Tooltip target=".action-table>button" position="bottom" />
      {exportData || edit ? (
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>
      ) : undefined}
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
      >
        {selectionType === "multiple" ? (
          <Column selectionMode="multiple" exportable={false} />
        ) : undefined}
        {dynamicColumns}
        {edit || additionalButtons ? (
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "8rem" }}
          ></Column>
        ) : undefined}
      </DataTable>

      <Dialog
        visible={deleteDialog}
        style={{ width: "450px" }}
        header="Confirmación"
        modal
        footer={deleteDialogFooter}
        onHide={hideDeleteElementDialog}
      >
        <div className="flex flex-row align-content-end confirmation-content mt-3">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {element && (
            <span className="mt-2">
              ¿Está seguro que desea eliminar el elemento?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteMultipleDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteMultipleDialogFooter}
        onHide={hideDeleteElementsDialog}
      >
        <div className="flex flex-row align-content-end confirmation-content mt-3">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {element && (
            <span>
              ¿Está seguro que desea eliminar los elementos seleccionados?
            </span>
          )}
        </div>
      </Dialog>
      {/* Array.isArray(formProps?.data[0])
              ? Object.keys(element).length === 0 ||
                !Object.keys(element)[0].includes("pk")
                ? formProps?.data[1]
                : formProps?.data[0]
              : formProps?.data */}
      <Dialog
        visible={editDialog}
        style={{ width: "450px" }}
        header={
          Object.keys(element).length === 0 ||
          !Object.keys(element)[0].includes("pk")
            ? "Insertar"
            : "Detalles"
        }
        modal
        breakpoints={{ "992px": "50vw", "768px": "65vw", "572px": "80vw" }}
        resizable={false}
        className=""
        onHide={() => {
          setEditDialog(false);
        }}
      >
        {console.log(formProps)}
        {console.log(element, "element")}
        <Form
          data={formData}
          schema={formProps?.schema}
          handle={saveElement}
          cancel={hideEditDialog}
          buttonsNames={formProps?.buttonsNames}
          formProps={{ className: "grid" }}
        />
      </Dialog>
    </div>
  );
};
