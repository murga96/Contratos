import React from "react";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Table } from "../ui/Table";
import { FilterMatchMode, FilterService, FilterOperator } from "primereact/api";
import {
  selectAllBasesGenerales,
  selectAllCompradores,
  selectAllIncoterm,
  selectAllPaises,
  selectAllProveedores,
  selectAllTipoContrato,
  selectAllEjecutivos,
  selectAllMonedas,
  selectAllNegociacionesResumen,
  selectFormasEntrega,
  countBasesGenerales,
  selectOneContratoByIdBaseG,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import {
  generateBGDocumentInternacional,
  generateBGDocumentNacional,
} from "./../utils";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { ContratosTable } from "./ContratosExpandTable";

export const BasesGenerales = () => {
  const navigate = useNavigate();
  const [basesGenerales, setBasesGenerales] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [idBG, setidBG] = useState(-1);

  //graphQL
  const { loading: loadingCount } = useQuery(countBasesGenerales, {
    onCompleted: (data) => {
      if (data?.countBasesGenerales)
        setTotalRecords(data?.countBasesGenerales.cantidad);
    },
    fetchPolicy: "network-only",
  });
  const { error, loading } = useQuery(selectAllBasesGenerales, {
    variables: { take: 10, skip: 0 },
    onCompleted: (data) => {
      setBasesGenerales(
        JSON.parse(JSON.stringify(data?.findAllBasesGenerales))
      );
    },
    fetchPolicy: "network-only",
  });
  const [getBG, { loading: loadingLazyBG } ]= useLazyQuery(selectAllBasesGenerales, {
    variables: { take: 10, skip: 0 },
    onCompleted: (data) => {
      setBasesGenerales(
        JSON.parse(JSON.stringify(data?.findAllBasesGenerales))
      );
    },
    fetchPolicy: "network-only",
  });
  const { data: findAllTipoContrato, loading: loadingTC } = useQuery(
    selectAllTipoContrato
  );
  const { data: findAllPaises, loading: loadingPa } = useQuery(selectAllPaises);
  const { data: findAllProveedores, loading: loadingProv } =
    useQuery(selectAllProveedores);
  const { data: findAllCompradores, loading: loadingComp } =
    useQuery(selectAllCompradores);
  const { data: findAllIncoterm, loading: loadingInc } =
    useQuery(selectAllIncoterm);

  FilterService.register("filterTipoContrato", (value, filters) => {
    let ret = false;
    if (filters && value && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.tipoContrato === value) ret = true;
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
        options={findAllTipoContrato?.findAllTipoContrato}
        onChange={onChange}
        optionLabel="tipoContrato"
        placeholder="Selecciona los tipos de contratos"
        className="p-column-filter"
      />
    );
  };
  FilterService.register("filterIncoterm", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.abreviatura === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate1 = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={findAllIncoterm?.findAllIncoterm}
        onChange={onChange}
        optionLabel="abreviatura"
        placeholder="Seleccione los incoterms"
        className="p-column-filter"
      />
    );
  };
  FilterService.register("filterProveedor", (value, filters) => {
    let ret = false;
    if (filters && value && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.compaIa === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate2 = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={findAllProveedores?.findAllProveedores}
        onChange={onChange}
        optionLabel="compaIa"
        placeholder="Seleccione los proveedores"
        className="p-column-filter"
      />
    );
  };
  FilterService.register("filterPais", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.nomb === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate3 = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={findAllPaises?.findAllPaises}
        onChange={onChange}
        optionLabel="nomb"
        placeholder="Seleccione los países"
        className="p-column-filter"
      />
    );
  };
  FilterService.register("filterComprador", (value, filters) => {
    let ret = false;
    if (filters && value /* && value.length > 0 */ && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.representante === value) ret = true;
      });
    } else {
      ret = true;
    }
    return ret;
  });
  const RepresentativeFilterTemplate4 = ({ options, onChange }) => {
    return (
      <MultiSelect
        value={options.value}
        options={findAllCompradores?.findAllCompradores}
        onChange={onChange}
        optionLabel="representante"
        placeholder="Seleccione los compradores"
        className="p-column-filter"
      />
    );
  };
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    noContrato: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "tipoDeContrato.tipoContrato": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "incoterm.abreviatura": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "proveedor.compaIa": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "pais.nomb": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    "compradores.representante": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    fecha: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    fechaVencimiento: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    aprobado: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    cancelado: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };

  let c = [
    { field: "noContrato", header: "No." },
    {
      field: "tipoDeContrato.tipoContrato",
      header: "Tipo de Contrato",
      filterElement: RepresentativeFilterTemplate,
      filterMatchModeOptions: [
        { label: "Tipo de Contrato", value: "filterTipoContrato" },
      ],
      filterField: "tipoDeContrato.tipoContrato",
    },
    {
      field: "incoterm.abreviatura",
      header: "Incoterm",
      filterElement: RepresentativeFilterTemplate1,
      filterMatchModeOptions: [{ label: "Incoterm", value: "filterIncoterm" }],
      filterField: "incoterm.abreviatura",
    },
    {
      field: "proveedor.compaIa",
      header: "Proveedor",
      filterElement: RepresentativeFilterTemplate2,
      filterMatchModeOptions: [
        { label: "Proveedor", value: "filterProveedor" },
      ],
      filterField: "proveedor.compaIa",
    },
    {
      field: "pais.nomb",
      header: "País",
      filterElement: RepresentativeFilterTemplate3,
      filterMatchModeOptions: [{ label: "País", value: "filterPais" }],
      filterField: "pais.nomb",
    },
    {
      field: "compradores.representante",
      header: "Comprador",
      filterElement: RepresentativeFilterTemplate4,
      filterMatchModeOptions: [
        { label: "Comprador", value: "filterComprador" },
      ],
      filterField: "compradores.representante",
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
    {
      field: "fechaVencimiento",
      header: "Fecha de Vencimiento",
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
    {
      field: "aprobado",
      header: "Aprobado",
      filterElement1: (options) => {
        return (
          <TriStateCheckbox
            value={options.value}
            onChange={(e) => options.filterApplyCallback(e.value)}
          />
        );
      },
    },
    {
      field: "cancelado",
      header: "Cancelado",
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
    consecutivo: "",
    "tipoDeContrato.tipoContrato": "",
    "incoterm.abreviatura": "",
    "proveedor.codigo": "",
    "pais.pais": "",
    "compradores.nombre": "",
    fecha: "",
  };
  useEffect(() => {
    basesGenerales.map((bg) => {
      bg.fecha = moment(bg.fecha, moment.ISO_8601).toDate();
      bg.fechaVencimiento = moment(
        bg.fechaVencimiento,
        moment.ISO_8601
      ).toDate();
      return bg;
    });
  });

  const generateDocument = (rowData) => {
    console.log(rowData);
    if (rowData.tipoDeContrato.tipoContrato.includes("IMPORTACION")) {
      generateBGDocumentInternacional(rowData);
    } else if (rowData.tipoDeContrato.tipoContrato.includes("PLAZA")) {
      generateBGDocumentInternacional(rowData);
    } else if (rowData.tipoDeContrato.tipoContrato.includes("EXCEPCIONAL")) {
      generateBGDocumentInternacional(rowData);
    } else if (rowData.tipoDeContrato.tipoContrato.includes("NAC")) {
      generateBGDocumentNacional(rowData);
    }
  };

  // //Contratos Table

  return (
    <div>
      {(loading || loadingCount) && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {error && <h5>{error}</h5>}
      {!(loading || loadingCount) ? (
        <div>
          <Table
            value={basesGenerales}
            header="Bases Generales"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="consecutivo"
            filterDplay="menu"
            filtersValues={filters}
            edit={true}
            enableDelete={false}
            exportData={true}
            expand={true}
            expandTemplate={(data) => <ContratosTable data={data}/>}
            onRowToggle={(e) => {
              setidBG(e.data?.idBasesGenerales);
            }}
            emptyElement={emptyElement}
            lazy={true}
            lazyApiCall={getBG}
            totalRecords={totalRecords}
            additionalButtons={[
              [
                <Button
                  icon="pi pi-upload"
                  className="p-button-rounded p-button-text"
                  tooltip="Exportar"
                  tooltipOptions={{ position: "bottom" }}
                />,
                (rowData) => generateDocument(rowData),
              ],
              [
                <Button
                  icon="pi pi-eye"
                  className="p-button-rounded p-button-text"
                  tooltip="Ver"
                  tooltipOptions={{ position: "bottom" }}
                />,
                (rowData) =>
                  navigate(
                    `/BasesGenerales/Detalle/${rowData.idBasesGenerales}`
                  ),
              ],
            ]}
            editLinks={[`Add`, "Edit"]}
          />
        </div>
      ) : //poner cargar
      undefined}
    </div>
  );
};
