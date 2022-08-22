import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  actualizarClausulasFromBaseGeneral,
  getClausulasFromBaseGeneral,
  selectAllCompradores,
  selectAllIncoterm,
  selectAllPaises,
  selectAllProveedores,
  selectAllTipoContrato,
  selectOneBasesGenerales,
  updateBaseGeneral,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";
import _ from "lodash";

export const BaseGeneralEdit = () => {
  const bg = useParams();
  const formRef = useRef();
  const navigate = useNavigate();
  const [baseG, setBaseG] = useState(null);
  

  //graphql
  const { data: dataBG, loading: loadingBG } = useQuery(
    selectOneBasesGenerales,
    {
      variables: { id: parseInt(bg.BaseGeneral) },
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        setBaseG(JSON.parse(JSON.stringify(data.findOneBasesGenerales)));
      },
    }
  );
  const [
    actualizarClausulasProforma,
    { called: calledActClausula, refetch: refetchActClausula },
  ] = useLazyQuery(actualizarClausulasFromBaseGeneral, {
    fetchPolicy: "network-only",
  });
  const [
    getClausulas,
    { called: calledGetClausula, refetch: refetchGetClausula },
  ] = useLazyQuery(getClausulasFromBaseGeneral, {
    fetchPolicy: "network-only",
  });
  const [updateBG] = useMutation(updateBaseGeneral);
  const { data: findAllTipoContrato, loading: loadingTC } = useQuery(
    selectAllTipoContrato
  );
  const { data: findAllPaises, loading: loadingPa } = useQuery(selectAllPaises);
  const { data: findAllProveedores, loading: loadingProv } =
    useQuery(selectAllProveedores);
  const { data: findAllCompradores, loading: loadingComp } =
    useQuery(selectAllCompradores);
  const { data: findAllIncoterm, loading: loadingInc } =
    useQuery(selectAllIncoterm);

  const schema = yup.object().shape({
    idTipoContrato: yup.number().required("Seleccione un tipo de contrato"),
    fecha: yup.date().required("Fecha es requerido"),
    idPais: yup.number().required("Seleccione un país"),
    lugardeFirma: yup.string().required("Firma es requerida"),
    idProveedor: yup.number().required("Seleccione un vendedor"),
    idComprador: yup.number().required("Seleccione un comprador"),
    idIncoterm: yup.number().required("Seleccione una condición de compra"),
  });
  let dataStruct = [
    {
      id: 1,
      component: "Dropdown",
      name: "idTipoContrato",
      defaultValue: baseG?.tipoDeContrato.idTipoContrato,
      label: "Tipo de contrato*:",
      props: {
        options: findAllTipoContrato?.findAllTipoContrato,
        optionLabel: "tipoContrato",
        optionValue: "idTipoContrato",
      },
      fieldLayout: { className: "col-3" },
    },
    {
      id: 2,
      component: "Calendar",
      name: "fecha",
      defaultValue: moment(baseG?.fecha, moment.ISO_8601).toDate(),
      label: "Fecha:",
      props: {
        showIcon: true,
        dateFormat: "dd/mm/yy",
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 4,
      component: "InputText",
      name: "noContrato",
      defaultValue: baseG?.noContrato,
      label: "No:",
      props: {
        disabled: true, className: "disabled"
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 4,
      component: "InputText",
      name: "lugardeFirma",
      defaultValue: baseG?.lugardeFirma,
      label: "Firma:",
      props: {},
      fieldLayout: { className: "col-2" },
    },
    {
      id: 3,
      component: "Dropdown",
      name: "idPais",
      defaultValue: baseG?.pais.pais,
      label: "País:",
      props: {
        options: findAllPaises?.findAllPaises,
        optionLabel: "nomb",
        optionValue: "pais",
        filter: true,
      },
      fieldLayout: { className: "col-3" },
    },
    {
      id: 5,
      component: "Divider",
      name: "divider1",
      fieldLayout: { className: "col-12 grid-nogutter" },
    },
    {
      id: 6,
      component: "Dropdown",
      name: "idProveedor",
      defaultValue: baseG?.proveedor.codigo,
      label: "Vendedor:",
      props: {
        options: findAllProveedores?.findAllProveedores,
        optionLabel: "compaIa",
        optionValue: "codigo",
        filter: true,
        virtualScrollerOptions: { itemSize: 38 },
        onChange: (value) => {
          const prov = findAllProveedores.findAllProveedores.find(
            (item) => item.codigo === value
          );
          formRef?.current.setValues(
            "representanteVendedor",
            `-${prov.representante}\n-${prov.cargo}\n-${prov.domicilio}`
          );
        },
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 7,
      component: "Dropdown",
      name: "idComprador",
      defaultValue: baseG?.compradores.idComprador,
      label: "Comprador:",
      props: {
        options: findAllCompradores?.findAllCompradores,
        optionLabel: "representante",
        optionValue: "idComprador",
        filter: true,
        onChange: (value) => {
          const comp = findAllCompradores.findAllCompradores.find(
            (item) => item.idComprador === value
          );
          console.log(comp);
          formRef?.current.setValues(
            "representanteComprador",
            `-${comp.cargo}\n-${comp.domicilio}`
          );
        },
      },
      fieldLayout: { className: "col-6" },
    },
    {
      id: 8,
      component: "Dropdown",
      name: "idIncoterm",
      defaultValue: baseG?.incoterm.idIncoterm,
      label: "Condición de Compra:",
      props: {
        options: findAllIncoterm?.findAllIncoterm,
        optionLabel: "abreviatura",
        optionValue: "idIncoterm",
        filter: true,
      },
      fieldLayout: { className: "col-2" },
    },
    {
      id: 9,
      component: "InputTextArea",
      name: "representanteVendedor",
      defaultValue: `-${baseG?.proveedor.representante}\n-${baseG?.proveedor.cargo}\n-${baseG?.proveedor.domicilio}`,
      label: "Representante:",
      props: {
        rows: 5,
        cols: 5,
        disabled: true,
        className: "disabled textArea",
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 10,
      component: "InputTextArea",
      name: "representanteComprador",
      defaultValue: `-${baseG?.compradores.cargo}\n-${baseG?.compradores.domicilio}`,
      label: "Representante:",
      props: {
        rows: 5,
        cols: 5,
        disabled: true,
        className: "disabled textArea",
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 11,
      component: "EmptyCol",
      fieldLayout: { className: "col-4" },
    },
    {
      id: 12,
      component: "Dropdown",
      name: "tipoClausula",
      defaultValue:
        baseG?.basesGeneralesClausulas.length > 0 &&
        baseG?.basesGeneralesClausulas[0].idTipoClausula,
      label: "Tipo de Claúsula:",
      props: {
        options: baseG?.basesGeneralesClausulas,
        filter: true,
        optionLabel: "tiposDeClausulas.nombre",
        optionValue: "idTipoClausula",
        onChange: (value) => {
          formRef?.current.setValues(
            "clausula",
            baseG?.basesGeneralesClausulas.find(
              (item) => item.idTipoClausula === value
            ).clausula
          );
        },
      },
      fieldLayout: { className: "col-4" },
    },
    {
      id: 13,
      component: "Button",
      name: "button",
      defaultValue: 0,
      label: " ",
      props: {
        icon: "pi pi-plus",
        className: "p-button-rounded p-button-sm mt-5 ml-1",
        onClick: () => {
          confirmDelete();
        },
      },
    },
    {
      id: 14,
      component: "InputTextArea",
      name: "clausula",
      defaultValue:
        baseG?.basesGeneralesClausulas.length > 0
          ? baseG?.basesGeneralesClausulas[0].clausula
          : "",
      label: "Claúsula:",
      props: {
        rows: 9,
        onChange: (value) => {
          const tc = formRef?.current.getValue("tipoClausula");
          baseG.basesGeneralesClausulas.find(
            (i) => i.idTipoClausula === tc
          ).clausula = formRef?.current.getValue("clausula");
        },
      },
      fieldLayout: { className: "col-12" },
    },
  ];

  
  const [formProps, setFormProps] = useState(null);
  useEffect(() => {
    console.log("change bg")
    if (baseG) {
      setFormProps({
        data: dataStruct,
        schema: schema,
        buttonsNames: ["Guardar", "Cancelar"], //TODO Poner botones en todos los componentes en vez del texto
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseG /* , loadingComp, loadingPa, loadingProv, loadingTC, loadingInc */
  ]);

  //methods
  const confirmDelete = () => {
    confirmDialog({
      message: "Desea eliminar las claúsulas existentes?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => confirmClausula(),
    });
  };
  const confirmClausula = () => {
    confirmDialog({
      message:
        "Usted desea utilizar la Proforma Original seleccione [Si] o las \n Claúsulas del Último contrato Firmado [No]?",
      header: "Pregunta",
      style: { width: "55vh" },
      breakpoints: { "960px": "70vw", "640px": "90vw" },
      icon: "pi pi-question-circle",
      accept: () => {
        actualizarClausulasProforma({
          variables: { id: baseG.idBasesGenerales },
        }).then(({ data }) => {
          if (data) {
            baseG.basesGeneralesClausulas =
            data.actualizarClausulasFromBaseGeneral;
            console.log(data.actualizarClausulasFromBaseGeneral)
            setBaseG(baseG);
            formRef?.current.setValues(
              "tipoClausula",
              baseG?.basesGeneralesClausulas[0].idTipoClausula
            );
            formRef?.current.setValues(
              "clausula",
              baseG.basesGeneralesClausulas.find(
                (item) => item.idTipoClausula === baseG?.basesGeneralesClausulas[0].idTipoClausula
              ).clausula
            );
          }
        });
      },
      reject: () => {
        getClausulas({
          variables: {
            idIncoterm: baseG.incoterm.idIncoterm,
            idProveedor: baseG.proveedor.codigo,
          },
        }).then(({ data }) => {
          if (data) {
            const value = formProps["data"][11].defaultValue;
            baseG.basesGeneralesClausulas = data.getClausulasFromBaseGeneral;
            setBaseG(baseG);
            //actualizar campo que se visualiza
            formRef?.current.setValues(
              "clausula",
              baseG.basesGeneralesClausulas.find(
                (item) => item.idTipoClausula === value
              ).clausula
            );
          }
        });
      },
    });
  };

  const save = (element) => {
    console.log(element);
    let temp = _.omit(element, [
      "representanteComprador",
      "representanteVendedor",
      "tipoClausula",
      "clausula",
      "button",
    ]);
    temp.idProforma = baseG.idProforma;
    temp.consecutivo = baseG.consecutivo;
    temp.idBasesGenerales = baseG.idBasesGenerales;
    temp.vigencia = baseG.vigencia;
    temp.aprobado = baseG.aprobado;
    temp.cancelado = baseG.cancelado;
    temp.activo = baseG.activo;
    temp.basesGeneralesClausulas = baseG.basesGeneralesClausulas.map((i) =>
      _.omit(i, ["tiposDeClausulas"])
    );
    console.log(temp);
    updateBG({ variables: { createBasesGeneraleInput: temp } })
      .then((resp) => navigate(-1))
      .catch((error) => console.log(error));
  };


  return (
    <div>
      {!baseG && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {baseG && formProps ? (
        <div className="m-5">
          <Form
            ref={formRef}
            data={formProps.data}
            schema={formProps.schema}
            handle={save}
            cancel={() => navigate(-1)}
            buttonsNames={formProps.buttonsNames}
            formLayout={{ className: "grid" }}
          />
        </div>
      ) : undefined}
    </div>
  );
};
