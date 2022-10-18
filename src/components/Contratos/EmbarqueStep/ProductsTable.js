import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useQuery } from "@apollo/client";
import { selectAllEmbalajes } from "../../../database/GraphQLStatements";
import { Loading } from "../../LoadingComponent";
import { omit } from "lodash";
import { confirmDialog } from "primereact/confirmdialog";

export const ProductsTable = ({ products, setProducts, idProveedor }) => {
  const [selectedElements, setSelectedElements] = useState([]);
  const [calc, setCalc] = useState([]);
  const fileRef = useRef([]);
  const unidadesRef = useRef(null);
  const rowNumbers = [10, 20, 30];
  console.log(products);

  //graphql
  const { data: dataE, loading: loadingE } = useQuery(selectAllEmbalajes);

  const importProducts = () => {
    const formData = new FormData();
    formData.append("file", fileRef.current.files[0]);
    formData.append("idProveedor", idProveedor);
    axios
      .post(`${process.env.REACT_APP_URL_API_R}/streaming/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        console.log(data);
        setProducts(
          data.map((p) => {
            return {
              idReferencia: omit(p, "codigo"),
              idCodigo: p.codigo.idCodigo,
              descripcionAx: p.codigo.descripcion,
              idUnidadMedida: p.codigo.embalaje,
              cantidadPorCarton: 1,
              paquete: 1,
              cantidadCartones: 1,
              volumen: 1,
              precio: p.codigo.precioProveedor,
              precioPaquete: p.codigo.precioProveedor,
              packing: 1,
              cajas: 1,
            };
          })
        );
      })
      .catch((error) => console.log(error));
  };

  const removeProducts = () => {
    confirmDialog({
      message: "Desea eliminar los productos seleccionados?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () =>
        setProducts((prev) =>
          prev.filter((p) => !selectedElements.includes(p))
        ),
    });
  };

  const onRowEditComplete = ({ newData, index }) => {
    let _products = [...products];
    _products[index] = newData;
    setProducts(_products);
  };
  const numberEditor = (options) => {
    return (
      <InputText
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(Number(e.target.value))}
      />
    );
  };

  const embalajesEditor = (options) => {
    return (
      <Dropdown
        className="w-full"
        value={options.value}
        options={dataE.findAllEmbalajes}
        optionLabel="abreviatura"
        onChange={(e) => {
          options.editorCallback(e.value);
        }}
      />
    );
  };

  const header = () => (
    <div className="flex justify-content-between">
      <div className="flex align-self-center ">Productos</div>
      <div className="flex justify-content-end">
        <div
          className={`field-radiobutton mr-3 h-full ${
            products.length === 0 ? "p-disabled" : ""
          }`}
        >
          <RadioButton
            ref={unidadesRef}
            inputId="calc1"
            value="Unidades"
            onChange={(e) => setCalc(e.value)}
            checked={calc === "Unidades"}
          />
          <label htmlFor="calc1">Unidades</label>
        </div>
        <div
          className={`field-radiobutton mr-3 h-full ${
            products.length === 0 ? "p-disabled" : ""
          }`}
        >
          <RadioButton
            value="Cajas"
            onChange={(e) => setCalc(e.value)}
            checked={calc === "Cajas"}
          />
          <label htmlFor="calc2">Cajas</label>
        </div>
        <Button
          className="p-button-sm p-button-warning mr-3"
          label="Importar"
          onClick={(e) => {
            fileRef.current.click();
          }}
          type="button"
        />
        <Button
          className="p-button-sm p-button-success mr-3"
          label="Añadir"
          onClick={(e) => {
            fileRef.current.click();
          }}
          type="button"
        />
        <Button
          type="button"
          disabled={selectedElements.length === 0}
          label="Eliminar"
          className="p-button-sm p-button-danger"
          onClick={removeProducts}
        />
      </div>
    </div>
  );

  if (loadingE) return <Loading />;

  return (
    <div className="col-12">
      <input
        ref={fileRef}
        className="hidden"
        type="file"
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,"
        onChange={(e) => {
          unidadesRef.current.select();
          importProducts();
        }}
      />
      <DataTable
        value={products}
        responsiveLayout="scroll"
        size="small"
        header={header}
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        selection={selectedElements}
        onSelectionChange={(e) => setSelectedElements(e.value)}
        rows={rowNumbers[0]}
        paginator={products.length >= rowNumbers[0]}
        rowsPerPageOptions={rowNumbers}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`{first} - {last} de {totalRecords}`}
        sortField="codigo"
        sortOrder={1}
        removableSort
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3em" }} />
        <Column
          field="idReferencia.referencia"
          header="Referencia"
          sortable
          filter
          filterField="referencia"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="idCodigo"
          header="Código"
          sortable
          filter
          filterField="idCodigo"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          style={{ minWidth: "30rem" }}
          field="descripcionAx"
          header="Descripción"
          sortable
          filter
          filterField="descripcionAx"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="idUnidadMedida"
          header="Embalaje"
          editor={embalajesEditor}
          body={(rowData) => {
            return rowData?.idUnidadMedida?.abreviatura
          }}
          sortable
          filter
          filterField="idUnidadMedidaCarton"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="paquete"
          header="U.M"
          editor={numberEditor}
          sortable
          filter
          filterField="paquete"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          className={`${calc === "Cajas" ? "p-disabled" : ""}`}
          field="cantidadPorCarton"
          header="Cant Total"
          body={calc === "Cajas" ? (rowData) => {return rowData.cajas * rowData.packing }: undefined}
          editor={calc === "Cajas" ? undefined : numberEditor}
          sortable
          filter
          filterField="cantidadPorCarton"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="packing"
          header="Packing"
          editor={numberEditor}
          sortable
          filter
          filterField="packing"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="cajas"
          header="Cajas"
          className={`${calc === "Unidades" ? "p-disabled" : ""}`}
          sortable
          body={
            calc === "Unidades"
              ? (rowData) => {
                  return Math.floor(
                    rowData.cantidadPorCarton / rowData.packing
                  );
                }
              : undefined
          }
          editor={calc === "Unidades" ? undefined : numberEditor}
          filter
          filterField="cajas"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          header="Pico"
          sortable
          body={(rowData) => {
            return rowData.cantidadPorCarton % rowData.packing;
          }}
          filter
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="precioPaquete"
          header="Precio"
          editor={numberEditor}
          sortable
          filter
          filterField="precioPaquete"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="volumen"
          header="Volumen"
          sortable
          editor={numberEditor}
          filter
          filterField="volumen"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="precio"
          header="Precio U."
          editor={numberEditor}
          sortable
          filter
          filterField="precio"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field="importe"
          header="Importe"
          sortable
          body={(rowData) => {
            return Number(
              (
                rowData.precioPaquete *
                rowData.cantidadCartones *
                rowData.cantidadPorCarton
              ).toFixed(2)
            );
          }}
          filter
          filterField="importe"
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column rowEditor exportable={false} style={{ minWidth: "6rem" }} />
      </DataTable>
    </div>
  );
};
