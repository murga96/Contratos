import { useQuery } from "@apollo/client";
import { Dialog } from "primereact/dialog";
import React, { useRef, useState, useEffect } from "react";
import {
  selectAllTiposDeClausulas,
  selectOneBasesGenerales,
} from "../../../database/GraphQLStatements";
import { Form } from "../../ui/Form";
import * as yup from "yup";
import { fireError } from "../../utils";
import { cloneDeep, omit } from "lodash";
import { Button } from "primereact/button";
import { ContratoClausula } from "./ContratoClausula";

export const ContratoStep = ({
  idBg,
  dataCMarco,
  dataFirman,
  dataN,
  dataMoneda,
  dataIncoterms,
  dataNav,
  dataFE,
  dataEjecutivos,
  contrato,
  setContrato,
  setActiveIndex,
}) => {
  console.log(dataCMarco);
  const formRefA = useRef(null);
  const [negociacion, setNegociacion] = useState(null);
  const [selectedContratoClausula, setSelectedContratoClausula] =
    useState(contrato?.contratoClausulas?.length > 0 ? contrato?.contratoClausulas[0] : null);
  const [addClausulaDialog, setAddClausulaDialog] = useState(null);

  useEffect(() => {
    if (negociacion) {
      console.log(negociacion, "operacion");
      formRefA.current?.setValues("operacion", negociacion.operacion);
      formRefA.current?.setValues("idMoneda", negociacion.monedas?.idMoneda);
      // formRefA.current.setValues("idIncoterm", negociacion.inco);
    }
  }, [negociacion]);

  //graphql
  const { data: dataBG, loading: loadingBG } = useQuery(
    selectOneBasesGenerales,
    {
      variables: { idBasesG: parseInt(idBg) },
      fetchPolicy: "network-only",
      onCompleted: (data) =>
        formRefA?.current?.setValues(
          "noContrato",
          dataBG?.findOneBasesGenerales?.noContrato
        ),
    }
  );
  const { data: dataTC, loading: loadingTC } = useQuery(
    selectAllTiposDeClausulas
  );

  //FormPropsContrato
  const handle = (data) => {
    if (contrato?.contratoClausulas.length === 0) {
      fireError("El contrato debe tener cláusulas");
      return;
    }
    let omitList = ["noContrato", "porciento", "operacion"];
    data.idCMarco === "" && omitList.push("idCMarco");
    let temp = omit(data, omitList);
    temp.idNegociacion = data.idNegociacion.idNegociacion;
    temp.contratoClausulas = contrato?.contratoClausulas;
    temp.cancelado = false;
    temp.idPais = dataBG?.findOneBasesGenerales?.idPais;
    temp.idBasesGenerales = dataBG?.findOneBasesGenerales?.idBasesGenerales;
    //TODO Hay que poner el usuario autenticado
    temp.realizadoPor = contrato?.idEjecutivo
    // temp.contratoClausulas = temp.contratoClausulas.map((i) => {
    //   let t = omit(i, "tipoClausula");
    //   return t;
    // });
    temp.embarques = [{test: "Gustavo"}];
    console.log(temp);
    setContrato(cloneDeep(temp));
    setActiveIndex(1);
    // try {
    //   addContrato({ variables: { createContratoInput: contrato } });
    //   // navigate(-1)
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const schemaA = yup.object().shape({
    idMoneda: yup.number().typeError("Seleccione una moneda"),
    // idFormaEntrega: yup.number().typeError("Seleccione una forma de entrega"),
    // idNegociacion: yup.object().typeError("Seleccione una negociación"),
    // idEjecutivo: yup.number().typeError("Seleccione un ejecutivo"),
    // firmadoPor: yup.number().typeError("Seleccione un comprador"),
    // idIncoterm: yup.number().typeError("Seleccione una condición de compra"),
    // lugarFirma: yup.string().required("Lugar de firma es requerido"),
    // lugarEntrega: yup.string().required("Lugar de entrega es requerido"),
    // // fechaElaboracion: yup.date().required("Fecha de confección es requerida"),
    // fechaTasa: yup.date().typeError("Fecha es requerida"),
    // tasaMoneda: yup.number().required("Tasa es requerido"),
  });

  //Form props Anexos
  let dataStructAnexos = [
    {
      id: 1,
      component: "InputText",
      name: "noContrato",
      defaultValue: dataBG?.findOneBasesGenerales?.noContrato,
      label: "No:",
      props: {
        disabled: true,
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idCMarco",
      defaultValue: contrato?.idCMarco,
      label: "CMarco:",
      props: {
        options: dataCMarco?.findAllContratoMarco,
        optionLabel: "noContratoMarco",
        optionValue: "idCMarco",
        filter: true,
        placeholder: "Seleccione un Contrato Marco",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 2,
      component: "Calendar",
      name: "fechaElaboracion",
      defaultValue: contrato?.fechaElaboracion,
      label: "Fecha confección:",
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
        placeholder: "Seleccione una fecha",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 1,
      component: "InputText",
      name: "lugarFirma",
      defaultValue: contrato?.lugarFirma,
      label: "Lugar Firma:",
      fieldLayout: { className: "col-2" },
    },
    {
      id: 1,
      component: "Dropdown",
      name: "firmadoPor",
      defaultValue: contrato?.firmadoPor,
      label: "Firman:",
      props: {
        options: dataFirman?.findAllCompradores,
        optionLabel: "representante",
        optionValue: "idComprador",
        filter: true,
        placeholder: "Seleccione un comprador",
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 1,
      component: "Calendar",
      name: "fechaFirma",
      label: "Fecha Firma PI:",
      defaultValue: contrato?.fechaFirma,
      fieldLayout: { className: "col-2" },
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idNegociacion",
      defaultValue: contrato?.idNegociacion,
      label: "Negociación:",
      props: {
        options: dataN?.findAllNegociacionResumen,
        optionLabel: "noNegociacion",
        filter: true,
        placeholder: "Seleccione una negociacion",
        onChange: (e) => {
          setNegociacion(e);
        },
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "operacion",
      defaultValue: "",
      label: "Operación:",
      props: {
        options: [
          { label: "Multiplicar", value: true },
          { label: "Dividir", value: false },
        ],
        placeholder: "Seleccione una operación",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idMoneda",
      defaultValue: contrato?.idMoneda,
      label: "Moneda:",
      props: {
        options: dataMoneda?.findAllMoneda,
        placeholder: "Seleccione una moneda",
        optionLabel: "moneda",
        optionValue: "idMoneda",
        filter: true,
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "Tasa:",
      name: "tasaMoneda",
      defaultValue: contrato?.tasaMoneda,
      props: {
        className: "mr-8",
        step: 1,
        size: 1,
        min: 0,
        showButtons: true,
        allowEmpty: false,
        type: "float",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 1,
      component: "Calendar",
      name: "fechaTasa",
      label: "Fecha:",
      defaultValue: contrato?.fechaTasa,
      fieldLayout: { className: "col-2" },
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idIncoterm",
      defaultValue: contrato?.idIncoterm,
      label: "Condición de compra:",
      props: {
        options: dataIncoterms?.findAllIncoterm,
        optionLabel: "abreviatura",
        optionValue: "idIncoterm",
        filter: true,
        placeholder: "Seleccione una Condición de Compra",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "InputText",
      name: "empresaSeguro",
      defaultValue: contrato?.empresaSeguro,
      label: "Seguros:",
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idEmpresaNaviera",
      defaultValue: contrato?.idEmpresaNaviera,
      label: "Naviera:",
      props: {
        options: dataNav?.findAllCompaniasNavieras,
        optionLabel: "nombre",
        optionValue: "id",
        filter: true,
        placeholder: "Seleccione una naviera",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idEjecutivo",
      defaultValue: contrato?.idEjecutivo,
      label: "Ejecutivo:",
      props: {
        options: dataEjecutivos?.findAllEjecutivos,
        optionLabel: "nombre",
        optionValue: "idEjecutivo",
        filter: true,
        placeholder: "Seleccione un ejecutivo",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "InputTextArea",
      name: "producto",
      defaultValue: contrato?.producto,
      label: "Producto:",
      props: {
        rows: 4,
      },
      fieldLayout: { className: "col-12" },
    },
    {
      id: 3,
      component: "label",
      name: "label",
      defaultValue: "Rango de Entregas",
      fieldLayout: { className: "col-12 mt-3 flex justify-content-center" },
    },
    {
      id: 1,
      component: "InputText",
      name: "lugarEntrega",
      defaultValue: contrato?.lugarEntrega,
      label: "Lugar de Entrega:",
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idFormaEntrega",
      defaultValue: contrato?.idFormaEntrega,
      label: "Forma:",
      props: {
        options: dataFE?.findAllFormasEntrega,
        optionLabel: "formaEntrega",
        optionValue: "idFormaEntrega",
        filter: true,
        placeholder: "Seleccione una forma de entrega",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 1,
      component: "Calendar",
      name: "fechaArribo",
      label: "Fecha de arribo:",
      defaultValue: contrato?.fechaArribo,
      fieldLayout: { className: "col-2" },
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 1,
      component: "Calendar",
      name: "fechaRecepcion",
      label: "Fecha de recepción:",
      defaultValue: contrato?.fechaRecepcion,
      fieldLayout: { className: "col-2" },
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 1,
      component: "Calendar",
      name: "fechaInicial",
      label: "Fecha de apertura:",
      defaultValue: contrato?.fechaInicial,
      fieldLayout: { className: "col-2" },
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 1,
      component: "Calendar",
      name: "fechaFinal",
      label: "Fecha final:",
      defaultValue: contrato?.fechaFinal,
      fieldLayout: { className: "col-2" },
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "No. Entregas:",
      name: "noEntregasParciales",
      defaultValue: contrato?.noEntregasParciales,
      props: {
        className: "mr-8",
        step: 1,
        size: 1,
        min: 0,
        showButtons: true,
        allowEmpty: false,
        type: "int",
      },
      fieldLayout: { className: "col-1" },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "Financiamiento",
      name: "financiamiento",
      defaultValue: contrato?.financiamiento,
      props: {
        className: "mr-8",
        step: 1000,
        size: 1,
        min: 0,
        mode: "currency",
        currency: "USD",
        locale: "en-US",
        minFractionDigits: 4,
        showButtons: true,
        allowEmpty: false,
        type: "float",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 1,
      component: "InputText",
      name: "porciento",
      defaultValue: "",
      label: "%:",
      props: {
        disabled: true,
        className: "disabled",
      },
      fieldLayout: { className: "col-1" },
    },
    {
      id: 2,
      component: "InputNumber",
      label: "Gastos Logísticos",
      name: "gastosLogisticos",
      defaultValue: contrato?.gastosLogisticos,
      props: {
        className: "mr-8",
        step: 1000,
        size: 1,
        min: 0,
        mode: "currency",
        currency: "USD",
        locale: "en-US",
        minFractionDigits: 4,
        showButtons: true,
        allowEmpty: false,
        type: "float",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 6,
      component: "EmptyCol",
      name: "emptyCol1",
      defaultValue: "",
      fieldLayout: { className: "col-5" },
    },
    {
      id: 6,
      component: "CheckBox",
      name: "permitirEmbarquesParciales",
      label: "Permitir Embarques parciales:",
      defaultValue: contrato?.permitirEmbarquesParciales,
      fieldLayout: { className: "col-2" },
    },
    {
      id: 6,
      component: "CheckBox",
      name: "permitirTrasbordos",
      label: "Permitir Trasbordos:",
      defaultValue: contrato?.permitirTrasbordos,
      fieldLayout: { className: "col-2" },
    },
    {
      id: 6,
      component: "CheckBox",
      name: "permitirEntregas",
      label: "Permitir Entregas Anticipadas:",
      defaultValue: contrato?.permitirEntregas,
      fieldLayout: { className: "col-2" },
    },
    {
      id: 6,
      component: "EmptyCol",
      name: "emptyCol",
      defaultValue: false,
      fieldLayout: { className: "col-2" },
    },
    {
      id: 5,
      component: "Divider",
      name: "divider1",
      fieldLayout: { className: "col-12 grid-nogutter" },
    },
    {
      id: 5,
      component: "Custom",
      name: "custom",
      defaultValue: (
        <ContratoClausula
          contratoClausulas={contrato?.contratoClausulas}
          setAddClausulaDialog={setAddClausulaDialog}
          setSelectedContratoClausula={setSelectedContratoClausula}
          selectedContratoClausula={selectedContratoClausula}
        />
      ),
      fieldLayout: { className: "col-12" },
    },
  ];

  const ButtonsAnexoComponent = () => (
    <div className="flex justify-content-end mt-3">
      <Button label="Siguiente" className="mr-4" type="submit" />
    </div>
  );

  const formPropsAnexos = {
    data: dataStructAnexos,
    schema: schemaA,
    buttonsNames: <ButtonsAnexoComponent />,
  };

  //form ClausulasComponent
  const addClausula = ({ tipoClausula }) => {
    contrato?.contratoClausulas.push({
      tipoClausula: tipoClausula,
      noClausula: tipoClausula.orden,
      contenido: "",
    });
    setSelectedContratoClausula(
        contrato?.contratoClausulas[contrato?.contratoClausulas.length - 1]
    );
    setAddClausulaDialog(false);
  };

  const schemaC = yup.object().shape({
    tipoClausula: yup.object().typeError("Seleccione un tipo de clausula"),
  });

  let dataStructClausula = [
    {
      id: 1,
      component: "Dropdown",
      name: "tipoClausula",
      defaultValue: 0,
      label: "Tipo de cláusula*",
      props: {
        options: dataTC?.findAllTiposDeClausulas?.filter(
          (pc) =>
          contrato?.contratoClausulas?.findIndex((i) => {
              return i.tipoClausula === pc.tipoClausula;
            }) === -1
        ),
        optionLabel: "nombre",
        placeholder: "Seleccione un tipo de cláusula",
      },
    },
  ];

  const formPropsClausula = {
    data: dataStructClausula,
    schema: schemaC,
    buttonsNames: ["Aceptar"],
  };

  return (
    <div>
      {!loadingTC && (
        <div className="p-4">
          <Form
            ref={formRefA}
            data={formPropsAnexos?.data}
            schema={formPropsAnexos?.schema}
            handle={handle}
            buttonsNames={formPropsAnexos?.buttonsNames}
            formLayout={{ className: "grid mt-3" }}
          />
          <Dialog
            visible={addClausulaDialog}
            style={{ width: "450px" }}
            header="Adicionar cláusula"
            modal
            breakpoints={{
              "992px": "50vw",
              "768px": "65vw",
              "572px": "80vw",
            }}
            resizable={false}
            onHide={() => {
              setAddClausulaDialog(false);
            }}
          >
            <Form
              data={formPropsClausula?.data}
              schema={formPropsClausula?.schema}
              handle={addClausula}
              cancel={() => setAddClausulaDialog(false)}
              buttonsNames={formPropsClausula?.buttonsNames}
            />
          </Dialog>
        </div>
      )}
    </div>
  );
};
