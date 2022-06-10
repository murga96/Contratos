import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import {
  selectAllCompradores,
  createCompradores,
  removeCompradores,
  removeSeveralCompradores,
  selectAllDatosEntidades,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

export const Compradores = () => {
  //Table
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    representante: { value: null, matchMode: FilterMatchMode.CONTAINS },
    domicilio: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "entidad.nombre": { value: null, matchMode: FilterMatchMode.CONTAINS },
    cargo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    activo: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombre", header: "Nombre" },
    { field: "representante", header: "Representante" },
    { field: "domicilio", header: "Domicilio" },
    { field: "entidad.nombre", header: "Entidad" },
    { field: "cargo", header: "Cargo" },
    {
      field: "activo",
      header: "activo",
      filterElement1: (options) => {
        return (
          <TriStateCheckbox
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.value)}
          />
        );
      },
    },
  ];
  let emptyElement = {
    nombre: "",
    representante: "",
    domicilio: "",
    "entidad.nombre": {},
    cargo: "",
    activo: false,
  };

  //graphQL
  const { data, error, loading } = useQuery(selectAllCompradores);
  const { data: findAllDatosEntidad, loading: loadingE } = useQuery(
    selectAllDatosEntidades
  );
  const [updateElement, { loadingU, errorU }] = useMutation(createCompradores, {
    refetchQueries: ["selectAllCompradores"],
  });
  const [removeElement] = useMutation(removeCompradores, {
    refetchQueries: ["selectAllCompradores"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralCompradores, {
    refetchQueries: ["selectAllCompradores"],
  });

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombre: yup.string().required("Nombre es requerido"),
    representante: yup.string().required("Representante es requerido"),
    domicilio: yup.string().required("Domicilio es requerido"),
    idEntidad: yup.number().required("Entidad es requerido"),
    cargo: yup.string().required("Cargo es requerido"),
    activo: yup.boolean().required("Activo es requerido"),
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
      component: "InputText",
      label: "Representante*",
      name: "representante",
      defaultValue: "",
    },
    {
      id: 4,
      component: "InputTextArea",
      label: "Domicilio*",
      name: "domicilio",
      defaultValue: "",
    },
    {
      id: 1,
      component: "Dropdown",
      name: "idEntidad",
      defaultValue: "",
      label: "Entidad*",
      props: {
        options: findAllDatosEntidad?.findAllDatosEntidad,
        optionLabel: "nombre",
        optionValue: "codigo",
        placeholder: "Seleccione una entidad",
        filter: true,
      },
    },
    {
      id: 4,
      component: "InputText",
      label: "Cargo*",
      name: "cargo",
      defaultValue: "",
    },
    {
      id: 9,
      component: "CheckBox",
      name: "activo",
      defaultValue: false,
      label: "Activo",
    },
  ];
  const formProps = {
    data: dataStruct,
    schema: schema,
    handle: updateElement,
    variables: { createCompradoreInput: {} },
    buttonsNames: ["Guardar", "Cancelar"],
  };
  return (
    <div>
      {loading && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data?.findAllCompradores}
            header="Compradores"
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
            removeOne={[removeElement, { id: -1 }]}
            removeSeveral={[removeSeveralElement, { id: -1 }]}
            formProps={formProps}
            emptyElement={emptyElement}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
