import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  updateMoneda,
  selectAllMonedas,
  removeMoneda,
  removeSeveralMoneda,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from 'primereact/progressspinner';

export const Monedas = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "moneda": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "abreviatura": { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "moneda", header: "Moneda"},
    { field: "abreviatura", header: "Abreviatura"},
  ];
  let emptyElement = {"moneda": "", "abreviatura": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectAllMonedas);
  const [updateTC, { loadingU, errorU }] = useMutation(updateMoneda, {
    refetchQueries: ["selectAllMonedas"],
  });
  const [removeTC] = useMutation(removeMoneda, {
    refetchQueries: ["selectAllMonedas"],
  });
  const [removeSeverTC] = useMutation(removeSeveralMoneda, {
    refetchQueries: ["selectAllMonedas"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    moneda: yup.string().required("Moneda es requerido"),
    abreviatura: yup.string().required("Abreviatura es requerido"),
  });

  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "moneda",
      defaultValue: "Moneda*",
    },
    {
      id: 2,
      component: "InputText",
      name: "moneda",
      defaultValue: "",
    },
    {
      id: 3,
      component: "label",
      name: "abreviatura",
      defaultValue: "Abreviatura*",
    },
    {
      id: 4,
      component: "InputText",
      name: "abreviatura",
      defaultValue: "",
    },
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateTC, "variables": { moneda: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}      
      {error && <h5 style={{margin: "100px"}}>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllMoneda}
            header="Monedas"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="moneda"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={ [removeTC, {id: -1}] }
            removeSeveral={ [removeSeverTC, {id: -1}] }
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

