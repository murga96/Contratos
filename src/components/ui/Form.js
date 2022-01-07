import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Field } from "./Field";


export const Form = ({ data, schema, handle, cancel, buttonsNames }) => {
  const methods= useForm({
    resolver: yupResolver(schema),
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handle)}>
        {data.map((item) => {
          return (
            <Field
              key={item.id}
              type={item.component}
              name={item.name}
              defaultValue={item.defaultValue}
              props={item.props}
            />
          );
        })}
        <div className="flex justify-content-end mt-3">
          <Button
            label={buttonsNames[0]}
            icon="pi pi-check"
            className="p-button-text"
            type="submit"
          />
          <Button
            label={buttonsNames[1]}
            type="button"
            icon="pi pi-times"
            className="p-button-text"
            onClick={() => cancel()}
          />
        </div>
      </form>
    </FormProvider>
  );
};
