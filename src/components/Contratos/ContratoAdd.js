import React, { useState, useEffect, useRef } from "react";
import { Form } from "../ui/Form";
import * as yup from "yup";
import {
  createContrato,
  selectAllCompaniasNavieras,
  selectAllCompradores,
  selectAllContratoMarco,
  selectAllEjecutivos,
  selectAllIncoterm,
  selectAllMonedas,
  selectAllNegociacionesResumen,
  selectFormasEntrega,
} from "../../database/GraphQLStatements";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Steps } from "primereact/steps";
import { Accordion, AccordionTab } from "primereact/accordion";
import { cloneDeep, omit } from "lodash";
import { ContratoStep } from "./ContratoStep/ContratoStep";
import "./AddContract.css";
import Contrato from "./ContratoStep/ContratoClass";
import { EmbarqueStep } from "./EmbarqueStep/EmbarqueStep";

export const ContratoAdd = () => {
  const idBg = useParams().idBaseGeneral;
  //Anexos props
  const formRefE = useRef(null);
  const formRefN = useRef(null);
  const navigate = useNavigate();

  //Embarques props
  const [activeIndex, setActiveIndex] = useState(0);
  const [contrato, setContrato] = useState(
    new Contrato(
      "",
      new Date(),
      "",
      "",
      new Date(),
      "",
      "",
      0,
      "",
      "",
      "ESICUBA",
      null,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      new Date(),
      null,
      0,
      0,
      0,
      false,
      false,
      false,
      [],
      false,
      null,
      null,
      []
    )
  );
  console.log(contrato)
  
  

  //graphql
  const { data: dataCMarco, loading: loadingCM } = useQuery(
    selectAllContratoMarco
  );
  const { data: dataEjecutivos, loading: loadingE } =
    useQuery(selectAllEjecutivos);
  const { data: dataFirman, loading: loadingC } =
    useQuery(selectAllCompradores);
  const { data: dataIncoterms, loading: loadingInc } =
    useQuery(selectAllIncoterm);
  const { data: dataFE, loading: loadingFE } = useQuery(selectFormasEntrega);
  const { data: dataN, loading: loadingN } = useQuery(
    selectAllNegociacionesResumen
  );
  const { data: dataMoneda, loading: loadingM } = useQuery(selectAllMonedas);
  const { data: dataNav, loading: loadingNav } = useQuery(
    selectAllCompaniasNavieras
  );
  const [addContrato] = useMutation(createContrato);
  
  const interactiveItems = [
    {
      label: "Anexos",
    },
    {
      label: "Embarques",
    },
    {
      label: "Notas",
    },
  ];

  return (
    <div className="p-3">
      {loadingCM &&
        loadingE &&
        loadingFE &&
        loadingInc &&
        loadingM &&
        loadingN &&
        loadingC &&
        loadingNav && (
          <div className="flex h-30rem justify-content-center align-items-center">
            <ProgressSpinner strokeWidth="3" />
          </div>
        )}
      {!(
        loadingCM ||
        loadingE ||
        loadingFE ||
        loadingInc ||
        loadingM ||
        loadingN ||
        loadingNav ||
        loadingC
      ) ? (
        <div>
          <h1 className="mb-4 text-primary text-4xl">Nuevo Contrato</h1>
          <div className="p-card p-5">
            <Steps
              model={interactiveItems}
              className="steps flex justify-content-center"
              activeIndex={activeIndex}
              onSelect={(e) => setActiveIndex(e.index)}
            />
            {activeIndex === 0 && (
              <ContratoStep
                idBg={idBg}
                dataCMarco={dataCMarco}
                dataFirman={dataFirman}
                dataN={dataN}
                dataMoneda={dataMoneda}
                dataIncoterms={dataIncoterms}
                dataNav={dataNav}
                dataFE={dataFE}
                dataEjecutivos={dataEjecutivos}
                contrato={contrato}
                setContrato={setContrato}
                setActiveIndex={setActiveIndex}
              />
            )}
            {activeIndex === 1 && (
              <EmbarqueStep contrato={contrato} setContrato={setContrato} activeIndex={activeIndex} setActiveIndex={setActiveIndex}  />
            )}
          </div>
        </div>
      ) : undefined}
    </div>
  );
};
