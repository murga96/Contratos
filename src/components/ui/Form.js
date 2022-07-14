import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import React, { forwardRef, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Field } from "./Field";

export const Form = forwardRef(
  (
    {
      data,
      schema,
      handle,
      cancel,
      buttonsNames,
      formLayout,
      multipleForms = null,
    },
    ref
  ) => {
    let methods = useForm({
      resolver: yupResolver(schema),
    });
    useImperativeHandle(ref, () => ({
      getValue: (name) => {
        return methods.getValues(name);
      },
      setValues: (name, value) => {
        methods.setValue(name, value);
      },
      triggerValidation: (value) => {
        if(value) {
          return methods.trigger(value)
        }else {
         return methods.trigger()
        }
      },
      handleSubmit: (dataFunction, errorFunction) => {
        if(dataFunction && errorFunction) {
          return methods.handleSubmit(dataFunction, errorFunction)()
        }
      },
    }));

    if (multipleForms) {
      methods = multipleForms;
    }
    const ButtonsComponent = () => {
      if (buttonsNames.length > 0) {
        if (typeof buttonsNames[0] === "string") {
          return (
            <div className="flex justify-content-end mt-3">
              {buttonsNames[0] && (
                <Button
                  label={buttonsNames[0]}
                  icon="pi pi-check"
                  className="mr-4"
                  type="submit"
                />
              )}
              {buttonsNames[1] && (
                <Button
                  label={buttonsNames[1]}
                  type="button"
                  icon="pi pi-times"
                  // className="p-button-text"
                  onClick={() => cancel()}
                />
              )}
            </div>
          );
        }
      } else if( typeof buttonsNames === "object") {
        return buttonsNames       
     }
    };

    // console.log(methods.formState.errors, "errors")
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handle)}>
          <div {...formLayout}>
            {data.map((item, i) => {
              return (
                <div {...item.fieldLayout}>
                  <Field
                    key={i}
                    type={item.component}
                    name={item.name}
                    defaultValue={item.defaultValue}
                    props={item.props}
                    label={item.label}
                  />
                </div>
              );
            })}
          </div>
          {ButtonsComponent()}
        </form>
      </FormProvider>
    );
  }
);
