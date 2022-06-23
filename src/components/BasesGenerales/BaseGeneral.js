import { useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useRef } from "react";
import { useParams } from "react-router";
import {
  selectOneBasesGenerales,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";

export const BaseGeneral = ({ idBG }) => {
  const bg = useParams();
  const formRef = useRef();
  const { data, error, loading } = useQuery(selectOneBasesGenerales, {
    variables: { idBasesG: parseInt(bg.BaseGeneral) },
    fetchPolicy: "network-only",
  });

  const schema = yup.object().shape({
  });
  const dataStruct = [
    {
      id: 1,
      component: "InputText",
      name: "tipoContrato",
      defaultValue: data?.findOneBasesGenerales.tipoDeContrato.tipoContrato,
      label: "Tipo de contrato:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-3" },
    },
    {
      id: 2,
      component: "InputText",
      name: "fecha",
      defaultValue: moment(
        data?.findOneBasesGenerales.fecha,
        moment.ISO_8601
      ).format("DD/MM/YYYY"),
      label: "Fecha:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-1" },
    },
    {
      id: 3,
      component: "InputText",
      name: "noContrato",
      defaultValue: data?.findOneBasesGenerales.noContrato,
      label: "No:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 5,
      component: "InputText",
      name: "firma",
      defaultValue: data?.findOneBasesGenerales.lugardeFirma,
      label: "Firma:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 4,
      component: "InputText",
      name: "pais",
      defaultValue: data?.findOneBasesGenerales.pais.nomb,
      label: "País:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 6,
      component: "Divider",
      name: "divider1",
      fieldLayout: { className: "col-12 grid-nogutter" },
    },
    {
      id: 7,
      component: "InputText",
      name: "vendedor",
      defaultValue: data?.findOneBasesGenerales.proveedor.compaIa,
      label: "Vendedor:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 8,
      component: "InputText",
      name: "comprador",
      defaultValue: data?.findOneBasesGenerales.compradores.nombre,
      label: "Comprador:",
      props: {
        disabled: true,
        className: "disabled",
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 9,
      component: "InputText",
      name: "condCompra",
      defaultValue: data?.findOneBasesGenerales.incoterm.nombre,
      label: "Condición de Compra:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 10,
      component: "Listbox",
      name: "representanteVendedor",
      defaultValue: -1,
      label: "Representante:",
      props: {
        options: data?.findOneBasesGenerales.proveedor
          ? [
              {
                label: data?.findOneBasesGenerales.proveedor.representante,
                value: 0,
              },
              {
                label: data?.findOneBasesGenerales.proveedor.cargo,
                value: 1,
              },
              {
                label: data?.findOneBasesGenerales.proveedor.domicilio,
                value: 2,
              },
            ]
          : [
              { label: "", value: 0 },
              { label: "", value: 1 },
              { label: "", value: 2 },
            ],
        disabled: true,
        className: "disabled",
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 11,
      component: "Listbox",
      name: "representanteComprador",
      defaultValue: -1,
      label: "Representante:",
      props: {
        options: data?.findOneBasesGenerales.compradores
          ? [
              {
                label: data?.findOneBasesGenerales.compradores.representante,
                value: 0,
              },
              {
                label: data?.findOneBasesGenerales.compradores.cargo,
                value: 1,
              },
              {
                label: data?.findOneBasesGenerales.compradores.domicilio,
                value: 2,
              },
            ]
          : [
              { label: "", value: 0 },
              { label: "", value: 1 },
            ],
        disabled: true,
        className: "disabled",
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 12,
      component: "EmptyCol",
      fieldLayout: { className: "col-4" },
    },
    {
      id: 13,
      component: "Dropdown",
      name: "tipoClausula",
      defaultValue:
        data?.findOneBasesGenerales.basesGeneralesClausulas.length > 0 &&
        data?.findOneBasesGenerales.basesGeneralesClausulas[0].idTipoClausula,
      label: "Tipo de Claúsula:",
      props: {
        options: data?.findOneBasesGenerales.basesGeneralesClausulas,
        filter: true,
        optionLabel: "tiposDeClausulas.nombre",
        optionValue: "idTipoClausula",
        onChange: (value) => {
          formRef?.current.setValues(
            "clausula",
            data?.findOneBasesGenerales.basesGeneralesClausulas.find(
              (item) => item.idTipoClausula === value
            ).clausula
          );
        },
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 11,
      component: "InputTextArea",
      name: "clausula",
      defaultValue:
        data?.findOneBasesGenerales.basesGeneralesClausulas.length > 0
          ? data?.findOneBasesGenerales.basesGeneralesClausulas[0].clausula
          : "",
      label: "Claúsula:",
      props: { rows: 9, disabled: true, className: "disabled textArea" },
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
        <div className="m-5">
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
