import { InputText } from "primereact/inputtext";
import React, { forwardRef } from "react";
import * as yup from "yup";
import { Field } from "../../ui/form/Field";
import { Form } from "../../ui/form/Form";

export const Embarque = forwardRef(({ embarque, setEmbarques }, ref) => {
  const schema = yup.object().shape({
    test: yup.string().required("Test es requerido").typeError("Test es requerido"),
  });
  console.log("Embarque render", embarque)
//   return (
//     <div>{embarque.test}</div>
//   )
  return (
    <div >
    {/* <div>{embarque.test}</div> */}
    <Form
      ref={ref}
      schema={schema}
      handle={(data) => {
        setEmbarques(current => current.map((emb) => {
            if(emb.numero === embarque.numero){
                let v = {...emb, ...data}
                return  v}
            return emb
        }));
      }}
      containerClassName="grid"
    >
      <Field
        name="test"
        label="Test"
        containerClassName="col-12"
        defaultValue={embarque.test}
        render={(field) => <InputText {...field} />}
      />
    </Form>
    </div>
  );
});
