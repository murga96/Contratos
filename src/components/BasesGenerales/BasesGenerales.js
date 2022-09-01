import React from "react";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { columnBodyChecker, Table } from "../ui/table/Table";
import { Loading } from "../LoadingComponent";
import { FilterMatchMode, FilterService, FilterOperator } from "primereact/api";
import {
  selectAllBasesGenerales,
  selectAllCompradores,
  selectAllIncoterm,
  selectAllPaises,
  selectAllProveedores,
  selectAllTipoContrato,
  selectOneBasesGenerales,
} from "../../database/GraphQLStatements";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import {
  fireError,
  generateBGDocumentInternacional,
  generateBGDocumentNacional,
} from "./../utils";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { ContratosTable } from "./ContratosExpandTable";
import { Column } from "primereact/column";
import { cloneDeep } from "lodash";

export const BasesGenerales = () => {
  const navigate = useNavigate();
  const [basesGenerales, setBasesGenerales] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [idBG, setidBG] = useState(-1);

  //graphQL
  const { error, loading } = useQuery(selectAllBasesGenerales, {
    variables: { take: 10, skip: 0 },
    onCompleted: (data) => {
      setBasesGenerales(data?.findAllBasesGenerales.data);
      setTotalRecords(data?.findAllBasesGenerales.count);
    },
    fetchPolicy: "network-only",
  });
  const [getBG] = useLazyQuery(selectAllBasesGenerales, {
    variables: { take: 10, skip: 0 },
    onCompleted: (data) => {
      setBasesGenerales(data?.findAllBasesGenerales.data);
      setTotalRecords(data?.findAllBasesGenerales.count);
    },
    fetchPolicy: "network-only",
  });
  const [getOneBG] = useLazyQuery(selectOneBasesGenerales, {
    fetchPolicy: "network-only",
  });

  const { data: findAllPaises, loading: loadingPa } = useQuery(selectAllPaises);
  const { data: findAllProveedores, loading: loadingProv } =
    useQuery(selectAllProveedores);
  const { data: findAllCompradores, loading: loadingComp } =
    useQuery(selectAllCompradores);
  const { data: findAllIncoterm, loading: loadingInc } =
    useQuery(selectAllIncoterm);

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
  const FilterTemplateInc = (options) => {
    return (
      <MultiSelect
        value={options.value}
        onChange={(e) => {
          return options.filterApplyCallback(e.value);
        }}
        options={findAllIncoterm?.findAllIncoterm}
        optionLabel="abreviatura"
        placeholder="Seleccione los incoterms"
        className="p-column-filter"
        maxSelectedLabels={1}
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
  const FilterTemplateProv = (options) => {
    return (
      <MultiSelect
        value={options?.value}
        onChange={(e) => {
          return options.filterApplyCallback(e.value);
        }}
        options={findAllProveedores?.findAllProveedores}
        optionLabel="compaIa"
        placeholder="Seleccione los proveedores"
        className="p-column-filter"
        maxSelectedLabels={1}
        filter
        virtualScrollerOptions={{ itemSize: 38 }}
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
  const FilterTemplatePais = (options) => {
    return (
      <MultiSelect
        value={options?.value}
        onChange={(e) => {
          return options.filterApplyCallback(e.value);
        }}
        options={findAllPaises?.findAllPaises}
        maxSelectedLabels={1}
        optionLabel="nomb"
        placeholder="Seleccione los países"
        className="p-column-filter"
        filter
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
  const FilterTemplateComp = (options) => {
    return (
      <MultiSelect
        value={options?.value}
        onChange={(e) => {
          return options.filterApplyCallback(e.value);
        }}
        options={findAllCompradores?.findAllCompradores}
        maxSelectedLabels={1}
        optionLabel="representante"
        placeholder="Seleccione los compradores"
        className="p-column-filter"
        filter
      />
    );
  };
  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    noContrato: {
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

  let emptyElement = {
    consecutivo: "",
    "tipoDeContrato.tipoContrato": "",
    "incoterm.abreviatura": "",
    "proveedor.codigo": "",
    "pais.pais": "",
    "compradores.nombre": "",
    fecha: "",
  };

  const generateDocument = async(rowData) => {
    try {
      const {data} = await getOneBG({variables: {id: rowData?.idBasesGenerales}})
      const baseG = data?.findOneBasesGenerales
      if(baseG){
        if (baseG.tipoDeContrato.tipoContrato.toUpperCase().includes("IMPORTACION")) {
          generateBGDocumentInternacional(baseG);
        } else if (baseG.tipoDeContrato.tipoContrato.toUpperCase().includes("PLAZA")) {
          generateBGDocumentInternacional(baseG);
        } else if (baseG.tipoDeContrato.tipoContrato.toUpperCase().includes("EXCEPCIONAL")) {
          generateBGDocumentInternacional(baseG);
        } else if (baseG.tipoDeContrato.tipoContrato.toUpperCase().includes("NAC")) {
          generateBGDocumentNacional(baseG);
        }
      }
    } catch (error) {
      fireError("Ocurrió un error al cargar la Base General")
    }
  };

  const lazyPagesChange = async (lazyParams) => {
    let filters;
    if (lazyParams.filters) {
      filters = cloneDeep(lazyParams.filters);
      delete filters.global;
      const keys = Object.keys(filters);
      keys.forEach((key) => {
        filters[key] = filters[key]["constraints"][0].value;
      });
    }
    filters.idComprador = filters["compradores.representante"]?.map(
      (item) => item.idComprador
    );
    delete filters["compradores.representante"];
    filters.idProveedor = filters["proveedor.compaIa"]?.map(
      (item) => item.codigo
    );
    delete filters["proveedor.compaIa"];
    filters.idPais = filters["pais.nomb"]?.map((item) => item.pais);
    delete filters["pais.nomb"];
    filters.idIncoterm = filters["incoterm.abreviatura"]?.map(
      (item) => item.idIncoterm
    );
    delete filters["incoterm.abreviatura"];
    const v = {
      variables: {
        take: lazyParams.rows,
        skip: lazyParams.first,
        campo: lazyParams.sortField,
        orden: lazyParams.sortOrder,
        where: filters,
      },
    };
    getBG(v);
  };

  // //Contratos Table
  if (error) return <h5>{error}</h5>;
  if (loading || loadingComp || loadingInc || loadingPa || loadingProv)
    return <Loading />;

  return (
    <>
      <Table
        value={basesGenerales}
        header="Bases Generales"
        size="small"
        // columns={c}
        pagination={true}
        rowNumbers={[10, 20, 30]}
        selectionType="multiple"
        sortRemove
        orderSort={-1}
        fieldSort="fecha"
        filterDplay="menu"
        filtersValues={filters}
        edit={true}
        enableDelete={false}
        exportData={true}
        expand={true}
        expandTemplate={(data) => <ContratosTable data={data} />}
        onRowToggle={(e) => {
          setidBG(e.data?.idBasesGenerales);
        }}
        emptyElement={emptyElement}
        lazy={true}
        lazyApiCall={lazyPagesChange}
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
              navigate(`/BasesGenerales/Detalle/${rowData.idBasesGenerales}`),
          ],
        ]}
        editLinks={[`Add`, "Edit"]}
      >
        <Column
          field="noContrato"
          header="No."
          body={columnBodyChecker}
          sortable
          filter
          filterField="noContrato"
        />
        <Column
          field="incoterm.abreviatura"
          header="Incoterm"
          body={columnBodyChecker}
          sortable
          filter
          filterElement={FilterTemplateInc}
          filterMatchModeOptions={[
            { label: "Incoterm", value: "filterIncoterm" },
          ]}
          filterField="incoterm.abreviatura"
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
        <Column
          field="proveedor.compaIa"
          header="Proveedor"
          body={columnBodyChecker}
          sortable
          filter
          filterElement={FilterTemplateProv}
          filterMatchModeOptions={[
            { label: "Proveedor", value: "filterProveedor" },
          ]}
          filterField="proveedor.compaIa"
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
        <Column
          field="pais.nomb"
          header="País"
          body={columnBodyChecker}
          sortable
          filter
          filterElement={FilterTemplatePais}
          filterMatchModeOptions={[{ label: "País", value: "filterPais" }]}
          filterField="pais.nomb"
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
        <Column
          field="compradores.representante"
          header="Comprador"
          body={columnBodyChecker}
          sortable
          filter
          filterElement={FilterTemplateComp}
          filterMatchModeOptions={[{ label: "Comprador", value: "filterPais" }]}
          filterField="compradores.representante"
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
        <Column
          field="fecha"
          header="Fecha"
          body={columnBodyChecker}
          sortable
          filter
          dataType="date"
          filterElement={(options) => {
            return (
              <Calendar
                value={options?.value}
                onChange={(e) => {
                  options.filterApplyCallback(e.value, options.index);
                }}
                dateFormat="dd/mm/yy"
                placeholder="Seleccione una fecha"
              />
            );
          }}
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
        <Column
          field="fechaVencimiento"
          header="Fecha de vencimiento:"
          body={columnBodyChecker}
          sortable
          filter
          dataType="date"
          filterElement={(options) => {
            return (
              <Calendar
                value={options?.value}
                onChange={(e) => {
                  options.filterApplyCallback(e.value, options.index);
                }}
                dateFormat="dd/mm/yy"
                placeholder="Seleccione una fecha"
              />
            );
          }}
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
        <Column
          field="aprobado"
          header="Aprobado:"
          body={columnBodyChecker}
          sortable
          filter
          filterElement={(options) => {
            return (
              <>
                <div className="mb-3">Aprobado</div>
                <TriStateCheckbox
                  value={options?.value}
                  onChange={(e) => options.filterApplyCallback(e.value)}
                />
              </>
            );
          }}
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
        <Column
          field="cancelado"
          header="Cancelado:"
          body={columnBodyChecker}
          sortable
          filter
          filterElement={(options) => {
            return (
              <>
                <div className="mb-3">Aprobado</div>
                <TriStateCheckbox
                  value={options?.value}
                  onChange={(e) => options.filterApplyCallback(e.value)}
                />
              </>
            );
          }}
          showFilterOperator={false}
          showApplyButton={false}
          showAddButton={false}
          showFilterMatchModes={false}
        />
      </Table>
    </>
  );
};
