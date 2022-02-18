import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ScrollPanel } from "primereact/scrollpanel";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { ListBox } from "primereact/listbox";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import "./../BasesGenerales/BaseGeneral.css";

export const Field = ({ type, name, defaultValue, props, label }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  switch (type) {
    case "InputText":
      return (
        <div>
          <label
            htmlFor={name}
            className={classNames(
              { "p-error": errors.email },
              "block text-900 font-medium mb-2"
            )}
          >
            {label}
          </label>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
              <InputText
                id={field.name}
                {...field}
                {...props}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2", props.className
                )}
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "InputTextArea":
      return (
        <div>
          <label
            htmlFor={name}
            className={classNames(
              { "p-error": errors.email },
              "block text-900 font-medium mb-2"
            )}
          >
            {label}
          </label>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
              <InputTextarea
                {...props}
                id={field.name}
                {...field}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2",
                  props.className
                )}
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "ScrollPanel":
      <div>
        <label
          htmlFor={name}
          className={classNames(
            { "p-error": errors.email },
            "block text-900 font-medium mb-2"
          )}
        >
          {label}
        </label>
        <Controller
          name={name}
          defaultValue={defaultValue}
          control={control}
          render={({ field, fieldState }) => (
            <ScrollPanel
              {...props}
              id={field.name}
              {...field}
              className={classNames(
                { "p-invalid": fieldState.invalid },
                "w-full mb-2 h-4rem", props.className
              )}
            >
              {defaultValue}
            </ScrollPanel>
          )}
        />
        {getFormErrorMessage(name)}
      </div>;
    case "Divider":
      return <Divider />;
    case "CheckBox":
      return (
        <div>
          <label
            htmlFor={name}
            className={classNames(
              { "p-error": errors.email },
              "block text-900 font-medium mb-2"
            )}
          >
            {label}
          </label>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => (
              <Checkbox
                id={field.name}
                {...field}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2", props.className
                )}
                inputId="binary"
                checked={field.value}
                onChange={(e) => field.onChange(e.checked)}
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "Dropdown":
      return (
        <div>
          <label
            htmlFor={name}
            className={classNames(
              { "p-error": errors.email },
              "block text-900 font-medium mb-2"
            )}
          >
            {label}
          </label>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => {
              return (
                <Dropdown
                  {...props}
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    props.onChange && props.onChange(e.target.value);
                  }}
                  id={field.name}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full mb-2", props.className
                  )}
                />
              );
            }}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "MultiSelect":
      return (
        <div>
          <label
            htmlFor={name}
            className={classNames(
              { "p-error": errors.email },
              "block text-900 font-medium mb-2"
            )}
          >
            {label}
          </label>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => {
              console.log(field.value);
              return (
                <MultiSelect
                  {...props}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  id={field.name}
                  {...field}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full mb-2", props.className
                  )}
                />
              );
            }}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "Listbox":
      return (
        <div>
          <label
            htmlFor={name}
            className={classNames(
              { "p-error": errors.email },
              "block text-900 font-medium mb-2"
            )}
          >
            {label}
          </label>
          <Controller
            name={name}
            defaultValue={defaultValue}
            control={control}
            render={({ field, fieldState }) => {
              console.log(field.value);
              return (
                <ListBox
                  {...props}
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  id={field.name}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full mb-2", props.className
                  )}
                />
              );
            }}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "label":
      return (
        <label
          {...props}
          htmlFor={name}
          className={classNames(
            { "p-error": errors.email },
            "block text-900 font-medium mb-2"
          )}
        >
          {defaultValue}
        </label>
      );
    case "Text":
      return (
        <div>
          <label
            htmlFor={name}
            className={classNames(
              { "p-error": errors.email },
              "block text-900 font-medium mb-2"
            )}
          >
            {label}
          </label>
          <div {...props}>{defaultValue}</div>
        </div>
      );
    case "EmptyCol":
      return <div />;
    default:
      console.log("Default");
      break;
  }
};
