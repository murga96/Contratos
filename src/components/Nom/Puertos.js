import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode, FilterService } from "primereact/api";
import * as yup from "yup";
import {
  updatePuerto,
  selectAllPuertos,
  removePuerto,
  removeSeveralPuerto,
  selectAllPaises,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { MultiSelect } from "primereact/multiselect";

export const Puertos = () => {
  //graphQL
  const { data, error, loading } = useQuery(selectAllPuertos);
  const [updateTC, { loadingU, errorU }] = useMutation(updatePuerto, {
    refetchQueries: ["selectAllPuertos"],
  });
  const [removeTC] = useMutation(removePuerto, {
    refetchQueries: ["selectAllPuertos"],
  });
  const [removeSeverTC] = useMutation(removeSeveralPuerto, {
    refetchQueries: ["selectAllPuertos"],
  });

  const paises = useQuery(selectAllPaises);
  //Table
  FilterService.register("filterArray", (value, filters) => {
    let ret = false;
    console.log(value, filters);
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.nomb === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const matchModes = [{ label: "Custom", value: "filterArray" }];
  const RepresentativeFilterTemplate = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={paises.data?.findAllPaises}
        onChange={onChange}
        optionLabel="nomb"
        placeholder="Seleccione el país"
        className="p-column-filter"
      />
    );
  };
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "pais.nomb": { value: null, matchMode: FilterMatchMode.CONTAINS },
    deposito: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombre", header: "Nombre" },
    {
      field: "pais.nomb",
      header: "País",
      filterElement: RepresentativeFilterTemplate,
      filterMatchModeOptions: matchModes,
      filterField: "pais.nomb",
    },
    { field: "deposito", header: "Depósito" },
  ];
  let emptyElement = { nombre: "", pais: "", deposito: "" };

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombre: yup.string().required("Nombre es requerido"),
    idPais: yup.number().required("País es requerido"),
    deposito: yup.string().nullable() /* .required("Depósito es requerido") */,
  });

  let dataStruct = [
    {
      id: 2,
      component: "InputText",
      name: "nombre",
      label: "Nombre*",
      defaultValue: "",
    },
    {
      id: 4,
      component: "Dropdown",
      name: "idPais",
      label: "País*",
      defaultValue: "",
      props: {
        options: paises.data?.findAllPaises,
        optionLabel: "nomb",
        optionValue: "pais",
        placeholder: "Seleccione un país",
      },
    },
    {
      id: 6,
      component: "InputText",
      name: "deposito",
      label: "Depósito",
      defaultValue: "",
    },
  ];
  const formProps = {
    data: dataStruct,
    schema: schema,
    handle: updateTC,
    variables: { puerto: {} },
    buttonsNames: ["Guardar", "Cancelar"],
  };
  return (
    <div>
      {loading && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {error && <h5 style={{ margin: "100px" }}>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllPuertos}
            header="Puertos"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="nombre"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={[removeTC, { id: -1 }]}
            removeSeveral={[removeSeverTC, { id: -1 }]}
            formProps={formProps}
            emptyElement={emptyElement}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
