import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralFormasPago,
  removeFormasPago,
  selectFormasPago,
  updateFormasPago,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";

export const FormasPago = () => {

  //Table
  const filters = {
    "global": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "formaPago": { value: null, matchMode: FilterMatchMode.CONTAINS },
    "dias": { value: null, matchMode: FilterMatchMode.EQUALS },
  };
  let c = [
    { field: "formaPago", header: "Formas de pago"},
    { field: "dias", header: "Días"},
  ];
  let emptyElement = {"formaPago": "", "dias": ""}

  //graphQL
  const { data, error, loading } = useQuery(selectFormasPago);
  const [updateElement, { loadingU, errorU }] = useMutation(updateFormasPago, {
    refetchQueries: ["selectAllFormasPago"],
  });
  const [removeElement] = useMutation(removeFormasPago, {
    refetchQueries: ["selectAllFormasPago"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralFormasPago, {
    refetchQueries: ["selectAllFormasPago"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    formaPago: yup.string().required("Forma de pago es requerido"),
    dias: yup.number().required("Días es requerido").typeError("Días tiene que ser de tipo númerico").integer("Días tiene que ser un número entero")
                      .positive("Días tiene que ser un número positivo"),
  });
  
  let dataStruct = [
    {
      id: 2,
      component: "InputText",
      name: "formaPago",
      label: "Formas de pagos*",
      defaultValue: "",
    },
    {
      id: 4,
      component: "InputText",
      label: "Días*",
      name: "dias",
      defaultValue: "",
    },
    
  ];
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateElement, "variables": { formaPago: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllFormasPago}
            header="Formas de Pagos"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="formaPagos"
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

