import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralCargo,
  removeCargo,
  selectAllCargo,
  updateCargo,
} from "../../database/GraphQLStatements";

export const Cargos = () => {

  //Table
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    cargo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
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
      id: 1,
      component: "label",
      name: "cargo",
      defaultValue: "Cargo*",
    },
    {
      id: 2,
      component: "InputText",
      name: "cargo",
      defaultValue: "",
    },
    
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { cargo: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading && loadingU && <h5>Loading...</h5>}
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data.findAllCargos}
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

