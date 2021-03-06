import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  selectAllProforma,
  // createProforma,
  selectAllTiposDeClausulas,
  removeProformasClausulas,
  selectAllTipoContrato,
  selectAllIncoterm,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import * as _ from "lodash";
import { fireInfo, generateProformaDocument } from "../utils";
import moment from "moment";
import { Form } from "../ui/Form";
import { Dialog } from "primereact/dialog";
import * as yup from "yup";

export const ProformaContratos = () => {
  const [addClausulaDialog, setAddClausulaDialog] = useState(false);
  const [tiposDeContratos, setTiposDeContratos] = useState(null);
  const [selectedTipoDeContrato, setSelectedTipoDeContrato] = useState(null);
  const [incoterms, setIncoterms] = useState(null);
  const [selectedIncoterm, setSelectedIncoterm] = useState(null);
  const [proformas, setProformas] = useState(null);
  const [proforma, setProforma] = useState(null);
  const [proformaClausula, setProformaClausula] = useState(null);
  const [clausula, setClausula] = useState(null);

  //graphQL
  // const { data: dataP, loadingP } = useQuery(selectAllProforma, {
  //   nextFetchPolicy: "network-only",
  //   onCompleted: (data) =>
  //     setProformas(JSON.parse(JSON.stringify(data?.findAllProforma))),
  // });
  const { data: dataTC, loadingTC } = useQuery(selectAllTipoContrato, {
    nextFetchPolicy: "network-only",
    onCompleted: (data) =>
      setTiposDeContratos(JSON.parse(JSON.stringify(data?.findAllTipoContrato))),
  });
  const { data: dataI, loadingI } = useQuery(selectAllIncoterm, {
    nextFetchPolicy: "network-only",
    onCompleted: (data) =>
      setIncoterms(JSON.parse(JSON.stringify(data?.findAllIncoterm))),
  });
  const { data: dataPC } = useQuery(selectAllTiposDeClausulas, {
    nextFetchPolicy: "network-only",
  });
  // const [updateElement] = useMutation(createProforma);
  const [removePC] = useMutation(removeProformasClausulas);

  useEffect(() => {
    console.log(proformaClausula);
  }, [proformaClausula]);

  //Form
  //React-hook-form
  const informeClausulas = () => {
    generateProformaDocument(proforma);
  };
  const guardarClausulas = async () => {
    let temp = _.omit(proforma, ["tipoDeContrato", "incoterm"]);
    temp.proformaClausulas = proforma.proformaClausulas.map((element) =>
      _.omit(element, "tiposDeClausulas")
    );
    try {
      // const resp = await updateElement({
      //   variables: { createProformaInput: temp },
      // });
      // console.log(resp);
      // if (resp) {
      //   fireInfo(
      //     "Las cla??sulas de las bases generales fueron guardadas correctamente"
      //   );
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteClausula = () => {
    removePC({variables: {id: proformaClausula?.idProformaClausula}})
  };

  const addClausula = ({tipoClausula, orden}) => {
    proforma.proformaClausulas.push({
      idProforma: proforma.idProforma,
      idTipoClausula: tipoClausula.idTipoClausula,
      orden: orden,
      clausula: "",
      tiposDeClausulas: tipoClausula
    })
    const lastPC = proforma.proformaClausulas[proforma.proformaClausulas.length -1]
    setProformaClausula(lastPC)
    setClausula(lastPC.clausula)
    setAddClausulaDialog(false)
  };

  const schemaPC = yup.object().shape({
    tipoClausula: yup.object().typeError("Seleccione un tipo de clausula"),
    orden: yup.number().required("Orden es requerido"),
  });

  console.log(dataPC?.findAllTiposDeClausulas?.filter((pc) => pc.basesG));
  let dataStructProformaClausula = [
    {
      id: 1,
      component: "Dropdown",
      name: "tipoClausula",
      defaultValue: 0,
      label: "Tipo de cl??usula*",
      props: {
        options: dataPC?.findAllTiposDeClausulas?.filter(
          (pc) =>
            pc.basesG &&
            proforma?.proformaClausulas?.findIndex((i) => {
              return i.tiposDeClausulas.idTipoClausula === pc.idTipoClausula;
            }) === -1
        ),
        optionLabel: "nombre",
        placeholder: "Seleccione un tipo de cl??usula",
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
  console.log(dataI)
  console.log(dataTC)

  return (
    <div className="p-4">
      {false && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {!false ? (
        <div className="p-card p-4 w-full h-full grid">
          <div className="col-4 text-2xl text-primary flex align-items-end">
            Proformas de Bases Generales
          </div>

          <div className="col-2 col-offset-4 flex justify-content-end">
            <Button
              label="Guardar"
              icon="pi pi-save"
              onClick={guardarClausulas}
              disabled={proforma === null}
            />
          </div>
          <div className="col-2 flex justify-content-end lg:justify-content-center">
            <Button
              className="p-button-secondary"
              label="Previzualizar"
              icon="pi pi-search"
              onClick={informeClausulas}
              disabled={proforma === null}
            />
          </div>
          <div className="col-4 mt-4">
            <h6 className="mb-3 text-lg">Tipo Contrato:</h6>
            <Dropdown
              className="w-full"
              value={selectedTipoDeContrato}
              onChange={(e) => {
                setSelectedTipoDeContrato(e.value);
                setProformaClausula(e.value?.proformaClausulas[0]);
                setClausula(e.value.proformaClausulas[0].clausula);
              }}
              options={tiposDeContratos}
              optionLabel="nombreProfoma"
              placeholder="Seleccione una proforma"
              filter
            />
          </div>
          <div className="col-4 mt-4">
            <h6 className="mb-3 text-lg">Proforma:</h6>
            <Dropdown
              className="w-full"
              value={proforma}
              onChange={(e) => {
                setProforma(e.value);
                setProformaClausula(e.value?.proformaClausulas[0]);
                setClausula(e.value.proformaClausulas[0].clausula);
              }}
              options={tiposDeContratos}
              optionLabel="nombreProfoma"
              placeholder="Seleccione una proforma"
              filter
            />
          </div>
          <div className="col-6" />
          {proforma && (
            <div className="col-4 mt-4">
              <h6 className="mb-3 text-lg">Tipo de cl??usula:</h6>
              <Dropdown
                className="w-full"
                value={proformaClausula}
                onChange={(e) => {
                  setProformaClausula(e.value);
                  setClausula(e.value.clausula);
                }}
                options={proforma?.proformaClausulas}
                optionLabel="tiposDeClausulas.nombre"
                placeholder="Seleccione un tipo de cl??usula"
                filter
              />
            </div>
          )}
          {proforma && (
            <div className="col-1 mt-6 flex align-items-center justify-content-between">
              <Button
                className="p-button-rounded"
                icon="pi pi-plus"
                tooltip="Adicionar cl??usula"
                tooltipOptions={{ position: "bottom" }}
                onClick={() => setAddClausulaDialog(true)}
              />
              <Button
                className="p-button-rounded"
                icon="pi pi-minus"
                tooltip="Eliminar cl??usula"
                tooltipOptions={{ position: "bottom" }}
                onClick={deleteClausula}
              />
            </div>
          )}
          {proforma && (
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
                  let pc = proforma.proformaClausulas.find(
                    (pc) =>
                      pc.idProformaClausula ===
                      proformaClausula.idProformaClausula
                  );
                  pc.orden = e.value;
                }}
              />
            </div>
          )}
          {proforma && (
            <div className="col-12">
              <h6 className="my-3 text-lg">Cl??usula:</h6>
              <InputTextarea
                className="w-full"
                rows={12}
                value={clausula}
                onChange={(e) => {
                  let pc = proforma.proformaClausulas.find(
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
            header="Adicionar cl??usula"
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
