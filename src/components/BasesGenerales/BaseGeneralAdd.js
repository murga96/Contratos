import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import { confirmDialog } from "primereact/confirmdialog";
import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  actualizarClausulasFromBaseGeneral,
  getClausulasFromBaseGeneral,
  selectAllCompradores,
  selectAllIncoterm,
  selectAllPaises,
  selectAllProveedores,
  selectAllTipoContrato,
  selectOneBasesGenerales,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";

export const BaseGeneralAdd = () => {
  const bg = useParams();
  const formRef = useRef();
  const [baseG, setBaseG] = useState(null);
  const [formProps, setFormProps] = useState(null);
  const [dataBG, respBG] = useLazyQuery(selectOneBasesGenerales);
  const [actualizarClausulasProforma] = useMutation(actualizarClausulasFromBaseGeneral);
  const { data: findAllTipoContrato } = useQuery(selectAllTipoContrato);
  const { data: findAllPaises } = useQuery(selectAllPaises);
  const { data: findAllProveedores } = useQuery(selectAllProveedores);
  const { data: findAllCompradores } = useQuery(selectAllCompradores);
  const { data: findAllIncoterm } = useQuery(selectAllIncoterm);
  useEffect(() => {
    console.log("first render");
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    dataBG({
      variables: { idBasesG: parseInt(bg.BaseGeneral) },
    }).then((resp) => {
      setBaseG(JSON.parse(JSON.stringify(resp.data.findOneBasesGenerales)));
    });
  };

  useEffect(() => {
    console.log("baseG change");
    if (baseG) {
      const schema = yup.object().shape({
        tipoContrato: yup.string().required("Tipo de contrato es requerido"),
        encabezado: yup.string().required("Encabezado es requerido"),
        ambasPartes: yup.string().required("Ambas partes es requerido"),
        visible: yup.boolean(),
      });
      let dataStruct = [
        {
          id: 1,
          component: "Dropdown",
          name: "tipoContrato",
          defaultValue: 0,
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
          fieldLayout: { className: "col-3" },
        },
        {
          id: 3,
          component: "Dropdown",
          name: "pais",
          defaultValue: baseG.pais.pais,
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
          id: 4,
          component: "InputText",
          name: "firma",
          defaultValue: baseG.lugardeFirma,
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
          name: "vendedor",
          defaultValue: baseG.proveedor.codigo,
          label: "Vendedor:",
          props: {
            options: findAllProveedores?.findAllProveedores,
            optionLabel: "compaIa",
            optionValue: "codigo",
            filter: true,
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
          name: "comprador",
          defaultValue: baseG.compradores.idComprador,
          label: "Comprador:",
          props: {
            options: findAllCompradores?.findAllCompradores,
            optionLabel: "representante",
            optionValue: "idComprador",
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
          name: "condCompra",
          defaultValue: baseG.incoterm.idIncoterm,
          label: "Condición de Compra:",
          props: {
            options: findAllIncoterm?.findAllIncoterm,
            optionLabel: "abreviatura",
            optionValue: "idIncoterm",
          },
          fieldLayout: { className: "col-2" },
        },
        {
          id: 9,
          component: "InputTextArea",
          name: "representanteVendedor",
          defaultValue: `-${baseG.proveedor.representante}\n-${baseG.proveedor.cargo}\n-${baseG.proveedor.domicilio}`,
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
          defaultValue: `-${baseG.compradores.cargo}\n-${baseG.compradores.domicilio}`,
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
            baseG.basesGeneralesClausulas.length > 0 &&
            baseG.basesGeneralesClausulas[0].idTipoClausula,
          label: "Tipo de Claúsula:",
          props: {
            options: baseG.basesGeneralesClausulas,
            filter: true,
            optionLabel: "tiposDeClausulas.nombre",
            optionValue: "idTipoClausula",
            onChange: (value) => {
              formRef?.current.setValues(
                "clausula",
                baseG.basesGeneralesClausulas.find(
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
            baseG.basesGeneralesClausulas.length > 0
              ? baseG.basesGeneralesClausulas[0].clausula
              : "",
          label: "Claúsula:",
          props: { rows: 15 },
          fieldLayout: { className: "col-12" },
        },
      ];
      console.log(dataStruct, "dataStruct");
      setFormProps({
        data: dataStruct,
        schema: schema/*  , "handle": save */,
        // variables: { tipoContrato: {} },
        buttonsNames: ["Guardar", "Cancelar"], //TODO Poner botones en todos los componentes en vez del texto
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseG]);

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
        actualizarClausulasProforma({variables: {id: baseG.idBasesGenerales}}).then( ({data}) => {
          if(data){
            const value = formProps['data'][11].defaultValue
            baseG.basesGeneralesClausulas = data.actualizarClausulasFromBaseGeneral
            setBaseG(baseG)
            //actualizar campo que se visualiza
            formRef?.current.setValues(
              "clausula",
              baseG.basesGeneralesClausulas.find(
                (item) => item.idTipoClausula === value
              ).clausula)
          }
        })        
      },
      reject: () => {
        getClausulasFromBaseGeneral({variables: {idIncoterm: baseG.incoterm.idIncoterm, idProveedor: baseG.proveedor.codigo}}).then( ({data}) => {
          if(data){
            const value = formProps['data'][11].defaultValue
            baseG.basesGeneralesClausulas = data.getClausulasFromBaseGeneral
            setBaseG(baseG)
            //actualizar campo que se visualiza
            formRef?.current.setValues(
              "clausula",
              baseG.basesGeneralesClausulas.find(
                (item) => item.idTipoClausula === value
              ).clausula)
          }
        }) 
      },
    });
  };
  console.log("render");
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
            // handle={saveElement}
            // cancel={hideEditDialog}
            buttonsNames={formProps.buttonsNames}
            formLayout={{ className: "grid" }}
          />
        </div>
      ) : undefined}
    </div>
  );
};
