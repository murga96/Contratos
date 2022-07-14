import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useRef, useState, useEffect } from "react";
import {
  selectAllCompradores,
  selectAllIncoterm,
  selectAllPaises,
  selectAllProveedores,
  selectAllTipoContrato,
  updateBaseGeneral,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export const BaseGeneralAdd = () => {
  const formRef = useRef();
  const [baseG, setBaseG] = useState(null);
  const navigate = useNavigate();
  const [formProps, setFormProps] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [updateBG] = useMutation(updateBaseGeneral);
  // const { data: findAllProforma, loading:loadingP } = useQuery(selectAllProforma);
  const { data: findAllTipoContrato, loading:loadingTC } = useQuery(selectAllTipoContrato);
  const { data: findAllPaises, loading:loadingPa } = useQuery(selectAllPaises);
  const { data: findAllProveedores, loading:loadingProv } = useQuery(selectAllProveedores);
  const { data: findAllCompradores, loading:loadingComp } = useQuery(selectAllCompradores);
  const { data: findAllIncoterm, loading:loadingInc } = useQuery(selectAllIncoterm);
  console.log(findAllTipoContrato)
  useEffect(() => {
    console.log("first render");
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    setBaseG({
      // "idBasesGenerales": 36,
      // "consecutivo": 1,
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
  };
  let dataStruct = null;

  const save = (element) => {
    console.log(element);
    let temp = _.omit(element, [
      "representanteComprador",
      "representanteVendedor",
      "tipoClausula",
      "clausula",
      "button",
    ]);

    temp.idProforma =
      baseG.basesGeneralesClausulas?.length > 0 &&
      baseG.basesGeneralesClausulas[0].idProforma;
    // temp.consecutivo = baseG.consecutivo;
    temp.vigencia = 720;
    temp.aprobado = false;
    temp.cancelado = false;
    temp.activo = false;
    temp.basesGeneralesClausulas = _.map(baseG.basesGeneralesClausulas,(i) => {
      delete i.tiposDeClausulas
      delete i.idProforma
      const idTC = findAllTipoContrato.findAllTipoContrato.find((it) => it.tipoContrato==="EXCEPCIONAL")?.idTipoContrato
      if(idTC) {
        i.excepcional = baseG.idTipoContrato === idTC ? true : false
      }else {
        i.excepcional = false
      }
      return i
    });
    console.log(temp);
    updateBG({ variables: { createBasesGeneraleInput: temp } }).then((resp) => navigate(-1));
  };

  useEffect(() => {
    console.log("baseG change");
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
      dataStruct = [
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
              setEditDialog(true);
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
        schema: schema /*  , "handle": save */,
        // variables: { tipoContrato: {} },
        buttonsNames: ["Guardar", "Cancelar"], //TODO Poner botones en todos los componentes en vez del texto
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseG,loadingComp, loadingPa, loadingProv, loadingTC, loadingInc]);

  const schemaP = yup.object().shape({
    proforma: yup.object().typeError("Seleccione una proforma"),
  });

  let dataStructProforma = [
    // {
    //   id: 12,
    //   component: "Dropdown",
    //   name: "proforma",
    //   defaultValue: 0,
    //   label: "Proforma:",
    //   props: {
    //     options: findAllProforma?.findAllProforma,
    //     optionLabel: "nombreProfoma",
    //     placeholder: "Seleccione una proforma",
    //   },
    // },
  ];
  const formPropsProforma = {
    data: dataStructProforma,
    schema: schemaP /*, "handle":  updateElement, "variables": { cargo: {} } */,
    buttonsNames: ["Aceptar"],
  };
  console.log(!baseG || loadingComp || loadingPa || loadingProv || loadingTC || loadingInc, "eeeeeeeeee")
  return (
    <div>
      {(!baseG || loadingComp || loadingPa || loadingProv || loadingTC || loadingInc) && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {(baseG && formProps && !loadingComp  && !loadingPa && !loadingProv && !loadingTC && !loadingInc) ? (
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
          <Dialog
            visible={editDialog}
            style={{ width: "450px" }}
            header="Importar proforma"
            modal
            breakpoints={{ "992px": "50vw", "768px": "65vw", "572px": "80vw" }}
            resizable={false}
            onHide={() => {
              setEditDialog(false);
            }}
          >
            <Form
              data={formPropsProforma?.data}
              schema={formPropsProforma?.schema}
              handle={({ proforma }) => {
                let temp = baseG;
                temp.basesGeneralesClausulas = JSON.parse(
                  JSON.stringify(proforma.proformaClausulas)
                );
                setBaseG(temp);
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
                    disabled: baseG?.basesGeneralesClausulas ? false : true,
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
                    disabled: baseG?.basesGeneralesClausulas ? false : true,
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
                setFormProps(formProps);
                setEditDialog(false);
              }}
              cancel={() => setEditDialog(false)}
              buttonsNames={formPropsProforma?.buttonsNames}
            />
          </Dialog>
        </div>
      ) : undefined}
    </div>
  );
};
