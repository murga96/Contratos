import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  selectAllProforma,
  createProforma,
} from "../../database/GraphQLStatements";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import * as _ from "lodash";
import { fireInfo, generateProformaDocument } from "../utils";
import moment from "moment";

export const ProformaContratos = () => {
  const [proformas, setProformas] = useState(null);
  const [proforma, setProforma] = useState(null);
  const [proformaClausula, setProformaClausula] = useState(null);
  const [clausula, setClausula] = useState(null);

  //graphQL
  const { data: dataP, loadingP } = useQuery(selectAllProforma, {
    nextFetchPolicy: "network-only",
    onCompleted: (data) =>
      setProformas(JSON.parse(JSON.stringify(data?.findAllProforma))),
  });
  const [updateElement] = useMutation(createProforma);

  console.log(dataP);
  useEffect(() => {
    console.log(proformaClausula);
  }, [proformaClausula]);
  

  //Form
  //React-hook-form
  const informeClausulas = () => {generateProformaDocument(proforma)};
  const guardarClausulas = async() => {
    let temp = _.omit(proforma, ["tipoDeContrato", "incoterm"]);
    temp.proformaClausulas = proforma.proformaClausulas.map((element) =>
      _.omit(element, "tiposDeClausulas")
    );
    try {
      const resp = await updateElement({ variables: { createProformaInput: temp } });
      console.log(resp)
      if(resp) {
        fireInfo("Las claúsulas de las bases generales fueron guardadas correctamente")
      }
      
    } catch (error) {
      console.log(error)
      
    }
  };
  return (
    <div className="p-4">
      {loadingP && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {!loadingP ? (
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
          <h6 className="mb-3 text-lg">Proforma:</h6>
            <Dropdown
              className="w-full"
              value={proforma}
              onChange={(e) => {
                setProforma(e.value);
                setProformaClausula(e.value?.proformaClausulas[0]);
                setClausula(e.value.proformaClausulas[0].clausula);
              }}
              options={proformas}
              optionLabel="nombreProfoma"
              placeholder="Seleccione una proforma"
              filter
            />
          </div>
          <div className="col-6" />
          {proforma && (
            <div className="col-4 mt-4">
              <h6 className="mb-3 text-lg">Tipo de claúsula:</h6>
              <Dropdown
                className="w-full"
                value={proformaClausula}
                onChange={(e) => {
                  setProformaClausula(e.value);
                  setClausula(e.value.clausula);
                }}
                options={proforma?.proformaClausulas}
                optionLabel="tiposDeClausulas.nombre"
                placeholder="Seleccione un tipo de clausula"
                filter
              />
            </div>
          )}
          {proforma && (
            <div className="col-1 mt-4 col-offset-7">
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
                  console.log("first");
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
              <h6 className="my-3 text-lg">Claúsula:</h6>
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
        </div>
      ) : undefined}
    </div>
  );
};
