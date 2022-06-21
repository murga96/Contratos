import React, {useEffect, useState} from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FilterMatchMode, FilterOperator, FilterService } from "primereact/api";
import { Table } from "../ui/Table";
import * as yup from "yup";
import {
  createDatosEntidad,
  removeDatosEntidad,
  removeNegociacionResumen,
  removeSeveralDatosEntidad,
  removeSeveralNegociacionResumen,
  selectAllDatosEntidades,
  selectAllGrupos,
  selectAllMonedas,
  selectAllNegociacionesResumen,
  selectAllTiposDeCompras,
  updateNegociacionResumen,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import moment from 'moment'
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export const Negociaciones = () => {
  const [negociacion, setNegociacion] = useState(null);
  const navigate = useNavigate();
  //graphQL
  const { data, error, loading } = useQuery(selectAllNegociacionesResumen, {
    onCompleted: (data) => {
      setNegociacion(
        JSON.parse(JSON.stringify(data.findAllNegociacionResumen))
      );
    },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    negociacion?.forEach(n => {
        n.fecha = moment(n.fecha, moment.ISO_8601).toDate();
    });
  }, [negociacion])
  
  const { data: dataGrupos, loading: loadingG } = useQuery(selectAllGrupos);
  const [updateElement, { loadingU, errorU }] = useMutation(
    updateNegociacionResumen,
    {
      refetchQueries: ["findAllNegociacionResumen"],
    }
  );
  const [removeElement] = useMutation(removeNegociacionResumen, {
    refetchQueries: ["findAllNegociacionResumen"],
  });
  const [removeSeveralElement] = useMutation(removeSeveralNegociacionResumen, {
    refetchQueries: ["findAllNegociacionResumen"],
  });

  //Table
  const RepresentativeFilterTemplate = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={dataGrupos?.findAllGrupos}
        onChange={onChange}
        optionLabel="grupos"
        placeholder="Seleccione algún grupo"
        className="p-column-filter"
      />
    );
  };
  FilterService.register("filterArray1", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.grupos === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });

  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    fecha: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_BEFORE }],
    },
    comite: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    consecutivo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "grupos.grupos": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    mercancias: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    importeTrd: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }],
    },
    importeGae: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }],
    },
    importeCuc: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }],
    },
    noNegociacion: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };
  let c = [
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
    { field: "comite", header: "Cómite" },
    { field: "consecutivo", header: "Consecutivo" },
    {
      field: "grupos.grupos",
      header: "Grupo",
      filterElement: RepresentativeFilterTemplate,
      filterMatchModeOptions: [{ label: "Grupos", value: "filterArray1" }],
      filterField: "grupos.grupos",
    },
    { field: "mercancias", header: "Mercancías"},
    { field: "importeTrd", header: "Importe TRD", type: "numeric" },
    { field: "importeGae", header: "Importe GAE", type: "numeric" },
    { field: "importeCuc", header: "Importe CUC", type: "numeric"},
    { field: "noNegociacion", header: "Id Negociacion" },
  ];
  let emptyElement = {
    fecha: "",
    comite: -1,
    consecutivo: -1,
    "grupo.grupos": "",
    mercancias: "",
    importeTrd: "",
    importeGae: "",
    importeCuc: "",
    comentarios: "",
    "moneda.moneda": "",
    operacion: false,
    tasa: -1.2,
    terminada: false,
    cancelada: false,
  };

  return (
    <div>
      {loading &&
        loadingG && (
          <div className="flex h-30rem justify-content-center align-items-center">
            <ProgressSpinner strokeWidth="3" />
          </div>
        )}
      {error && errorU && <h5>{error}</h5>}
      {!(
        loading ||
        error ||
        loadingU ||
        errorU ||
        loadingG
      )  && negociacion ? (
        <div>
          <Table
            value={negociacion}
            header="Negociaciones"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="fecha"
            filterDplay="menu"
            filtersValues={filters}
            edit={true}
            enableDelete={false}
            exportData={true}
            removeOne={[removeElement, { id: -1 }]}
            removeSeveral={[removeSeveralElement, { id: -1 }]}
            emptyElement={emptyElement}
            additionalButtons={[
                [
                  <Button
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-text"
                  data-pr-tooltip="Ver"
                  />,
                  (rowData) =>
                  navigate(
                    `/Negociaciones/Detalle/${rowData.idNegociacion}`
                  ),
                  ],
              ]}
              editLinks={["Add", "Edit"]}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
