import { useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  selectAllMonedas,
  selectAllTiposDeCompras,
  selectAllGrupos,
  selectOneNegociacionesResumen,
  updateNegociacionResumen,
  selectAllProveedores,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";
import _ from "lodash";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterOperator, FilterMatchMode } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";

export const NegociacionEdit = () => {
  const bg = useParams();
  const formRef = useRef();
  const navigate = useNavigate();
  const [negociacion, setNegociacion] = useState(null);
  const [proveedorDialog, setProveedorDialog] = useState(null);
  const [formProps, setFormProps] = useState(null);
  const [reRender, setReRender] = useState(null);


  //graphQL statements
  const { data, error, loading } = useQuery(selectOneNegociacionesResumen, {
    variables: { idBasesG: parseInt(bg.Negociacion) },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setNegociacion(
        JSON.parse(JSON.stringify(data?.findOneNegociacionResumen))
      );
    },
  });

  
  const [updateNegociacion] = useMutation(updateNegociacionResumen);
  const { data: dataTiposCompra, loading: loadingTC } = useQuery(
    selectAllTiposDeCompras
  );
  const { data: dataMonedas, loading: loadingM } = useQuery(selectAllMonedas);
  const { data: dataGrupo, loading: loadingG } = useQuery(selectAllGrupos);
  const { data: dataProveedores } = useQuery(selectAllProveedores);

  //Form Proveedores
  const saveProveedores = ({ proveedor, importe, ladi }) => {
    negociacion?.negociacionProveedores.push({
      idProveedor: proveedor.codigo,
      importe: importe,
      ladi: ladi,
      idNegociacion: negociacion?.idNegociacion,
      proveedor: {
        codigo: proveedor.codigo,
        compaIa: proveedor.compaIa,
      },
    });
    setProveedorDialog(false);
    setNegociacion(negociacion);
    // setFormProps(formProps);
  };

  const schemaProveedores = yup.object().shape({
    proveedor: yup.object().typeError("Seleccione un proveedor"),
    importe: yup
      .number()
      .min(1, "Importe debe ser mayor que 0")
      .required("Importe es requerido"),
    ladi: yup.boolean().required("Ladi es requerido"),
  });

  let dataStructProveedores = [
    {
      component: "Dropdown",
      name: "proveedor",
      label: "Proveedor*",
      defaultValue: "",
      props: {
        options: dataProveedores?.findAllProveedores.filter((item) => (negociacion?.negociacionProveedores.findIndex((i) => i.idProveedor === item.codigo) ===-1)),
        optionLabel: "compaIa",
        filter: true,
        virtualScrollerOptions: { itemSize: 38 },
      },
      fieldLayout: { className: "col-12" },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "Importe*",
      name: "importe",
      defaultValue: 0,
      props: {
        className: "mr-8",
        step: 1000,
        min: 0,
        mode: "currency",
        currency: "USD",
        locale: "en-US",
        showButtons: true,
        allowEmpty: false,
        type: "float",
      },
      fieldLayout: { className: "col-12" },
    },
    {
      id: 2,
      component: "CheckBox",
      label: "Ladi*",
      name: "ladi",
      defaultValue: true,
      fieldLayout: { className: "col-12" },
    },
  ];
  const formPropsProveedores = {
    data: dataStructProveedores,
    schema: schemaProveedores,
    handle: saveProveedores,
    buttonsNames: ["Guardar"],
  };

  //Table component
  const filters1 = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    "proveedor.compaIa": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    importe: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }],
    },
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="action-table flex">
        <Button
          type="button"
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-danger"
          data-pr-tooltip="Eliminar"
          tooltip="Eliminar"
          tooltipOptions={{ position: "bottom" }}
          onClick={() =>
            confirmDialog({
              message: "¿Está seguro que desea eliminar el elemento?",
              header: "Confirmación",
              icon: "pi pi-exclamation-triangle",
              accept: () => {
                //Eliminar
                negociacion?.negociacionProveedores.splice(
                  negociacion?.negociacionProveedores.findIndex(
                    (elem) => elem.idProveedor === rowData.idProveedor
                  ),
                  1
                );
                setReRender(Math.floor(Math.random() * 1000000) + 1)
              },
            })
          }
        />
      </div>
    );
  };

  const booleanBody = (item) => {
    return item?.ladi ? (
      <i
        className="pi pi-check-circle"
        style={{ color: "#008000", fontSize: "1.3rem" }}
      ></i>
    ) : (
      <i
        className="pi pi-times-circle"
        style={{ color: "red", fontSize: "1.3rem" }}
      ></i>
    );
  };

  //editor
  const cellEditor = (options) => {
    if (options.field === "importe")
      return (
        <InputNumber
          value={options.value}
          onValueChange={(e) => options.editorCallback(e.value)}
          mode="currency"
          currency="USD"
          locale="en-US"
          step={1000}
          min={1}
          showButtons
          allowEmpty={false}
          type="float"
        />
      );
    else
      return (
        <InputSwitch
          checked={options.value}
          onChange={(e) => options.editorCallback(e.value)}
        />
      );
  };

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case "ladi": {
        const n = negociacion?.negociacionProveedores.find(
          (item) => item.idProveedor === rowData.idProveedor
        );
        n.ladi = newValue;
        break;
      }
      case "importe": {
        const n = negociacion?.negociacionProveedores.find(
          (item) => item.idProveedor === rowData.idProveedor
        );
        n.importe = newValue;
        break;
      }
      default:
        if (newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  };

  const TableComponent = () => {
    return (
      <DataTable
        value={negociacion?.negociacionProveedores}
        responsiveLayout="scroll"
        paginator={
          negociacion?.negociacionProveedores?.length <= 5 ? false : true
        }
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate={`{first} - {last} de {totalRecords}`}
        rows={5}
        rowsPerPageOptions={[5, 15, 30]}
        header={() => (
          <div className="flex flex-row justify-content-between">
            <div className="flex align-items-center text-lg">Proveedores</div>
            <Button
              type="button"
              className="mr-2"
              onClick={() => setProveedorDialog(true)}
            >
              Añadir
            </Button>
          </div>
        )}
        footer={`Filas: ${
          negociacion?.negociacionProveedores
            ? negociacion?.negociacionProveedores.length
            : 0
        }`}
        removableSort
        sortField="proveedor.compaIa"
        sortOrder={1}
        filters={filters1}
        filterDisplay="menu"
      >
        <Column
          field="proveedor.compaIa"
          header="Proveedor"
          sortable
          filter
          dataType="text"
        />
        <Column
          field="importe"
          header="Importe"
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
          sortable
          filter
          dataType="numeric"
        />
        <Column
          field="ladi"
          header="Ladi"
          sortable
          body={booleanBody}
          editor={(options) => cellEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column body={actionBodyTemplate} exportable={false} />
      </DataTable>
    );
  };

  //React-hook-form Negociacion
  const schema = yup.object().shape({
    fecha: yup.date().required("Fecha es requerido"),
    comite: yup.number().required("Cómite es requerido"),
    idGrupo: yup.number().required("Seleccione un grupo"),
    idMoneda: yup.number().required("Seleccione una moneda"),
    idTipoCompras: yup.number().required("Seleccione un tipo de compra"),
    mercancias: yup.string().required("Mercancía es requerido"),
    comentarios: yup.string().required("Comentarios es requerido"),
    operacion: yup.bool().required("Operación es requerido"),
    tasa: yup.number().required("Tasa es requerido"),
    terminado: yup.bool().required("Terminado es requerido"),
    cancelada: yup.bool().required("Cancelada es requerido"),
  });
  const dataStruct = [
    {
      id: 1,
      component: "Calendar",
      name: "fecha",
      label: "Fecha",
      defaultValue: moment(negociacion?.fecha, moment.ISO_8601).toDate(),
      fieldLayout: { className: "col-2" },
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "Cómite",
      name: "comite",
      defaultValue: negociacion?.comite,
      fieldLayout: { className: "col-2" },
      props: {
        className: "mr-8",
        step: 1,
        min: 0,
        showButtons: true,
        allowEmpty: false,
        type: "int",
        size: 2,
      },
    },
    {
      id: 2,
      component: "Dropdown",
      label: "Grupo",
      name: "idGrupo",
      defaultValue: negociacion?.grupos.idGrupo,
      fieldLayout: { className: "col-3" },
      props: {
        options: dataGrupo?.findAllGrupos,
        optionLabel: "grupos",
        optionValue: "idGrupo",
        placeholder: "Seleccione un grupo",
        filter: true,
      },
    },
    {
      id: 2,
      component: "Dropdown",
      label: "Tipo de compra",
      name: "idTipoCompras",
      defaultValue: negociacion?.tiposDeCompras.idTipoCompras,
      fieldLayout: { className: "col-3" },
      props: {
        options: dataTiposCompra?.findAllTiposDeCompras,
        optionLabel: "compras",
        optionValue: "idTipoCompras",
        placeholder: "Seleccione un tipo de compra",
        filter: true,
      },
    },
    {
      id: 1,
      component: "InputText",
      name: "noNegociacion",
      label: "No.",
      defaultValue: negociacion?.noNegociacion,
      fieldLayout: { className: "col-2" },
      props: {
        disabled: true,
        className: "disabled",
      }
    },
    {
      id: 2,
      component: "InputText",
      label: "Mercancias",
      name: "mercancias",
      defaultValue: negociacion?.mercancias,
      fieldLayout: { className: "col-12" },
    },
    {
      id: 2,
      component: "Dropdown",
      label: "Moneda*",
      name: "idMoneda",
      defaultValue: negociacion?.monedas.idMoneda,
      fieldLayout: { className: "col-4" },
      props: {
        options: dataMonedas?.findAllMoneda,
        optionLabel: "moneda",
        optionValue: "idMoneda",
        placeholder: "Seleccione una moneda",
        filter: true,
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Tasa",
      name: "tasa",
      defaultValue: negociacion?.tasa,
      fieldLayout: { className: "col-4" },
    },
    {
      id: 2,
      component: "Dropdown",
      label: "Operacion",
      name: "operacion",
      defaultValue: negociacion?.operacion,
      fieldLayout: { className: "col-4" },
      props: {
        options: [
          { label: "Multiplicar", value: true },
          { label: "Dividir", value: false },
        ],
      },
    },
    {
      id: 2,
      component: "InputTextArea",
      label: "Comentarios",
      name: "comentarios",
      defaultValue: negociacion?.comentarios,
      fieldLayout: { className: "col-12" },
    },
    {
      id: 2,
      component: "CheckBox",
      label: "Terminada",
      name: "terminado",
      defaultValue: negociacion?.terminado,
      fieldLayout: { className: "col-1" },
    },
    {
      id: 2,
      component: "CheckBox",
      label: "Cancelada",
      name: "cancelada",
      defaultValue: negociacion?.cancelada,
      fieldLayout: { className: "col-1" },
    },
    {
      id: 6,
      component: "Divider",
      name: "divider1",
      fieldLayout: { className: "col-12 grid-nogutter" },
    },
    {
      id: 6,
      component: "Custom",
      name: "customTable",
      defaultValue: <TableComponent/>,
      fieldLayout: { className: "col-12" },
    },
  ];

  const saveNegociacion = (data) => {
    let temp = {};
    temp = Object.assign(temp, data);
    temp.aprobada = negociacion?.aprobada;
    temp.consecutivo = negociacion?.consecutivo;
    temp.idNegociacion = negociacion?.idNegociacion;
    temp.negociacionProveedores = negociacion?.negociacionProveedores.map(
      (item) => {
        return _.omit(item, "proveedor");
      }
    );
    updateNegociacion({
      variables: { createNegociacionResumenInput: temp },
    }).then((resp) => navigate(-1));
  };

  // const formProps = {
  //   data: dataStruct,
  //   schema: schema,
  //   handle: saveNegociacion,
  //   buttonsNames: ["Guardar", "Cancelar"], //TODO Poner botones en todos los componentes en vez del texto
  // } ;

  useEffect(() => {
    if (negociacion)
      setFormProps({
        data: dataStruct,
        schema: schema,
        handle: saveNegociacion,
        buttonsNames: ["Guardar", "Cancelar"], //TODO Poner botones en todos los componentes en vez del texto
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [negociacion]);

  return (
    <div>
      {(loading || loadingM || loadingTC || loadingG) && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {!(loading && loadingM && loadingTC && error && loadingG) &&
      negociacion &&
      formProps ? (
        <div className=" p-card m-5 p-4">
          <Form
            ref={formRef}
            data={formProps?.data}
            schema={formProps?.schema}
            handle={saveNegociacion}
            cancel={() => navigate(-1)}
            buttonsNames={formProps?.buttonsNames}
            formLayout={{ className: "grid" }}
          />
          {/* <TableComponent/> */}
          <Dialog
            visible={proveedorDialog}
            style={{ width: "450px" }}
            header={"Insertar proveedor"}
            modal
            breakpoints={{ "992px": "50vw", "768px": "65vw", "572px": "80vw" }}
            resizable={false}
            onHide={() => {
              setProveedorDialog(false);
            }}
          >
            <Form
              data={formPropsProveedores?.data}
              schema={formPropsProveedores?.schema}
              handle={formPropsProveedores?.handle}
              buttonsNames={formPropsProveedores?.buttonsNames}
              formProps={{ className: "grid" }}
            />
          </Dialog>
        </div>
      ) : undefined}
    </div>
  );
};
