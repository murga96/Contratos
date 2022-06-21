import { useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useRef } from "react";
import { useParams } from "react-router";
import {
  selectAllMonedas,
  selectAllTiposDeCompras,
  selectOneBasesGenerales,
  selectOneNegociacionesResumen,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";

export const Negociacion = () => {
  const bg = useParams();
  const formRef = useRef();
  const { data, error, loading } = useQuery(selectOneNegociacionesResumen, {
    variables: { idBasesG: parseInt(bg.Negociacion) },
    fetchPolicy: "network-only",
  });
  console.log(data, "data");

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    fecha: yup.date().required("Fecha es requerido"),
    comite: yup.number().required("Cómite es requerido"),
    consecutivo: yup.number().required("Consecutivo es requerido"),
    idGrupo: yup.string().required("Seleccione un grupo"),
    idMoneda: yup.string().required("Seleccione una moneda"),
    idTipoCompras: yup.string().required("Seleccione un tipo de compra"),
    mercancias: yup.string().required("Mercancía es requerido"),
    importeTrd: yup.string().required("Importe Trd requerido"),
    importeGae: yup.string().required("Importe Gae es requerido"),
    importeCuc: yup.string().required("Importe Cuc es requerido"),
    comentarios: yup.string().required("Comentarios es requerido"),
    operacion: yup.string().required("Operación es requerido"),
    tasa: yup.string().required("Tasa es requerido"),
    terminada: yup.string().required("Terminada es requerido"),
    cancelada: yup.string().required("Cancelada es requerido"),
  });

  const dataStruct = [
    {
      id: 1,
      component: "InputText",
      name: "fecha",
      label: "Fecha",
      defaultValue: moment(data?.findOneNegociacionResumen.fecha).format(
        "DD/MM/YYYY"
      ),
      fieldLayout: { className: "col-2" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 1,
      component: "InputText",
      name: "noNegociacion",
      label: "No.",
      defaultValue: data?.findOneNegociacionResumen.noNegociacion,
      fieldLayout: { className: "col-2" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Cómite",
      name: "comite",
      defaultValue: data?.findOneNegociacionResumen.comite,
      fieldLayout: { className: "col-1" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Consecutivo",
      name: "consecutivo",
      defaultValue: data?.findOneNegociacionResumen.consecutivo,
      fieldLayout: { className: "col-1" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Grupo",
      name: "idGrupo",
      defaultValue: data?.findOneNegociacionResumen.grupos.grupos,
      fieldLayout: { className: "col-3" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Tipo de compra",
      name: "idTipoCompra",
      defaultValue: data?.findOneNegociacionResumen.tiposDeCompras.compras,
      fieldLayout: { className: "col-3" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Mercancias",
      name: "Mercancias",
      defaultValue: data?.findOneNegociacionResumen.mercancias,
      fieldLayout: { className: "col-12" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Importe Trd",
      name: "importeTrd",
      defaultValue: "$" + data?.findOneNegociacionResumen.importeTrd,
      fieldLayout: { className: "col-4" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Importe Gae",
      name: "importegae",
      defaultValue: "$" + data?.findOneNegociacionResumen.importeGae,
      fieldLayout: { className: "col-4" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Importe Cuc",
      name: "importeCuc",
      defaultValue: "$" + data?.findOneNegociacionResumen.importeCuc,
      fieldLayout: { className: "col-4" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Moneda*",
      name: "idMoneda",
      defaultValue: data?.findOneNegociacionResumen.monedas.moneda,
      fieldLayout: { className: "col-4" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Tasa",
      name: "tasa",
      defaultValue: data?.findOneNegociacionResumen.tasa,
      fieldLayout: { className: "col-4" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputText",
      label: "Operacion",
      name: "operacion",
      defaultValue: data?.findOneNegociacionResumen.operacion
        ? "Multiplicando"
        : "Dividir",
      fieldLayout: { className: "col-4" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "InputTextArea",
      label: "Comentarios",
      name: "comentarios",
      defaultValue: data?.findOneNegociacionResumen.comentarios,
      fieldLayout: { className: "col-12" },
      props: {
        disabled: true,
        className: "disabled textArea",
      },
    },
    {
      id: 2,
      component: "CheckBox",
      label: "Terminada",
      name: "terminada",
      defaultValue: data?.findOneNegociacionResumen.terminado,
      fieldLayout: { className: "col-1" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 2,
      component: "CheckBox",
      label: "Cancelada",
      name: "cancelada",
      defaultValue: data?.findOneNegociacionResumen.cancelada,
      fieldLayout: { className: "col-1" },
      props: {
        disabled: true,
        className: "disabled",
      },
    },
    {
      id: 6,
      component: "Divider",
      name: "divider1",
      fieldLayout: { className: "col-12 grid-nogutter" },
    },
    // {
    //   id: 10,
    //   component: "Listbox",
    //   name: "representanteVendedor",
    //   defaultValue: -1,
    //   label: "Proveedores:",
    //   props: {
    //     options: data?.findOneNegociacionResumen.negociacionProveedores,
    //     optionLabel: "proveedor.",
    //     disabled: true,
    //     className: "disabled",
    //     itemTemplate: (option) => {
    //       return (
    //         <div className="flex flex-row">
    //           <div className="">{option.idProveedor}</div>
    //           <div>{option.importe}</div>
    //         </div>
    //       )
    //     } 
    //   },
    // },
    {
      id: 10,
      component: "DataTable",
      name: "representanteVendedor",
      defaultValue: -1,
      label: "Proveedores:",
      props: {
        value: data?.findOneNegociacionResumen.negociacionProveedores,
        responsiveLayout: "scroll",
        columns: [ ["proveedor.compaIa", "Proveedor"], ["importe", "Importe"] ]
      },
      fieldLayout: { className: "col-12" },
    },
  ];

  const formProps = {
    data: dataStruct,
    schema: schema /* , "handle": updateTC */,
    variables: { tipoContrato: {} },
    buttonsNames: [],
  };
  return (
    <div>
      {loading && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {!(loading || error) ? (
        <div className=" p-card m-5 p-4">
          <Form
            ref={formRef}
            data={formProps?.data}
            schema={formProps?.schema}
            buttonsNames={formProps?.buttonsNames}
            formLayout={{ className: "grid" }}
          />
        </div>
      ) : undefined}
    </div>
  );
};
