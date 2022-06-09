import { useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useRef } from "react";
import { useParams } from "react-router";
import {
  selectOneBasesGenerales, selectOneProforma,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";

export const Proforma = () => {
  const p = useParams();
  const formRef = useRef();
  const { data, error, loading } = useQuery(selectOneProforma, {
    variables: { id: parseInt(p.Proforma) },
    fetchPolicy: "network-only",
  });

  const schema = yup.object().shape({
  });
  const dataStruct = [
    {
      id: 1,
      component: "InputText",
      name: "nombreProfoma",
      defaultValue: data?.findOneProforma.nombreProfoma,
      label: "Nombre:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 1,
      component: "InputText",
      name: "tipoContrato",
      defaultValue: data?.findOneProforma.tipoDeContrato.tipoContrato,
      label: "Tipo de contrato:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 9,
      component: "InputText",
      name: "condCompra",
      defaultValue: data?.findOneProforma.incoterm.nombre,
      label: "Condición de Compra:",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 9,
      component: "CheckBox",
      name: "activa",
      defaultValue: data?.findOneProforma.activa,
      label: "Activa",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 9,
      component: "CheckBox",
      name: "cMarcoF",
      defaultValue: data?.findOneProforma.cMarcoF,
      label: "Marco financiero",
      props: { disabled: true, className: "disabled" },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 12,
      component: "EmptyCol",
      fieldLayout: { className: "col-4" },
    },
    {
      id: 6,
      component: "Divider",
      name: "divider1",
      fieldLayout: { className: "col-12 grid-nogutter" },
    },
    {
      id: 13,
      component: "Dropdown",
      name: "tipoClausula",
      defaultValue:
        data?.findOneProforma.proformaClausulas.length > 0 &&
        data?.findOneProforma.proformaClausulas[0].idTipoClausula,
      label: "Tipo de Claúsula:",
      props: {
        options: data?.findOneProforma.proformaClausulas,
        filter: true,
        optionLabel: "tiposDeClausulas.nombre",
        optionValue: "idTipoClausula",
        onChange: (value) => {
          formRef?.current.setValues(
            "clausula",
            data?.findOneProforma.proformaClausulas.find(
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
        data?.findOneProforma.proformaClausulas.length > 0
          ? data?.findOneProforma.proformaClausulas[0].clausula
          : "",
      label: "Claúsula:",
      props: { rows: 15, disabled: true, className: "disabled textArea" },
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
