import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { ListBox } from "primereact/listbox";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import "./Field.css";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export const Field = ({ type, name, defaultValue, props, label }) => {
  const {
    control,
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
                  "w-full mb-2",
                  props?.className
                )}
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "InputNumber":
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
              <InputNumber
                id={field.name}
                // {...field}
                {...props}
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                  props.onChange && props.onChange(e);
                }}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2",
                  props?.className
                )}
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "Password":
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
              <Password
                id={field.name}
                {...field}
                {...props}
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                  props.onChange && props.onChange(e);
                }}
                inputClassName={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full"
                )}
                className="w-full"
                toggleMask
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
                // value={defaultValue}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  props?.onChange && props.onChange(e.target.value);
                }}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2",
                  props?.className
                )}
                
              />
            )}
          />
          {getFormErrorMessage(name)}
        </div>
      );
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
                {...props}
                {...field}
                className={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full mb-2",
                  props?.className
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
    case "Button":
      return (
        <Button
          type="button"
          {...props}
          className={classNames(
            " mb-2",
            props?.className
          )}
        />
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
                    "w-full mb-2",
                    props?.className
                  )}
                />
              );
            }}
          />
          {getFormErrorMessage(name)}
        </div>
      );
    case "Calendar":
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
                <Calendar
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
                    "w-full mb-2",
                    props?.className
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
              return (
                <MultiSelect
                  {...props}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  id={field.name}
                  {...field}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full mb-2",
                    props?.className
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
              return (
                <ListBox
                  {...props}
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  id={field.name}
                  className={classNames(
                    { "p-invalid": fieldState.invalid },
                    "w-full mb-2",
                    props?.className
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
