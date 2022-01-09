import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralFormasEntrega,
  removeFormasEntrega,
  selectFormasEntrega,
  updateFormasEntrega,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const FormasEntrega = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "formaEntrega": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "dias": { value: null, matchMode: FilterMatchMode.EQUALS },
  };
  let c = [
    { field: "formaEntrega", header: "Formas de entrega"},
    { field: "dias", header: "Días"},
  ];
  let emptyElement = {"formaEntrega": "", "dias": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectFormasEntrega);
  const [updateElement, { loadingU, errorU }] = useMutation(updateFormasEntrega, {
    refetchQueries: ["selectAllFormasEntrega"],
  });
  const [removeElement] = useMutation(removeFormasEntrega, {
    refetchQueries: ["selectAllFormasEntrega"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralFormasEntrega, {
    refetchQueries: ["selectAllFormasEntrega"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    formaEntrega: yup.string().required("Compra es requerido"),
    dias: yup.number().required("Días es requerido").typeError("Días tiene que ser de tipo númerico").integer("Días tiene que ser un número entero")
                      .positive("Días tiene que ser un número positivo"),
  });
  
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "formaEntrega",
      defaultValue: "Formas de entrega*",
    },
    {
      id: 2,
      component: "InputText",
      name: "formaEntrega",
      defaultValue: "",
    },
    {
      id: 3,
      component: "label",
      name: "dias",
      defaultValue: "Días*",
    },
    {
      id: 4,
      component: "InputText",
      name: "dias",
      defaultValue: "",
    },
    
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { formaEntrega: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllFormasEntrega}
            header="Formas de entrega"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="formaEntrega"
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

