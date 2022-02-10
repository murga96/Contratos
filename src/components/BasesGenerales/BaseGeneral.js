import { useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";
import { useParams } from "react-router";
import { selectOneBasesGenerales } from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";

export const BaseGeneral = ({ idBG }) => {
  const bg = useParams();
  const { data, error, loading } = useQuery(selectOneBasesGenerales, {
    variables: { idBasesG: parseInt(bg.BaseGeneral) },
  });

  const schema = yup.object().shape({
    tipoContrato: yup.string().required("Tipo de contrato es requerido"),
    encabezado: yup.string().required("Encabezado es requerido"),
    ambasPartes: yup.string().required("Ambas partes es requerido"),
    visible: yup.boolean(),
  });

  const dataStruct = [
    {
      id: 1,
      component: "InputText",
      name: "tipoContrato",
      defaultValue: "",
      label: "Tipo de contrato*",
      fieldLayout: { class: "field col-12 md:col-6" },
    },
    {
      id: 2,
      component: "InputText",
      name: "encabezado",
      defaultValue: "",
      label: "Encabezado*",
      fieldLayout: { class: "field col-12 md:col-6" },
    },
    // {
    //   id: 5,
    //   component: "label",
    //   name: "ambasPartes",
    //   defaultValue: "Ambas partes*",
    // },
    // {
    //   id: 6,
    //   component: "InputText",
    //   name: "ambasPartes",
    //   defaultValue: "",
    // },
    // {
    //   id: 7,
    //   component: "label",
    //   name: "visible",
    //   defaultValue: "Visible*",
    // },
    // {
    //   id: 8,
    //   component: "CheckBox",
    //   name: "visible",
    //   defaultValue: "",
    // },
  ];

  const formProps = {
    data: dataStruct,
    schema: schema /* , "handle": updateTC */,
    variables: { tipoContrato: {} },
    buttonsNames: ["Guardar", "Cancelar"],
  };
  return (
    <div>
      {loading && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {!(loading || error) ? (
         <div>
           <Form
               data={formProps?.data}
               schema={formProps?.schema}
               // handle={saveElement}
               // cancel={hideEditDialog}
               buttonsNames={formProps?.buttonsNames}
               formLayout={{class: "formgrid grid"}}
             />
           {/* <div class="field col">
             <label for="firstname2">Firstname</label>
           </div>
           <div class="field col">
             <input id="firstname2" type="text" class="inputfield w-full" />
           </div>
           <div class="field col">
             <label for="lastname2">Lastname</label>
           </div>
           <div class="field col">
             <input id="lastname2" type="text" class="inputfield w-full" />
           </div> */}
         </div>
      ) : undefined}
    </div>
  );
};
