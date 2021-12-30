import React, { useEffect } from "react";
import { Navbar } from "../NavBar/Navbar";
import { useQuery, useMutation } from "@apollo/client";
import { Table } from "../ui/Table";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import * as yup from "yup";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";
import {
  removeTipoContrato,
  selectAllTipoContrato,
  updateTipoContrato,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";

export const ContractTypes = () => {
  const [{ editDialog, elementDialog }, dispatch] = useStateValue();

  useEffect(() => {
    // reset();
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
  const [updateTC, { loadingU, errorU }] = useMutation(updateTipoContrato, {
    refetchQueries: ["findAllTipoContrato"],
  });
  const [removeTC] = useMutation(removeTipoContrato, {
    refetchQueries: ["findAllTipoContrato"],
  });

  const deleteOne = () => {
    try {
      removeTC({ variables: { id: elementDialog.idTipoContrato } });
    } catch (error) {
      alert(error);
    }
  };

  //Form
  //React-hook-form
  const schema = yup.object().shape({
    tipoContrato: yup.string().required("Tipo de contrato es requerido"),
    encabezado: yup.string().required("Encabezado es requerido"),
    ambasPartes: yup.string().required("Ambas partes es requerido"),
  });

  const handle = ({ tipoContrato, encabezado, ambasPartes }) => {
    let temp = {};
    Object.assign(temp, elementDialog);
    temp.tipoContrato = tipoContrato;
    temp.encabezado = encabezado;
    temp.ambasPartes = ambasPartes;
    // Object.keys(elementDialog).length === 0 ? temp.visible= true : console.log("object")
    temp.visible = true;
    try {
      updateTC({ variables: { tipoContrato: temp } });
      dispatch({ type: actionTypes.SET_EDIT_DIALOG, editDialog: false });
    } catch (error) {
      alert(error);
    }
  };
  const cancel = () => {
    dispatch({
      type: actionTypes.SET_EDIT_DIALOG,
      editDialog: false,
    });
  };
  const dataStruct = [
    {
      component: "label",
      name: "tipoContrato",
      defaultValue: "Tipo de contrato*",
    },
    {
      component: "InputText",
      name: "tipoContrato",
      defaultValue: elementDialog.tipoContrato,
    },
    {
      component: "label",
      name: "ambasPartes",
      defaultValue: "Ambas partes*",
    },
    {
      component: "InputText",
      name: "ambasPartes",
      defaultValue: elementDialog.ambasPartes,
    },
    {
      component: "label",
      name: "encabezado",
      defaultValue: "Encabezado*",
    },
    {
      component: "InputText",
      name: "encabezado",
      defaultValue: elementDialog.encabezado,
    },
  ];

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
            deleteOne={deleteOne}
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
            <Form
              data={dataStruct}
              schema={schema}
              handle={handle}
              cancel={cancel}
              buttonsNames={["Guardar", "Cancelar"]}
            />
            {/* <FormProvider {...methods}>
              <form onSubmit={handleSubmit(handle)}>
                <Field type="label" name="tipoContrato" defaultValue="Tipo de contrato*"/>
                <Field type="InputText" name="tipoContrato" defaultValue={elementDialog.tipoContrato}/>
                <Field type="label" name="ambasPartes" defaultValue="Ambas partes*"/>
                <Field type="InputText" name="ambasPartes" defaultValue={elementDialog.ambasPartes}/>
                <Field type="label" name="encabezado" defaultValue="Encabezado*"/>
                <Field type="InputText" name="encabezado" defaultValue={elementDialog.encabezado}/>               
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
            </FormProvider> */}
          </Dialog>
        </div>
      ) : (
        console.log("e")
      )}
    </div>
  );
};
