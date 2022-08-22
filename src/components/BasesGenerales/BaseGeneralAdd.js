import React, { useRef, useState, useEffect } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  actualizarClausulasFromBaseGeneral,
  getClausulasFromBaseGeneral,
  selectAllCompradores,
  selectAllIncoterm,
  selectAllPaises,
  selectAllProformaClausulasById,
  selectAllProveedores,
  selectAllTipoContrato,
  updateBaseGeneral,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";
import _, { omit } from "lodash";
import { useNavigate } from "react-router-dom";
import { fireError } from "../utils";
import { confirmDialog } from "primereact/confirmdialog";

export const BaseGeneralAdd = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const [baseG, setBaseG] = useState(null);
  const [formProps, setFormProps] = useState(null);

  //GraphQL
  //Clausulas
  const [getProformaClausulas] = useLazyQuery(actualizarClausulasFromBaseGeneral, {
    fetchPolicy: "network-only",
  });
  const [getClausulasByIncAndProv] = useLazyQuery(getClausulasFromBaseGeneral, {
    fetchPolicy: "network-only",
  });
  //Dropdowns
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
  //Mutation
  const [updateBG] = useMutation(updateBaseGeneral);

  useEffect(() => {
    setBaseG({
      tipoDeContrato: null,
      incoterm: null,
      proveedor: null,
      pais: null,
      compradores: null,
      basesGeneralesClausulas: null,
      idIncoterm: null,
      idPais: null,
      idProveedor: null,
      idProforma: null,
      idComprador: null,
      vigencia: null,
      aprobado: false,
      cancelado: false,
      activo: false,
      lugardeFirma: "",
      fecha: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // let dataStruct = null;

  const save = (element) => {
    let temp = _.omit(element, [
      "representanteComprador",
      "representanteVendedor",
      "tipoClausula",
      "clausula",
      "button",
    ]);

    temp.vigencia = 720;
    temp.aprobado = false;
    temp.cancelado = false;
    temp.activo = false;
    temp.basesGeneralesClausulas = _.map(baseG.basesGeneralesClausulas, (i) => {
      delete i.tiposDeClausulas;
      const idTC = findAllTipoContrato.findAllTipoContrato.find(
        (it) => it.tipoContrato === "EXCEPCIONAL"
      )?.idTipoContrato;
      if (idTC) {
        i.excepcional = baseG.idTipoContrato === idTC ? true : false;
      } else {
        i.excepcional = false;
      }
      return i;
    });
    console.log(temp);
    updateBG({ variables: { createBasesGeneraleInput: temp } }).then((resp) =>
      navigate(-1)
    );
  };

  useEffect(() => {
    if (baseG) {
      const schema = yup.object().shape({
        idTipoContrato: yup
          .number()
          .typeError("Seleccione un tipo de contrato")
          .required("Seleccione un tipo de contrato"),
        fecha: yup
          .date()
          .typeError("Fecha es requerido")
          .required("Fecha es requerido"),
        idPais: yup.number().required("Seleccione un país"),
        lugardeFirma: yup.string().required("Firma es requerida"),
        idProveedor: yup.number().required("Seleccione un vendedor"),
        idComprador: yup.number().required("Seleccione un comprador"),
        idIncoterm: yup.number().required("Seleccione una condición de compra"),
        tipoClausula: yup
          .number()
          .typeError("Debe importar las claúsulas de una proforma"),
      });
      let dataStruct = [
        {
          id: 1,
          component: "Dropdown",
          name: "idTipoContrato",
          defaultValue: baseG?.tipoDeContrato,
          label: "Tipo de contrato*:",
          props: {
            options: findAllTipoContrato?.findAllTipoContrato,
            optionLabel: "tipoContrato",
            optionValue: "idTipoContrato",
            placeholder: "Seleccione un tipo de contrato",
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
            placeholder: "Seleccione una fecha",
          },
          fieldLayout: { className: "col-3" },
        },
        {
          id: 3,
          component: "Dropdown",
          name: "idPais",
          defaultValue: baseG.pais?.pais,
          label: "País:",
          props: {
            options: findAllPaises?.findAllPaises,
            optionLabel: "nomb",
            optionValue: "pais",
            filter: true,
            placeholder: "Seleccione un país",
          },
          fieldLayout: { className: "col-3" },
        },
        {
          id: 4,
          component: "InputText",
          name: "lugardeFirma",
          defaultValue: baseG?.lugardeFirma,
          label: "Firma:",
          props: {},
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
          defaultValue: baseG.proveedor?.codigo,
          label: "Vendedor:",
          props: {
            options: findAllProveedores?.findAllProveedores,
            optionLabel: "compaIa",
            optionValue: "codigo",
            filter: true,
            placeholder: "Seleccione un vendedor",
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
          defaultValue: baseG.compradores?.idComprador,
          label: "Comprador:",
          props: {
            options: findAllCompradores?.findAllCompradores,
            optionLabel: "representante",
            optionValue: "idComprador",
            placeholder: "Seleccione un comprador",
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
          defaultValue: baseG?.incoterm?.idIncoterm,
          label: "Condición de Compra:",
          props: {
            options: findAllIncoterm?.findAllIncoterm,
            optionLabel: "abreviatura",
            optionValue: "idIncoterm",
            placeholder: "Seleccione una condición de compra",
          },
          fieldLayout: { className: "col-2" },
        },
        {
          id: 9,
          component: "InputTextArea",
          name: "representanteVendedor",
          defaultValue:
            baseG?.proveedor &&
            `-${baseG?.proveedor?.representante}\n-${baseG?.proveedor?.cargo}\n-${baseG?.proveedor?.domicilio}`,
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
          defaultValue:
            baseG?.compradores &&
            `-${baseG?.compradores?.cargo}\n-${baseG?.compradores?.domicilio}`,
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
            baseG?.basesGeneralesClausulas?.length > 0 &&
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
                baseG?.basesGeneralesClausulas?.find(
                  (item) => item.idTipoClausula === value
                ).clausula
              );
            },
            disabled: baseG?.basesGeneralesClausulas ? false : true,
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
              if (
                baseG?.basesGeneralesClausulas &&
                baseG?.basesGeneralesClausulas.length > 0
              ) {
                confirmDialog({
                  message: "Desea eliminar las claúsulas existentes?",
                  header: "Confirmación",
                  icon: "pi pi-exclamation-triangle",
                  accept: () => confirmClausula(),
                });
              } else {
                confirmClausula();
              }
            },
          },
        },
        {
          id: 14,
          component: "InputTextArea",
          name: "clausula",
          defaultValue:
            baseG?.basesGeneralesClausulas?.length > 0
              ? baseG?.basesGeneralesClausulas[0].clausula
              : "",
          label: "Claúsula:",
          props: {
            rows: 15,
            disabled: baseG?.basesGeneralesClausulas ? false : true,
          },
          fieldLayout: { className: "col-12" },
        },
      ];

      setFormProps({
        data: dataStruct,
        schema: schema,
        buttonsNames: ["Guardar", "Cancelar"], //TODO Poner botones en todos los componentes en vez del texto
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseG, loadingComp, loadingPa, loadingProv, loadingTC, loadingInc]);

  const confirmClausula = () => {
    const idIncoterm = formRef?.current.getValue("idIncoterm");
    confirmDialog({
      message:
        "Usted desea utilizar la Proforma Original seleccione [Si] o las \n Claúsulas del Último contrato Firmado [No]?",
      header: "Pregunta",
      style: { width: "55vh" },
      breakpoints: { "960px": "70vw", "640px": "90vw" },
      icon: "pi pi-question-circle",
      accept: () => {
        const idTipoContrato = formRef?.current.getValue("idTipoContrato");
        if (idIncoterm !== null && idTipoContrato !== null) {
          try {
            getProformaClausulas({
              variables: {
                idTipoContrato: idTipoContrato,
                idIncoterm: idIncoterm,
              },
              onCompleted: (data) => {
                importProformasClausulas(data);
              },
            });
          } catch (error) {
            console.log(error);
            fireError("Ocurrió un error al cargar las cláusulas");
          }
        } else
          fireError(
            "Debe seleccionar un tipo de contrato y una condición de compra antes de importar las cláusulas."
          );
      },
      reject: () => {
        const idProveedor = formRef?.current.getValue("idProveedor");
        if (idIncoterm !== null && idProveedor !== null) {
          try {
            getClausulasByIncAndProv({
              variables: {
                idProveedor: idProveedor,
                idIncoterm: idIncoterm,
              },
              onCompleted: (data) => {
                importClausulasFromIncAndProv(data);
              },
            });
          } catch (error) {
            console.log(error);
            fireError("Ocurrió un error al cargar las cláusulas");
          }
        } else
          fireError(
            "Debe seleccionar un proveedor y una condición de compra antes de importar las cláusulas."
          );
      },
    });
  };

  const actualizarFormClausulas = () => {
    formProps.data[11] = {
      id: 12,
      component: "Dropdown",
      name: "tipoClausula",
      defaultValue:
        baseG?.basesGeneralesClausulas?.length > 0 &&
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
            baseG?.basesGeneralesClausulas?.find(
              (item) => item.idTipoClausula === value
            ).clausula
          );
        },
        disabled:
        !baseG?.basesGeneralesClausulas ||
        baseG?.basesGeneralesClausulas?.length === 0,
      },
      fieldLayout: { className: "col-4" },
    };
    formProps.data[13] = {
      id: 14,
      component: "InputTextArea",
      name: "clausula",
      defaultValue:
        baseG?.basesGeneralesClausulas?.length > 0
          ? baseG?.basesGeneralesClausulas[0].clausula
          : "",
      label: "Claúsula:",
      props: {
        rows: 15,
        disabled:
          !baseG?.basesGeneralesClausulas ||
          baseG?.basesGeneralesClausulas?.length === 0,
        onChange: (value) => {
          const tc = formRef?.current.getValue("tipoClausula");
          baseG.basesGeneralesClausulas.find(
            (i) => i.idTipoClausula === tc
          ).clausula = formRef?.current.getValue("clausula");
          console.log(tc, "tc");
          console.log(baseG, "bg");
        },
      },
      fieldLayout: { className: "col-12" },
    };
    formRef?.current.setValues(
      "tipoClausula",
      baseG?.basesGeneralesClausulas?.length > 0 &&
        baseG?.basesGeneralesClausulas[0].idTipoClausula
    );
    formRef?.current.setValues(
      "clausula",
      baseG?.basesGeneralesClausulas?.length > 0
        ? baseG?.basesGeneralesClausulas[0].clausula
        : ""
    );
    // setFormProps(JSON.parse(JSON.stringify(formProps)));
    // setFormProps(formProps);
  };

  const importClausulasFromIncAndProv = (data) => {
    if (data?.getClausulasFromBaseGeneral) {
      const clausulas = data?.getClausulasFromBaseGeneral.map((clausula) =>
        omit(clausula, [
          "idIncoterm",
          "idTipoContrato" /* , 'tiposDeClausulas' */,
          "idProformaClausula",
        ])
      );
      let temp = {...baseG};
      temp.basesGeneralesClausulas = JSON.parse(JSON.stringify(clausulas));
      setBaseG(temp);
      actualizarFormClausulas();
    }
  };

  const importProformasClausulas = (data) => {
    if (data?.actualizarClausulasFromBaseGeneral) {
      const clausulas = data?.actualizarClausulasFromBaseGeneral.map((clausula) =>
        omit(clausula, [
          "idIncoterm",
          "idTipoContrato" /* , 'tiposDeClausulas' */,
          "idProformaClausula",
        ])
      );
      let temp = {...baseG};
      temp.basesGeneralesClausulas = JSON.parse(JSON.stringify(clausulas));
      setBaseG(temp);
      actualizarFormClausulas();
    }
  };

  return (
    <div>
      {(!baseG ||
        loadingComp ||
        loadingPa ||
        loadingProv ||
        loadingTC ||
        loadingInc) && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {baseG &&
      formProps &&
      !loadingComp &&
      !loadingPa &&
      !loadingProv &&
      !loadingTC &&
      !loadingInc ? (
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
