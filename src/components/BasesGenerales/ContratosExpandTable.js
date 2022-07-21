import React, { useState, useEffect } from "react";
import {
  selectAllEjecutivos,
  selectAllMonedas,
  selectAllNegociacionesResumen,
  selectFormasEntrega,
  selectOneContratoByIdBaseG,
} from "../../database/GraphQLStatements";
import { useQuery } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode, FilterService, FilterOperator } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { TriStateCheckbox } from "primereact/tristatecheckbox";

export const ContratosTable = ({data}) => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState(null)

  //graphQL
  useQuery(
    selectOneContratoByIdBaseG,
    {
      variables: {id: data.idBasesGenerales},
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        const contratosTemp = data?.findContratosByIdBaseGeneral.map((i) => {
          i.fechaElaboracion = moment(i.fechaElaboracion, moment.ISO_8601).toDate();
          i.fechaArribo = moment(i.fechaArribo, moment.ISO_8601).toDate();
          i.fechaTasa = moment(i.fechaTasa, moment.ISO_8601).toDate();
          i.fechaFinal = moment(i.fechaFinal, moment.ISO_8601).toDate();
          i.fechaFirma = moment(i.fechaFirma, moment.ISO_8601).toDate();
          i.fechaInicial = moment(i.fechaInicial, moment.ISO_8601).toDate();
          i.fechaRecepcion = moment(i.fechaRecepcion, moment.ISO_8601).toDate();
          i.fechaPFirma = moment(i.fechaPFirma, moment.ISO_8601).toDate();
          return i;
        });
        setContratos(contratosTemp)
      }
    }
  );
  const { data: dataEjecutivos, loading: loadingE } =
    useQuery(selectAllEjecutivos);
  const { data: dataFE, loading: loadingFE } = useQuery(selectFormasEntrega);
  const { data: dataN, loading: loadingN } = useQuery(
    selectAllNegociacionesResumen
  );
  const { data: dataMoneda, loading: loadingM } = useQuery(selectAllMonedas);

  FilterService.register("filterEjecutivo", (value, filters) => {
    let ret = false;
    if (filters && value && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.nombre === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });

  useEffect(() => {
    // contratos.map((bg) => {
    //   bg.fecha = moment(bg.fecha, moment.ISO_8601).toDate();
    //   bg.fechaVencimiento = moment(bg.fechaVencimiento, moment.ISO_8601).toDate();
    //   return bg;
    // });
  });
  const RepresentativeFilterTemplateC = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={dataEjecutivos?.findAllEjecutivos}
        onChange={onChange}
        optionLabel="nombre"
        placeholder="Selecciona algún ejecutivo"
        className="p-column-filter"
        maxSelectedLabels={3}
        filter
        selectedItemsLabel="{0} elementos seleccionados"
      />
    );
  };

  FilterService.register("filterNegociacion", (value, filters) => {
    let ret = false;
    if (filters && value && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.noNegociacion === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate2C = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={dataN?.findAllNegociacionResumen}
        onChange={onChange}
        optionLabel="noNegociacion"
        placeholder="Seleccione alguna negociación"
        className="p-column-filter"
        maxSelectedLabels={3}
        filter
        selectedItemsLabel="{0} elementos seleccionados"
      />
    );
  };
  const RepresentativeFilterTemplate1C = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={dataMoneda.findAllMoneda}
        onChange={onChange}
        optionLabel="Monedas"
        placeholder="Seleccione alguna moneda"
        className="p-column-filter"
        maxSelectedLabels={3}
        filter
        selectedItemsLabel="{0} elementos seleccionados"
      />
    );
  };
  FilterService.register("filterMoneda", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.moneda === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });

  const filtersC = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    consecutivo: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    fechaElaboracion: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    "ejecutivoRealiza.nombre": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "negociacionResumen.noNegociacion": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    terminado: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };

  let cC = [
    { field: "consecutivo", header: "Consecutivo", type: "numeric" },
    {
      field: "fechaElaboracion",
      header: "Fecha de Creación",
      type: "date",
      filterElement1: (options) => {
        return (
          <Calendar
            value={options.value}
            onChange={(e) => {
              console.log(e, options);
              options.filterApplyCallback(e.value, options.index);
            }}
            dateFormat="dd/mm/yy"
            placeholder="Seleccione una fecha"
          />
        );
      },
    },
    {
      field: "ejecutivoRealiza.nombre",
      header: "Realizado por",
      filterElement: RepresentativeFilterTemplateC,
      filterMatchModeOptions: [
        { label: "Ejecutivo", value: "filterEjecutivo" },
      ],
      filterField: "ejecutivoRealiza.nombre",
    },
    {
      field: "negociacionResumen.noNegociacion",
      header: "Negociación",
      filterElement: RepresentativeFilterTemplate2C,
      filterMatchModeOptions: [
        { label: "Negociación", value: "filterNegociacion" },
      ],
      filterField: "negociacionResumen.noNegociacion",
    },
    {
      field: "terminado",
      header: "Terminado",
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

  let emptyElementC = {
    consecutivo: "",
    "tipoDeContrato.tipoContrato": "",
    "incoterm.abreviatura": "",
    "proveedor.codigo": "",
    "pais.pais": "",
    "compradores.nombre": "",
    fecha: "",
  };

    
    return (
      <div>
        {(loadingE || loadingM || loadingN) && (
          <div className="flex h-30rem justify-content-center align-items-center">
            <ProgressSpinner strokeWidth="3" />
          </div>
        )}
        {!(loadingE && loadingM && loadingN) ? (
          <div>
            <Table
              value={contratos}
              header="Contratos"
              size="small"
              columns={cC}
              pagination={true}
              rowNumbers={[10, 20, 30]}
              selectionType="multiple"
              sortRemove
              orderSort={1}
              fieldSort="consecutivo"
              filterDplay="menu"
              filtersValues={filtersC}
              edit={true}
              enableDelete={false}
              exportData={true}
              emptyElement={emptyElementC}
              additionalButtons={[
                // [
                //   <Button
                //     icon="pi pi-upload"
                //     className="p-button-rounded p-button-text"
                //     tooltip="Exportar contrato"
                //     tooltipOptions={{ position: "bottom" }}
                //   />,
                //   (rowData) => generateDocument(rowData),
                // ],
                [
                  <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text"
                    tooltip="Ver contrato"
                    tooltipOptions={{ position: "bottom" }}
                  />,
                  (rowData) =>
                    navigate(`/Contratos/Detalle/${rowData.idContrato}`),
                ],
              ]}
              editLinks={[`AddContract/${data.idBasesGenerales}`, "EditContract"]}
            />
          </div>
        ) : //poner cargar
        undefined}
      </div>
    );
};
