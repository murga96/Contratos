import React, { useState } from "react";
import { Column } from "primereact/column";
import {
  selectAllApartirDe,
  selectFormasPago,
} from "../../../database/GraphQLStatements";
import { useQuery } from "@apollo/client";
import { Loading } from "../../LoadingComponent";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";

export const PagosTable = ({ pagos, setPagos, setVisiblePagosForm }) => {
  //graphql
  const { data: dataFP, loading: loadingFP } = useQuery(selectFormasPago);
  const { data: dataA, loading: loadingA } = useQuery(selectAllApartirDe);
  const [selectedElements, setSelectedElements] = useState([]);

  const onRowEditComplete = (e) => {
    let _pagos = [...pagos];
    let { newData, index } = e;

    _pagos[index] = newData;

    setPagos(_pagos);
  };
  const textEditor = (options) => {
    return (
      <InputText
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const formasPagoEditor = (options) => {
    return (
      <Dropdown
        className="w-full"
        value={options.value}
        options={dataFP.findAllFormasPago}
        optionLabel="formaPago"
        onChange={(e) => options.editorCallback(e.value)}
      />
    );
  };
  const apartirDeEditor = (options) => {
    return (
      <Dropdown
        className="w-full"
        value={options.value}
        options={dataA.findAllPagosAPartirDe}
        optionLabel="aPartirDe"
        onChange={(e) => options.editorCallback(e.value)}
      />
    );
  };
  const addPago = () => {
    setVisiblePagosForm(true);
  };
  const removePago = () => {
    confirmDialog({
      message: "Desea eliminar los pagos seleccionados?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => setPagos((prev) => prev.filter((p) => !selectedElements.includes(p))),
    });
  };

  const header = () => {
    return (
      <div className={"flex justify-content-between"}>
        <div className="">Pagos</div>
        <div className="flex justify-content-end mb-3">
        <Button
          className="p-button-sm mr-3 p-button-success"
          type="button"
          label="Añadir"
          onClick={addPago}
        />
        <Button
          type="button"
          disabled={selectedElements.length === 0}
          label="Eliminar"
          className="p-button-sm p-button-danger"
          onClick={removePago}
        />
        </div>
      </div>
    )
  } 
  if (loadingFP || loadingA) return <Loading />;
  return (
    <div className="col-12">
      <DataTable
        value={pagos}
        responsiveLayout="scroll"
        size="small"
        header={header}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        selection={selectedElements}
        onSelectionChange={(e) => setSelectedElements(e.value)}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
        ></Column>
        <Column
          field="idFormaPago"
          header="Formas de Pago"
          editor={(options) => formasPagoEditor(options)}
          body={(rowData) => {
            return rowData.idFormaPago.formaPago;
          }}
          // sortable
          // filter
          // filterField="formaPago"
        />
        <Column
          field="plazoPago"
          header="Plazo"
          dataType="number"
          editor={(options) => textEditor(options)}
          // sortable
          // filter
          // filterField="plazo"
        />
        <Column
          field="idPagosApartirDe"
          header="Apartir de"
          editor={(options) => apartirDeEditor(options)}
          body={(rowData) => {
            return rowData.idPagosApartirDe.aPartirDe;
          }}
          // sortable
          // filter
          // filterField="plazo"
        />
        <Column
          field="porciento"
          header="%"
          editor={(options) => textEditor(options)}
          // sortable
          // filter
          // filterField="plazo"
        />
        <Column
          rowEditor
          exportable={false}
          style={{ minWidth: "8rem" }}
        />
      </DataTable>
    </div>
  );
};
