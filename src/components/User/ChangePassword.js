import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useRef, useState } from "react";
import "primeflex/primeflex.css";
import logo from "../../assets/images/contrato.png";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { useHistory } from "react-router-dom";
import { Toast } from "primereact/toast";
import { changePasswordUsuario } from "../../database/GraphQLStatements";
import { useMutation } from "@apollo/client";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";

export const ChangePassword = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useHistory();

  const [changePassword] = useMutation(changePasswordUsuario);
  //React-hook-form
  const schema = yup.object().shape({
    password: yup.string().required("Contraseña es requerida"),
    newPassword: yup
      .string()
      .required("Nueva contraseña es requerida")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Contraseña nueva debe tener al menos 8 carácteres, mayúsculas y minúsculas y carácteres especiales"
      ),
    newPasswordConfirm: yup
      .string()
      .required("Confirmar nueva contraseña es requerido")
      .oneOf([yup.ref("newPassword"), null], "Las contraseñas deben coincidir"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handle = ({ password, newPassword, newPasswordConfirm }) => {
    try {
      changePassword({
        variables: {
          idUsuario: user.idUsuario,
          contrasenaVieja: password,
          contrasenaNueva: newPassword,
          contrasenaNuevaConfirmar: newPasswordConfirm,
        },
      });
      navigate.push("/");
    } catch (error) {
      alert(error);
    }
    reset();
  };
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };
  return (
    <div className="flex justify-content-center align-items-center h-screen">
      <div className="py-6 px-6 xl:px-6 lg:px-4 md:px-4 sm:px-2 shadow-2 border-round xl:w-30rem lg:w-30rem md:w-30rem sm:w-30rem">
        <form onSubmit={handleSubmit(handle)} className="p-fluid">
          <label
            htmlFor="password"
            className={classNames(
              { "p-error": errors.password },
              "block text-900 font-medium mb-2"
            )}
          >
            Contraseña vieja*
          </label>
          <Controller
            name="password"
            defaultValue=""
            control={control}
            render={({ field, fieldState }) => (
              <Password
                id={field.name}
                {...field}
                inputClassName={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full"
                )}
                className="w-full"
                toggleMask
                feedback={false}
              />
            )}
          />
          {getFormErrorMessage("password")}
          <label
            htmlFor="newPassword"
            className={classNames(
              { "p-error": errors.newPassword },
              "block text-900 font-medium my-2"
            )}
          >
            Contraseña nueva*
          </label>
          <Controller
            name="newPassword"
            defaultValue=""
            control={control}
            render={({ field, fieldState }) => (
              <Password
                id={field.name}
                {...field}
                inputClassName={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full"
                )}
                className="w-full"
                toggleMask
                feedback={false}
              />
            )}
          />
          {getFormErrorMessage("newPassword")}
          <label
            htmlFor="newPasswordConfirm"
            className={classNames(
              { "p-error": errors.newPasswordConfirm },
              "block text-900 font-medium my-2"
            )}
          >
            Confirmar contraseña nueva*
          </label>
          <Controller
            name="newPasswordConfirm"
            defaultValue=""
            control={control}
            render={({ field, fieldState }) => (
              <Password
                id={field.name}
                {...field}
                className="mb-3"
                inputClassName={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full"
                )}
                className="w-full"
                toggleMask
                feedback={false}
              />
            )}
          />
          {getFormErrorMessage("newPasswordConfirm")}
          <div className="mt-3">
            <Button
              className="mt-3"
              type="submit"
              label="Aceptar"
              className="w-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
