import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "primereact/button";
import React, { forwardRef, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";

const DefaultFooter = ({isGrid}) => {
  return (
    <div className={`flex justify-content-end mt-3 ${isGrid ? "col-12" : "" }`}>
      <Button
        label="Aceptar"
        icon="pi pi-check"
        className="p-button-text p-text-primary"
        type="submit"
      />
    </div>
  );
};

/**
 * Un formulario personalizado de react-hook-form con schema de validación usando yup,
 *  permite campos de componentes controlados y no contralados.
 *
 */
export const Form = forwardRef(({ schema, handle, footer, children, containerClassName={} }, ref) => {
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  console.log("Form render");
  useImperativeHandle(ref, () => ({
    setValue: (name, value) => {
      methods.setValue(name, value);
    },
    getValue: (name) => {
      return methods.getValues(name);
    },
    resetForm: () => {
      methods.reset();
    },
    resetField: (name) => {
      methods.resetField(name);
    },
    setFocus: (name, options) => {
      methods.setFocus(name, options);
    },
    trigger: () => {
      methods.trigger();
    },
    clearErrors: (name) => {
      if(name) {
        methods.clearErrors(name);
      }else {
        methods.clearErrors();
      }
    },
  }));
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handle)}>
      <div className={containerClassName}>
        {children}
        {footer ? footer : <DefaultFooter isGrid={containerClassName ==="grid"} />}

      </div>
      </form>
    </FormProvider>
  );
});
