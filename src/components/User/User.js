import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode, FilterService } from "primereact/api";
import * as yup from "yup";
import {
  removeSeveralUsuario,
  removeUsuario,
  updateUsuario,
  selectAllRoles,
  selectAllUsuarios,
  selectAllEjecutivos,
  forcePasswordUsuario,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";

export const Users = () => {
  const roles = useQuery(selectAllRoles);
  const ejecutivos = useQuery(selectAllEjecutivos);
  //Table
  FilterService.register("filterArray", (value, filters) => {
    let ret = false;
    console.log(value);
    if (filters && value && filters.length > 0) {
      filters.forEach((filter) => {
        value.forEach((v) => {
          if (filter.rol === v.rol.rol) ret = true;
        });
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={roles?.data?.findAllRoles}
        onChange={onChange}
        optionLabel="rol"
        placeholder="Seleccione algún rol"
        className="p-column-filter"
      />
    );
  };
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombreUsuario: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "ejecutivo.nombre": { value: null, matchMode: FilterMatchMode.CONTAINS },
    usuarioRoles: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "nombreUsuario", header: "Nombre de Usuario" },
    { field: "ejecutivo.nombre", header: "Ejecutivo" },
    {
      field: "usuarioRoles",
      header: "Rol",
      filterElement: RepresentativeFilterTemplate,
      filterMatchModeOptions: [{ label: "Roles", value: "filterArray" }],
      filterField: "usuarioRoles",
    },
  ];
  let emptyElement = { nombreUsuario: "", ejecutivo: "", usuarioRoles: [] };

  //graphQL
  const { data, error, loading } = useQuery(selectAllUsuarios);
  const [updateTC, { loadingU, errorU }] = useMutation(updateUsuario, {
    refetchQueries: ["selectAllUsuarios"],
  });
  const [removeTC] = useMutation(removeUsuario, {
    refetchQueries: ["selectAllUsuarios"],
  });
  const [removeSeverTC] = useMutation(removeSeveralUsuario, {
    refetchQueries: ["selectAllUsuarios"],
  });
  const [forcePassword] = useMutation(forcePasswordUsuario);

  const forzarPassword = (elem) => {
    forcePassword({ variables: { idUsuario: elem?.idUsuario } });
    alert(
      "La contraseña del usuario " +
        elem.nombreUsuario +
        " fue modificada a Nombre de usuario + * + Año actual"
    );
  };

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    nombreUsuario: yup
      .string()
      .strict(true)
      .required("Nombre de usuario es requerido")
      .min(5, "Nombre de usuario debe tener al menos 5 carácteres")
      .lowercase("Nombre de usuario debe ser en minúsculas")
      .trim("Nombre de usuario no puede contener espacios"),
    idEjecutivo: yup.number().typeError("Ejecutivo es requerido"),
    roles: yup.array().min(1, "Selecciona al menos un rol"),
  });
  let dataStruct = [
    {
      id: 1,
      component: "label",
      name: "nombreUsuario",
      defaultValue: "Nombre de usuario*",
    },
    {
      id: 2,
      component: "InputText",
      name: "nombreUsuario",
      defaultValue: "",
    },
    {
      id: 3,
      component: "label",
      name: "idEjecutivo",
      defaultValue: "Ejecutivo*",
    },
    {
      id: 4,
      component: "Dropdown",
      name: "idEjecutivo",
      defaultValue: 1,
      props: {
        options: ejecutivos.data?.findAllEjecutivos,
        filter: true,
        optionLabel: "nombre",
        optionValue: "idEjecutivo",
        placeholder: "Selecciona un ejecutivo",
      },
    },
    {
      id: 5,
      component: "label",
      name: "roles",
      defaultValue: "Roles*",
    },
    {
      id: 6,
      component: "MultiSelect",
      name: "roles",
      defaultValue: [],
      props: {
        options: roles.data?.findAllRoles,
        optionLabel: "rol",
        optionValue: "idRol",
        maxSelectedLabels: 3,
        placeholder: "Selecciona los roles",
      },
    },
  ];
  const formProps = {
    data: dataStruct,
    schema: schema,
    handle: updateTC,
    variables: { usuario: {} },
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
            value={data?.findAllUsuarios}
            header="Usuarios"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="nombreUsuario"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            removeOne={[removeTC, { id: -1 }]}
            removeSeveral={[removeSeverTC, { id: -1 }]}
            formProps={formProps}
            emptyElement={emptyElement}
            additionalButtons={[
              [
                <Button
                  icon="pi pi-unlock"
                  className="p-button-rounded p-button-text mr-2"
                  data-pr-tooltip="Forzar contraseña"
                />,
                forzarPassword,
              ],
            ]}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
