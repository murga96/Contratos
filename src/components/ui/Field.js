import React from 'react'
import {Controller, useFormContext} from 'react-hook-form'
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"


export const Field = ({type, name, defaultValue}) => {
    const {control, formState: {errors}} = useFormContext()
    const getFormErrorMessage = (name) => {
        return (
          errors[name] && <small className="p-error">{errors[name].message}</small>
        );
      };
    
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
            )
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
            ) 
        default:
            console.log("Default")
            break;
    }
}
