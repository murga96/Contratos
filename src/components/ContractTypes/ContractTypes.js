import React, { useEffect } from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import { classNames } from "primereact/utils";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";
import { removeTipoContrato, selectAllTipoContrato, updateTipoContrato } from "../../database/GraphQLStatements";

export const ContractTypes = () => {
  const [{ editDialog, elementDialog }, dispatch] = useStateValue();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editDialog]);

  const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipoContrato: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ambasPartes: { value: null, matchMode: FilterMatchMode.CONTAINS },
    encabezado: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  let c = [
    { field: "tipoContrato", header: "Tipo Contrato" },
    { field: "ambasPartes", header: "Ambas partes" },
    { field: "encabezado", header: "Encabezado" },
  ];

  //graphQL
  const { data, error, loading } = useQuery(selectAllTipoContrato);
  const [updateTC, { loadingU, errorU }] = useMutation(updateTipoContrato, { refetchQueries: ["findAllTipoContrato"] });
  const [removeTC] = useMutation(removeTipoContrato, { refetchQueries: ["findAllTipoContrato"] });

  const deleteOne = () => {
    try {
      removeTC({ variables: { id: elementDialog.idTipoContrato } })
    } catch (error) {
      alert(error)
    }
  }

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    tipoContrato: yup.string().required("Tipo de contrato es requerido"),
    encabezado: yup.string().required("Encabezado es requerido"),
    ambasPartes: yup.string().required("Ambas partes es requerido"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema)
  });

  const handle = ({ tipoContrato, encabezado, ambasPartes }) => {
    let temp = {};
    Object.assign(temp, elementDialog);
    temp.tipoContrato = tipoContrato;
    temp.encabezado = encabezado;
    temp.ambasPartes = ambasPartes;
    // Object.keys(elementDialog).length === 0 ? temp.visible= true : console.log("object")
    temp.visible= true
    try {
      updateTC({ variables: { tipoContrato: temp } })
      dispatch({type: actionTypes.SET_EDIT_DIALOG, editDialog: false})
    } catch (error) {
      alert(error)
    }
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  return (
    <div>
      <Navbar />
      {loading && loadingU && <h5>Loading...</h5>}
      {error && errorU && <h5>{error}</h5>}
      {!(loading || error || loadingU || errorU) ? (
        <div>
          <Table
            value={data.findAllTipoContrato}
            header="Tipos de Contratos"
            size="small"
            columns={c}
            pagination={true}
            rowNumbers={[10, 20, 30]}
            selectionType="multiple"
            sortRemove
            orderSort={1}
            fieldSort="tipoContrato"
            filterDplay="row"
            filtersValues={filters}
            edit={true}
            exportData={true}
            deleteOne= {deleteOne}
          />
          <Dialog
            visible={editDialog}
            style={{ width: "450px" }}
            header={
              Object.keys(elementDialog).length === 0 ? "Insertar" : "Detalles"
            }
            modal
            breakpoints={{ "992px": "50vw", "768px": "65vw", "572px": "80vw" }}
            resizable={false}
            className=""
            onHide={() => {
              dispatch({
                type: actionTypes.SET_EDIT_DIALOG,
                editDialog: false,
              });
            }}
          >
            <form onSubmit={handleSubmit(handle)}>
              <label
                htmlFor="tipoContrato"
                className={classNames(
                  { "p-error": errors.email },
                  "block text-900 font-medium mb-2"
                )}
              >
                Tipo de contrato*
              </label>
              <Controller
                name="tipoContrato"
                defaultValue={elementDialog.tipoContrato}
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
              {getFormErrorMessage("tipoContrato")}
              <label
                htmlFor="ambasPartes"
                className={classNames(
                  { "p-error": errors.email },
                  "block text-900 font-medium mb-2"
                )}
              >
                Ambas partes*
              </label>
              <Controller
                name="ambasPartes"
                defaultValue={elementDialog.ambasPartes}
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
              {getFormErrorMessage("ambasPartes")}
              <label
                htmlFor="encabezado"
                className={classNames(
                  { "p-error": errors.email },
                  "block text-900 font-medium mb-2"
                )}
              >
                Encabezado*
              </label>
              <Controller
                name="encabezado"
                defaultValue={elementDialog.encabezado}
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
              {getFormErrorMessage("encabezado")}
              <div className="flex justify-content-end mt-3">
                <Button
                  label="Guardar"
                  icon="pi pi-check"
                  className="p-button-text"
                  type="submit"
                />
                <Button
                  label="Cancelar"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() =>
                    dispatch({
                      type: actionTypes.SET_EDIT_DIALOG,
                      editDialog: false,
                    })
                  }
                />
              </div>
            </form>
          </Dialog>
        </div>
      ) : (
        console.log("e")
      )}
    </div>
  );
};
