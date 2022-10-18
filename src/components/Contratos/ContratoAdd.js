import React, { useState } from "react";
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
  selectOneBasesGenerales,
} from "../../database/GraphQLStatements";
import { useParams } from "react-router-dom";
import {  useMutation, useQuery } from "@apollo/client";
import { Steps } from "primereact/steps";
import { ContratoStep } from "./ContratoStep/ContratoStep";
import "./AddContract.css";
import Contrato from "./ContratoStep/ContratoClass";
import { EmbarquesStep } from "./EmbarqueStep/EmbarqueStep";
import { Loading } from "../LoadingComponent";

export const ContratoAdd = () => {
  const idBg = useParams().idBaseGeneral;

  //Embarques props
  const [activeIndex, setActiveIndex] = useState(1);
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

  //graphql
  const { data: dataCMarco, loading: loadingCM } = useQuery(
    selectAllContratoMarco
  );
  const { data: dataBG, loading: loadingBG} = useQuery(
    selectOneBasesGenerales,
    {
      variables: { id: parseInt(idBg) },
      fetchPolicy: "network-only",
      // onCompleted: (data) =>
      //   formRefA?.current?.setValue(
      //     "noContrato",
      //     dataBG?.findOneBasesGenerales?.noContrato
      //   ),
    }
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

  const embarqueInitValues = {
    fechaEntrega: "",
    // idContrato: number | null
    // numero: "",
    descuento: 0,
    terminado: "",
    cancelado: false,
    porFirmar: false,
    qtyCnt: 0,
    flete: 0,
    seguro: 0,
    financiamiento: 0,
    idEmpresaNaviera: "",
    inspeccion: 0,
    otros: 0,
    c40: 0,
    c20: 0,
    actSci: false,
  };

  if (
    loadingBG ||
    loadingCM ||
    loadingE ||
    loadingFE ||
    loadingInc ||
    loadingM ||
    loadingN ||
    loadingC ||
    loadingNav
  )
    return <Loading />;

  return (
    <div className="p-3">
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
            dataBG={dataBG}
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
          <EmbarquesStep
            bg={dataBG?.findOneBasesGenerales}
            contrato={contrato}
            initValues = {embarqueInitValues} 
            setActiveIndex={setActiveIndex}
            addContrato={addContrato}
          />
        )}
      </div>
    </div>
  );
};
