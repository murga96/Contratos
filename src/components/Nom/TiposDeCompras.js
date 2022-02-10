import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralTiposDeCompras,
  removeTiposDeCompras,
  selectAllTiposDeCompras,
  updateTiposDeCompras,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const TiposDeCompras = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "compras": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "compras", header: "Compra"},
  ];
  let emptyElement = {"compras": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllTiposDeCompras);
  const [updateElement, { loadingU, errorU }] = useMutation(updateTiposDeCompras, {
    refetchQueries: ["selectAllTiposDeCompras"],
  });
  const [removeElement] = useMutation(removeTiposDeCompras, {
    refetchQueries: ["selectAllTiposDeCompras"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralTiposDeCompras, {
    refetchQueries: ["selectAllTiposDeCompras"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    compras: yup.string().required("Compra es requerido"),
  });
  
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "compras",
      defaultValue: "Compra*",
    },
    {
      id: 2,
      component: "InputText",
      name: "compras",
      defaultValue: "",
    },
    
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { tiposDeCompra: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllTiposDeCompras}
            header="Tipos de Compras"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="compras"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={ [removeElement, {id: -1}] }
            removeSeveral={ [removeSeveralElement, {id: -1}] }
            formProps={formProps}
            emptyElement={emptyElement}
          />
        </div>
      ) : (
        //poner cargar
        undefined
      )}
    </div>
  );
};

