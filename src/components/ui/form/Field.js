import React from "react";
import { classNames } from "primereact/utils";
import { Controller, useFormContext } from "react-hook-form";

/**
 * Declara un campo de un formulario de react-hook-form que puede ser nativo o
 *  de biblioteca de UI de terceros. Los campos puden ser componentes controlados o no controlados.
 * Acepta en la función de renderizado una variable watch para renderizar condicionalmente el campo.
 *
 */
export const Field = ({
  label,
  defaultValue = null,
  name,
  render,
  isControlled = true,
  containerClassName = {},
}) => {
  //reading form values from the form context
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  //Error message element
  const getFieldErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  //Render field function
  const renderFieldByType = () => {
    if (isControlled)
      return (
        <Controller
          name={name}
          defaultValue={defaultValue}
          control={control}
          render={({ field, fieldState }) => render({...field, ...{className: `w-full mb-2 ${fieldState.invalid ? 'p-invalid' : ""}` }}, watch)}
        />
      );
    else return render(register, watch);
  };

  console.log(`Field ${name} render`);

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={name}
          className={classNames(
            { "p-error": errors[name] },
            "block text-900 font-medium mb-2"
          )}
        >
          {label}
        </label>
      )}
      {renderFieldByType()}
      {getFieldErrorMessage(name)}
    </div>
  );
};
