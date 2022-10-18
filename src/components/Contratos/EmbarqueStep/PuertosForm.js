import { Dropdown } from "primereact/dropdown";
import React from "react";
import { selectAllPuertos } from "../../../database/GraphQLStatements";
import { Loading } from "../../LoadingComponent";
import { DialogComponent } from "../../ui/dialog";
import { Field } from "../../ui/form/Field";
import * as yup from "yup";
import { useQuery } from "@apollo/client";
import { Form } from "../../ui/form/Form";

export const PuertosForm = ({
  addPuertos,
  setVisiblePuertosForm,
  visiblesPuertosForm,
}) => {
  //graphql
  const { data: dataP, loading: loadingP } = useQuery(selectAllPuertos);

  const schema = yup.object().shape({
    idPuertoOrigen: yup
      .object()
      .typeError("Debe seleccionar un puerto de origen")
      .notOneOf(
        [yup.ref("idPuertoDestino"), null],
        "Los puertos no pueden coincidir"
      ),
    idPuertoDestino: yup
      .object()
      .typeError("Debe seleccionar un puerto de destino")
      .notOneOf(
        [yup.ref("idPuertoOrigen"), null],
        "Los puertos no pueden coincidir"
      ),
  });

  const initValues = {
    idPuertoOrigen: null,
    idPuertoDestino: null,
  };

  if (loadingP) return <Loading />;
  return (
    <div>
      <DialogComponent
        title="Adicionar puerto"
        hide={() => {
          setVisiblePuertosForm(false);
        }}
        visible={visiblesPuertosForm}
      >
        <Form
          schema={schema}
          handle={addPuertos}
          containerClassName="grid"
          defaultValues={initValues}
        >
          <Field
            label="Puerto Origen*:"
            name="idPuertoOrigen"
            containerClassName="col-12"
            render={(field) => {
              return (
                <Dropdown
                  {...field}
                  options={dataP?.findAllPuertos}
                  optionLabel="nombre"
                  filter
                  placeholder="Seleccione el puerto origen"
                />
              );
            }}
          />
          <Field
            label="Puerto Destino*:"
            name="idPuertoDestino"
            containerClassName="col-12"
            render={(field) => {
              return (
                <Dropdown
                  {...field}
                  options={dataP?.findAllPuertos}
                  optionLabel="nombre"
                  filter
                  placeholder="Seleccione el puerto destino "
                />
              );
            }}
          />
        </Form>
      </DialogComponent>
    </div>
  );
};
