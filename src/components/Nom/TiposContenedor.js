import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralTiposContenedor,
  removeTiposContenedor,
  selectAllTiposContenedor,
  updateTiposContenedor,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const TiposContenedor = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "tipoContenedor": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "tipoContenedor", header: "Compra"},
  ];
  let emptyElement = {"tipoContenedor": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllTiposContenedor);
  const [updateElement, { loadingU, errorU }] = useMutation(updateTiposContenedor, {
    refetchQueries: ["selectAllTiposContenedor"],
  });
  const [removeElement] = useMutation(removeTiposContenedor, {
    refetchQueries: ["selectAllTiposContenedor"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralTiposContenedor, {
    refetchQueries: ["selectAllTiposContenedor"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    tipoContenedor: yup.string().required("Tipo de contenedor es requerido"),
  });
  
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "tipoContenedor",
      defaultValue: "Tipo de contenedor*",
    },
    {
      id: 2,
      component: "InputText",
      name: "tipoContenedor",
      defaultValue: "",
    },
    
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { tiposContenedor: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllTiposContenedor}
            header="Tipos de Contenedores"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="tipoContenedor"
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

