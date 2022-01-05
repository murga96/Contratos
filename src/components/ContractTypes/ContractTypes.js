import React from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  removeTipoContrato,
  selectAllTipoContrato,
  updateTipoContrato,
} from "../../database/GraphQLStatements";

export const ContractTypes = () => {

  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipoContrato: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ambasPartes: { value: null, matchMode: FilterMatchMode.CONTAINS },
    encabezado: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // visible: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const bodies =  {"tipoContrato": undefined, "encabezado": undefined, "ambasPartes": undefined/* , "visible": visibleBodyTemplate */}
  let c = [
    { field: "tipoContrato", header: "Tipo Contrato"},
    { field: "encabezado", header: "Encabezado"},
    { field: "ambasPartes", header: "Ambas partes"},
    // { field: "visible", header: "Visible"},
  ];
  let emptyElement = {"tipoContrato": "", "encabezado": "", "ambasPartes": "", "visible": true}

  //graphQL
  const { data, error, loading } = useQuery(selectAllTipoContrato);
  const [updateTC, { loadingU, errorU }] = useMutation(updateTipoContrato, {
    refetchQueries: ["findAllTipoContrato"],
  });
  const [removeTC] = useMutation(removeTipoContrato, {
    refetchQueries: ["findAllTipoContrato"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    tipoContrato: yup.string().required("Tipo de contrato es requerido"),
    encabezado: yup.string().required("Encabezado es requerido"),
    ambasPartes: yup.string().required("Ambas partes es requerido"),
    // visible: yup.boolean().required("Visible es requerido"),
  });
  
  const dataStruct = [
    {
      id: 1,
      component: "label",
      name: "tipoContrato",
      defaultValue: "Tipo de contrato*",
    },
    {
      id: 2,
      component: "InputText",
      name: "tipoContrato",
      defaultValue: "",
    },
    {
      id: 3,
      component: "label",
      name: "encabezado",
      defaultValue: "Encabezado*",
    },
    {
      id: 4,
      component: "InputText",
      name: "encabezado",
      defaultValue: "",
    },
    {
      id: 5,
      component: "label",
      name: "ambasPartes",
      defaultValue: "Ambas partes*",
    },
    {
      id: 6,
      component: "InputText",
      name: "ambasPartes",
      defaultValue: "",
    },
    // {
    //   id: 7,
    //   component: "label",
    //   name: "visible",
    //   defaultValue: "Ambas partes*",
    // },
    // {
    //   id: 8,
    //   component: "CheckBox",
    //   name: "visible",
    //   defaultValue: "",
    // },
  ];
  
  const formProps = {"data": dataStruct, "schema": schema, "handle": updateTC, "variables": { tipoContrato: {} }, "buttonsNames": ["Guardar", "Cancelar"]}
  return (
    <div>
      <Navbar />
      {loading && loadingU && <h5>Loading...</h5>}
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data.findAllTipoContrato}
            bodies={bodies}
            header="Tipos de Contratos"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="tipoContrato"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={ [removeTC, {id: -1}] }
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
