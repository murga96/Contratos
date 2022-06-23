import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode, FilterService, FilterOperator } from "primereact/api";
import * as yup from "yup";
import {
  selectAllContratoMarco,
  createContratoMarco,
  removeContratoMarco,
  removeSeveralContratoMarco,
  selectAllProveedores,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";

export const CMarco = () => {
  const [cMarcos, setCMarcos] = useState(null);

  //graphQL
  const { data, error, loading } = useQuery(selectAllContratoMarco, {
    onCompleted: (data) => {
      setCMarcos(JSON.parse(JSON.stringify(data?.findAllContratoMarco)));
    },
  });
  const { data: dataProveedores } = useQuery(selectAllProveedores);
  const [updateElement, { errorU }] = useMutation(createContratoMarco, {
    refetchQueries: ["selectAllContratoMarco"],
  });
  const [removeElement] = useMutation(removeContratoMarco, {
    refetchQueries: ["selectAllContratoMarco"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralContratoMarco, {
    refetchQueries: ["selectAllContratoMarco"],
  });

  useEffect(() => {
    cMarcos?.map((bg) => {
      bg.fecha = moment(bg.fecha, moment.ISO_8601).toDate();
      return bg;
    });
  });

  //Table

  const RepresentativeFilterTemplate = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={dataProveedores?.findAllProveedores}
        onChange={onChange}
        optionLabel="compaIa"
        placeholder="Seleccione algún proveedor"
        virtualScrollerOptions={{ itemSize: 38 }}
        filter
        className="p-column-filter"
      />
    );
  };
  FilterService.register("filterArray", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.compaIa === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });

  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    consecutivo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    "proveedor.compaIa": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    fecha: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    monto: {
      operator: FilterOperator.AND,
      constraints: [
        { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
      ],
    },
    contratado: {
      operator: FilterOperator.AND,
      constraints: [
        { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
      ],
    },
    pendiente: {
      operator: FilterOperator.AND,
      constraints: [
        { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
      ],
    },
  };
  const montoBody = (rowData) => {
    return rowData?.monto.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  const contratadoBody = (rowData) => {
    return rowData?.contratado.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  const pendienteBody = (rowData) => {
    return rowData?.pendiente.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  let c = [
    { field: "consecutivo", header: "Consecutivo", type: "numeric" },
    {
      field: "proveedor.compaIa",
      header: "Proveedor",
      filterElement: RepresentativeFilterTemplate,
      filterMatchModeOptions: [{ label: "Proveedores", value: "filterArray" }],
      filterField: "proveedor.compaIa",
    },
    {
      field: "fecha",
      header: "Fecha",
      type: "date",
      filterElement1: (options) => {
        return (
          <Calendar
            value={options.value}
            onChange={(e) => {
              options.filterApplyCallback(e.value, options.index);
            }}
            dateFormat="dd/mm/yy"
            placeholder="Seleccione una fecha"
          />
        );
      },
    },
    { field: "monto", header: "Monto", type: "numeric", body: montoBody },
    {
      field: "contratado",
      header: "Contratado",
      type: "numeric",
      body: contratadoBody,
    },
    {
      field: "pendiente",
      header: "Pendiente",
      type: "numeric",
      body: pendienteBody,
    },
  ];
  let emptyElement = {
    fecha: null,
    monto: -1,
    idProveedor: 0,
    consecutivo: 0,
    contratado: 0,
    // pendiente: 0,
  };

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    fecha: yup.date().typeError("Fecha es requerida"),
    monto: yup
      .number()
      .min(1, "El monto debe ser mayor que cero")
      .required("Monto es requerido"),
    idProveedor: yup.number(),
    consecutivo: yup.number(),
    contratado: yup.number(),
  });

  let dataStruct = [
    {
      id: 2,
      component: "Calendar",
      name: "fecha",
      label: "Fecha*",
      defaultValue: "",
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "Monto*",
      name: "monto",
      defaultValue: 0,
      props: {
        step: 1000,
        min: 0,
        showButtons: true,
        allowEmpty: false,
        type: "int",
        size: 2,
        mode: "currency",
        currency: "USD",
        locale: "en-US",
      },
    },
    {
      id: 2,
      component: "Calendar",
      name: "idProveedor",
      defaultValue: "",
      props: {
        className: "hidden",
      },
    },
    {
      id: 2,
      component: "Calendar",
      name: "consecutivo",
      defaultValue: "",
      props: {
        className: "hidden",
      },
    },
    {
      id: 2,
      component: "Calendar",
      name: "contratado",
      defaultValue: "",
      props: {
        className: "hidden",
      },
    },
    // {
    //   id: 2,
    //   component: "Calendar",
    //   name: "pendiente",
    //   defaultValue: "",
    //   props: {
    //     className: "hidden",
    //   },
    // },
  ];

  let dataStructIns = [
    {
      id: 2,
      component: "Calendar",
      name: "fecha",
      label: "Fecha*",
      defaultValue: "",
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "Monto*",
      name: "monto",
      defaultValue: 0,
      props: {
        //   className: "mr-8",
        step: 1000,
        min: 0,
        showButtons: true,
        allowEmpty: false,
        type: "int",
        size: 2,
        mode: "currency",
        currency: "USD",
        locale: "en-US",
      },
    },
    {
      id: 2,
      component: "Dropdown",
      name: "idProveedor",
      label: "Proveedor*",
      defaultValue: 0,
      props: {
        options: dataProveedores?.findAllProveedores,
        optionLabel: "compaIa",
        optionValue: "codigo",
        placeholder: "Seleccione un proveedor",
        filter: true,
        virtualScrollerOptions: { itemSize: 38 },
      },
    },
    {
      id: 2,
      component: "Calendar",
      name: "consecutivo",
      defaultValue: "",
      props: {
        className: "hidden",
      },
    },
    {
      id: 2,
      component: "Calendar",
      name: "contratado",
      defaultValue: "",
      props: {
        className: "hidden",
      },
    },
    // {
    //   id: 2,
    //   component: "Calendar",
    //   name: "pendiente",
    //   defaultValue: "",
    //   props: {
    //     className: "hidden",
    //   },
    // },
  ];
  const formProps = {
    data: [dataStructIns, dataStruct],
    schema: schema,
    handle: updateElement,
    variables: { createContratoMarcoInput: {} },
    buttonsNames: ["Guardar", "Cancelar"],
  };
  return (
    <div>
      {(loading || !cMarcos) && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error) && cMarcos ? (
        <div>
          <Table
            value={cMarcos}
            header="Contratos Marcos"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="proveedor.compaIa"
            filterDplay="menu"
            filtersValues={filters}
            edit={true}
            enableDelete={false}
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
