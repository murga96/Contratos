import { useQuery } from "@apollo/client";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import React from "react";
import {
  selectAllApartirDe,
  selectFormasPago,
} from "../../../database/GraphQLStatements";
import { Loading } from "../../LoadingComponent";
import { Field } from "../../ui/form/Field";
import { Form } from "../../ui/form/Form";
import * as yup from "yup";
import { DialogComponent } from "../../ui/dialog";
import { Column } from "primereact/column";

export const PagosForm = ({
  addPayment,
  visiblesPagosForm,
  setVisiblePagosForm,
}) => {
  //graphql
  const { data: dataFP, loading: loadingFP } = useQuery(selectFormasPago);
  const { data: dataA, loading: loadingA } = useQuery(selectAllApartirDe);

  const schema = yup.object().shape({
    idFormaPago: yup.object().typeError("Debe seleccionar una forma de pago"),
    plazoPago: yup.number().min(1, "Plazo no puede ser cero días"),
    idPagosApartirDe: yup.object().typeError("Debe seleccionar a partir de donde es el pago"),
    porciento: yup.number().min(1, "Porciento no puede ser cero"),
  });

  const initValues = {
    idFormaPago: null,
    plazoPago: 0,
    idPagosApartirDe: null,
    porciento: 0,
  };

  if (loadingFP || loadingA) return <Loading />;
  return (
    <div>
      <DialogComponent
        title="Adicionar pago"
        hide={() => {
          setVisiblePagosForm(false);
        }}
        visible={visiblesPagosForm}
      >
        <Form
          schema={schema}
          handle={addPayment}
          containerClassName="grid"
          defaultValues={initValues}
        >
          <Field
            label="Formas de pago:"
            name="idFormaPago"
            containerClassName="col-12"
            render={(field) => {
              return (
                <Dropdown
                  {...field}
                  options={dataFP?.findAllFormasPago}
                  optionLabel="formaPago"
                //   optionValue="idFormaPago"
                  filter
                  placeholder="Seleccione una Forma de Pago"
                />
              );
            }}
          />
          <Field
            label="Plazo:"
            name="plazoPago"
            containerClassName="col-12 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
                  step={1}
                  size={1}
                  min={0}
                  suffix= " días"
                  showButtons
                  allowEmpty={false}
                  type="int"
                />
              );
            }}
          />
          <Field
            label="A partir de:"
            name="idPagosApartirDe"
            containerClassName="col-12"
            render={(field) => {
              return (
                <Dropdown
                  {...field}
                  options={dataA?.findAllPagosAPartirDe}
                  optionLabel="aPartirDe"
                //   optionValue="idPartir"
                  filter
                  placeholder="Seleccione a partir de donde empieza el pago "
                />
              );
            }}
          />
          <Field
            label="Porciento:"
            name="porciento"
            containerClassName="col-12 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
                  step={10}
                  size={1}
                  min={0}
                  showButtons
                  suffix="%"
                  allowEmpty={false}
                  type="float"
                />
              );
            }}
          />
        </Form>
      </DialogComponent>
    </div>
  );
};
