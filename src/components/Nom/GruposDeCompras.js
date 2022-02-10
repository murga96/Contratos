import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralGruposDeCompra,
  removeGruposDeCompra,
  selectAllGrupos,
  updateGruposDeCompra,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const GruposDeCompras = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "grupos": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "grupos", header: "Grupos"},
  ];
  let emptyElement = {"grupos": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllGrupos);
  const [updateElement, { loadingU, errorU }] = useMutation(updateGruposDeCompra, {
    refetchQueries: ["selectAllGrupos"],
  });
  const [removeElement] = useMutation(removeGruposDeCompra, {
    refetchQueries: ["selectAllGrupos"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralGruposDeCompra, {
    refetchQueries: ["selectAllGrupos"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    grupos: yup.string().required("Grupo es requerido"),
  });
  
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "grupos",
      defaultValue: "Grupo*",
    },
    {
      id: 2,
      component: "InputText",
      name: "grupos",
      defaultValue: "",
    },
    
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { grupo: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllGrupos}
            header="Grupos de compras"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="grupos"
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

