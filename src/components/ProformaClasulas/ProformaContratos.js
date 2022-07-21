import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  selectAllProforma,
  // createProforma,
  selectAllTiposDeClausulas,
  removeProformasClausulas,
  selectAllTipoContrato,
  selectAllIncoterm,
  selectAllProformaClausulasById,
  createSeveralProformaClausula,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import * as _ from "lodash";
import { fireError, fireInfo, generateProformaDocument } from "../utils";
import moment from "moment";
import { Form } from "../ui/Form";
import { Dialog } from "primereact/dialog";
import * as yup from "yup";

export const ProformaContratos = () => {
  const [addClausulaDialog, setAddClausulaDialog] = useState(false);
  const [selectedTipoDeContrato, setSelectedTipoDeContrato] = useState(null);
  const [selectedIncoterm, setSelectedIncoterm] = useState(null);
  const [proforma, setProforma] = useState(null);
  const [proformasClausulas, setProformasClausulas] = useState(null);
  const [proformaClausula, setProformaClausula] = useState(null);
  const [clausula, setClausula] = useState(null);

  //graphQL
  const { data: dataTC, loadingTC } = useQuery(selectAllTipoContrato, {
    nextFetchPolicy: "network-only",
  });
  const { data: dataI, loadingI } = useQuery(selectAllIncoterm, {
    nextFetchPolicy: "network-only",
  });
  const { data: dataTClau } = useQuery(selectAllTiposDeClausulas, {
    nextFetchPolicy: "network-only",
  });
  const [getProformaClausulasByIds] = useLazyQuery(
    selectAllProformaClausulasById,
    {
      fetchPolicy: "network-only",
    }
  );
  const [updateElements] = useMutation(createSeveralProformaClausula);
  const [removePC] = useMutation(removeProformasClausulas);

  useEffect(() => {
    setClausula(proformaClausula?.clausula);
  }, [proformaClausula]);

  const mostrarClausulas = () => {
    getProformaClausulasByIds({
      variables: {
        idTipoContrato: selectedTipoDeContrato.idTipoContrato,
        idIncoterm: selectedIncoterm.idIncoterm,
      },
      onCompleted: (data) => {
        if (data) {
          setProformasClausulas(data?.findAllProformaClausulasById);
          if (
            data?.findAllProformaClausulasById &&
            data?.findAllProformaClausulasById?.length > 0
          )
            setProformaClausula(data?.findAllProformaClausulasById[0]);
          else {
            setProformaClausula(null);
          }
        }
      },
    });
  };

  //Form
  //React-hook-form
  const informeClausulas = () => {
    generateProformaDocument(
      proformasClausulas,
      selectedTipoDeContrato,
      selectedIncoterm
    );
  };
  const guardarClausulas = async () => {
    let tempPC = proformasClausulas.map((element) =>
      _.omit(element, "tiposDeClausulas")
    );
    try {
      const resp = await updateElements({
        variables: { createProformaClausulaInput: tempPC },
      });
      console.log(resp);
      if (resp) {
        fireInfo(
          "Las claúsulas de las bases generales fueron guardadas correctamente"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteClausula = () => {
    removePC({ variables: { id: proformaClausula?.idProformaClausula } });
  };

  //AddClausula
  const checkIfWeCanAddClausula = () => {
    return tipoClausulaForAddClausula?.length === 0;
  };

  const tipoClausulaForAddClausula = () => {
    return dataTClau?.findAllTiposDeClausulas?.filter((tc) => {
      if (selectedTipoDeContrato?.tipoContrato === "EXCEPCIONAL") {
        return (
          proformasClausulas?.findIndex((pc) => {
            return pc.tiposDeClausulas.idTipoClausula === tc.idTipoClausula;
          }) === -1 /* && tc.excepcional */
        );
      } else {
        return (
          proformasClausulas?.findIndex((pc) => {
            // if (!pc.excepcional)
            return pc.tiposDeClausulas.idTipoClausula === tc.idTipoClausula;
          }) === -1 /* && !tc.excepcional */
        );
      }
    });
  };

  const addClausula = ({ tipoClausula, orden }) => {
    proformasClausulas.push({
      idTipoClausula: tipoClausula.idTipoClausula,
      orden: orden,
      clausula: "",
      tiposDeClausulas: tipoClausula,
      idTipoContrato: selectedTipoDeContrato.idTipoContrato,
      idIncoterm: selectedIncoterm.idIncoterm,
    });
    const lastPC = proformasClausulas[proformasClausulas.length - 1];
    setProformaClausula(lastPC);
    setAddClausulaDialog(false);
  };

  const schemaPC = yup.object().shape({
    tipoClausula: yup.object().typeError("Seleccione un tipo de clausula"),
    orden: yup.number().required("Orden es requerido"),
  });

  let dataStructProformaClausula = [
    {
      id: 1,
      component: "Dropdown",
      name: "tipoClausula",
      defaultValue: 0,
      label: "Tipo de cláusula*",
      props: {
        options: tipoClausulaForAddClausula(),
        optionLabel: "nombre",
        placeholder: "Seleccione un tipo de cláusula",
      },
    },
    {
      id: 1,
      component: "InputNumber",
      name: "orden",
      defaultValue: 1,
      label: "Orden*",
      props: {
        step: 1,
        type: "int",
        allowEmpty: false,
        showButtons: true,
        size: 1,
        min: 1,
      },
    },
  ];

  const formPropsProforma = {
    data: dataStructProformaClausula,
    schema: schemaPC,
    buttonsNames: ["Aceptar"],
  };

  return (
    <div className="p-4">
      {loadingTC && loadingI && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {dataTC || dataI ? (
        <div className="p-card p-4 w-full h-full grid">
          <div className="col-4 text-2xl text-primary flex align-items-end">
            Proformas de Bases Generales
          </div>
          <div className="col-8" />
          <div className="col-4 mt-4">
            <h6 className="mb-3 text-lg">Tipo Contrato:</h6>
            <Dropdown
              className="w-full"
              value={selectedTipoDeContrato}
              onChange={(e) => {
                if (selectedTipoDeContrato && proformasClausulas)
                  confirmDialog({
                    message:
                      "¿Está seguro que desea cambiar de tipo de contrato? Perderá los datos que no se hayan guardado.",
                    header: "Confirmación",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => {
                      setSelectedTipoDeContrato(e.value);
                      setProformasClausulas(null)
                      setProformaClausula(null)
                    },
                  });
                  else {
                    setSelectedTipoDeContrato(e.value);
                  }
              }}
              options={dataTC?.findAllTipoContrato}
              optionLabel="tipoContrato"
              placeholder="Seleccione un tipo de contrato"
              filter
            />
          </div>
          <div className="col-4 mt-4">
            <h6 className="mb-3 text-lg">Condición de Compra:</h6>
            <Dropdown
              className="w-full"
              value={selectedIncoterm}
              onChange={(e) => {
                if (selectedIncoterm && proformasClausulas)
                  confirmDialog({
                    message:
                      "¿Está seguro que desea cambiar la condición de compra? Perderá los datos que no se hayan guardado.",
                    header: "Confirmación",
                    icon: "pi pi-exclamation-triangle",
                    accept: () => {
                      setSelectedIncoterm(e.value);
                      setProformasClausulas(null)
                      setProformaClausula(null)
                    },
                  });
                  else {
                    setSelectedIncoterm(e.value);
                  }
                // setProformaClausula(e.value?.proformaClausulas[0]);
                // setClausula(e.value.proformaClausulas[0].clausula);
              }}
              options={dataI?.findAllIncoterm}
              optionLabel="abreviatura"
              placeholder="Seleccione una condición de compra"
              filter
            />
          </div>
          {selectedIncoterm && selectedTipoDeContrato && (
            <div className="col-2 flex align-items-end">
              <Button
                className=""
                tooltip="Mostrar Cláusulas"
                icon="pi pi-eye"
                tooltipOptions={{ position: "bottom" }}
                onClick={mostrarClausulas}
              />
              <Button
                icon="pi pi-save"
                tooltip="Guardar cláusulas"
                className="ml-3"
                tooltipOptions={{ position: "bottom" }}
                onClick={guardarClausulas}
                disabled={proformasClausulas === null}
              />
              <Button
                icon="pi pi-search"
                tooltip="Previzualizar cláusulas"
                className="ml-3"
                onClick={informeClausulas}
                disabled={proformasClausulas === null}
              />
            </div>
          )}
          {proformasClausulas && (
            <div className="col-4 mt-4">
              <h6 className="mb-3 text-lg">Tipo de cláusula:</h6>
              <Dropdown
                className="w-full"
                value={proformaClausula}
                onChange={(e) => {
                  setProformaClausula(e.value);
                }}
                options={proformasClausulas}
                optionLabel="tiposDeClausulas.nombre"
                placeholder="Seleccione un tipo de cláusula"
                filter
              />
            </div>
          )}
          {proformasClausulas && (
            <div className="col-1 mt-6 flex align-items-center justify-content-between">
              {checkIfWeCanAddClausula && (
                <Button
                  className="p-button-rounded"
                  icon="pi pi-plus"
                  tooltip="Adicionar cláusula"
                  tooltipOptions={{ position: "bottom" }}
                  onClick={() => setAddClausulaDialog(true)}
                />
              )}
              {proformasClausulas?.length > 0 && (
                <Button
                  className="p-button-rounded"
                  icon="pi pi-minus"
                  tooltip="Eliminar cláusula"
                  tooltipOptions={{ position: "bottom" }}
                  onClick={deleteClausula}
                />
              )}
            </div>
          )}
          {proformaClausula && (
            <div className="col-1 mt-4 col-offset-6">
              <h6 className="mb-3 text-lg">Orden:</h6>
              <InputNumber
                className="w-full"
                step={1}
                type="int"
                allowEmpty={false}
                showButtons
                size={1}
                value={proformaClausula?.orden}
                onValueChange={(e) => {
                  let pc = proformasClausulas.find(
                    (pc) =>
                      pc.idProformaClausula ===
                      proformaClausula.idProformaClausula
                  );
                  pc.orden = e.value;
                }}
              />
            </div>
          )}
          {proformaClausula && (
            <div className="col-12">
              <h6 className="my-3 text-lg">Cláusula:</h6>
              <InputTextarea
                className="w-full"
                rows={12}
                value={clausula}
                onChange={(e) => {
                  let pc = proformasClausulas.find(
                    (pc) =>
                      pc.idProformaClausula ===
                      proformaClausula.idProformaClausula
                  );
                  pc.clausula = e.target.value;
                  setClausula(e.target.value);
                }}
              />
            </div>
          )}
          <Dialog
            visible={addClausulaDialog}
            style={{ width: "450px" }}
            header="Adicionar cláusula"
            modal
            breakpoints={{ "992px": "50vw", "768px": "65vw", "572px": "80vw" }}
            resizable={false}
            onHide={() => {
              setAddClausulaDialog(false);
            }}
          >
            <Form
              data={formPropsProforma?.data}
              schema={formPropsProforma?.schema}
              handle={addClausula}
              cancel={() => setAddClausulaDialog(false)}
              buttonsNames={formPropsProforma?.buttonsNames}
            />
          </Dialog>
        </div>
      ) : undefined}
    </div>
  );
};
