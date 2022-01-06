import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralTiposDocumentos,
  removeTiposDocumentos,
  selectAllTiposDocumentos,
  updateTiposDocumentos,
} from "../../database/GraphQLStatements";

export const DocumentTypes = () => {

  //Table
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombreDoc: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombreDoc", header: "Nombre"},
  ];
  let emptyElement = {"nombreDoc": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllTiposDocumentos);
  const [updateElement, { loadingU, errorU }] = useMutation(updateTiposDocumentos, {
    refetchQueries: ["selectAllTiposDocumentos"],
  });
  const [removeElement] = useMutation(removeTiposDocumentos, {
    refetchQueries: ["selectAllTiposDocumentos"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralTiposDocumentos, {
    refetchQueries: ["selectAllTiposDocumentos"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombreDoc: yup.string().required("Documento es requerido"),
  });
  
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "nombreDoc",
      defaultValue: "Documento*",
    },
    {
      id: 2,
      component: "InputText",
      name: "nombreDoc",
      defaultValue: "",
    },
    
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { tipoDocumentos: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading && loadingU && <h5>Loading...</h5>}
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data.findAllTiposDocumento}
            header="Tipos de Documentos"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="nombreDoc"
            /* filterDplay="row"
            filtersValues={filters} */
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

