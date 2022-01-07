import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

export const Field = ({ type, name, defaultValue,props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [selectedCity1, setSelectedCity1] = useState("New York")
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };
  const cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
    ];
    const onCityChange = (e) => {
      setSelectedCity1(e.value);
  }
  console.log(props, name)
  switch (type) {
    case "InputText":
      return (
        <div>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
              <InputText
                id={field.name}
                {...field}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2"
                )}
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "CheckBox":
      return (
        <div>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState}) => (
              <Checkbox
                id={field.name}
                {...field}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2"
                )}
                inputId="binary" checked={field.value} onChange={e => field.onChange(e.checked)}
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    
    case "Dropdown":
      return (
        <div>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState}) => (
              <Dropdown
                id={field.name}
                {...field}
                {...props}
                value={field.value} onChange={e => field.onChange(e.target.value)}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2"
                )}
              />
            )}
          />
         {/*  <Dropdown
                {...props} value={selectedCity1} onChange={onCityChange}
             />   
             {console.log(<Dropdown
                {...props} value={selectedCity1} onChange={onCityChange}
             />  )} */}
          {getFormErrorMessage(name)}
        </div>
      );
    case "label":
      return (
        <label
          htmlFor={name}
          className={classNames(
            { "p-error": errors.email },
            "block text-900 font-medium mb-2"
          )}
        >
          {defaultValue}
        </label>
      );
    default:
      console.log("Default");
      break;
  }
};
