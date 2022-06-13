import { Button } from "primereact/button";
import { Password } from "primereact/password";
import "primeflex/primeflex.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { changePasswordUsuario } from "../../database/GraphQLStatements";
import { useMutation } from "@apollo/client";
import { useStateValue } from "../../StateProvider";
import { fireError } from "../utils";

export const ChangePassword = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

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
      navigate("/");
    } catch (error) {
      fireError(error);
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
                className="w-full mb-3"
                inputClassName={classNames(
                  { "p-invalid": fieldState.invalid },
                  "w-full"
                )}
                toggleMask
                feedback={false}
              />
            )}
          />
          {getFormErrorMessage("newPasswordConfirm")}
          <div className="mt-3">
            <Button
              className="w-full mt-3"
              type="submit"
              label="Aceptar"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
