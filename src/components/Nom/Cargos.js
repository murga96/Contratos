import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
// import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralCargo,
  removeCargo,
  selectAllCargo,
  updateCargo,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const Cargos = () => {

  //Table
  // const filters = {
  //   "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   "cargo": { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   "combo": { value: null, matchMode: FilterMatchMode.CONTAINS },
  // };
  let c = [
    { field: "cargo", header: "Nombre"},
  ];
  let emptyElement = {"cargo": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllCargo);
  const [updateElement, { loadingU, errorU }] = useMutation(updateCargo, {
    refetchQueries: ["selectAllCargo"],
  });
  const [removeElement] = useMutation(removeCargo, {
    refetchQueries: ["selectAllCargo"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralCargo, {
    refetchQueries: ["selectAllCargo"],
  });
  
  //Form
  //React-hook-form
  const schema = yup.object().shape({
    cargo: yup.string().required("Cargo es requerido"),
  });
  
  let dataStruct = [
    {
      id: 2,
      component: "InputText",
      name: "cargo",
      label: "Cargo*",
      defaultValue: "",
    },
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { cargo: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllCargos}
            header="Cargos"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="cargo"
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

