import React, { useRef, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  getClausulasFromBaseGeneral,
  selectAllCompradoresWithoutRelations,
  selectAllIncoterm,
  selectAllPaises,
  selectAllProveedores,
  selectAllTipoContrato,
  updateBaseGeneral,
} from "../../database/GraphQLStatements";
import * as yup from "yup";
import moment from "moment";
import _, { cloneDeep } from "lodash";
import { useNavigate } from "react-router-dom";
import { fireError } from "../utils";
import { confirmDialog } from "primereact/confirmdialog";
import { Loading } from "../LoadingComponent";
import { Field } from "../ui/form/Field";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Form } from "../ui/form/Form";

export const BaseGeneralAdd = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const [baseG, setBaseG] = useState({
    tipoDeContrato: null,
    incoterm: null,
    proveedor: null,
    pais: null,
    compradores: null,
    basesGeneralesClausulas: [],
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
  let watchedFields;

  //GraphQL
  //Clausulas
  // const [getClausulasByIdBG] = useLazyQuery(
  //   actualizarClausulasFromBaseGeneral,
  //   {
  //     fetchPolicy: "network-only",
  //   }
  // );
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
  const { data: findAllCompradores, loading: loadingComp } = useQuery(
    selectAllCompradoresWithoutRelations
  );
  const { data: findAllIncoterm, loading: loadingInc } =
    useQuery(selectAllIncoterm);
  //Mutation
  const [updateBG] = useMutation(updateBaseGeneral);

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
    temp.idComprador = element.idComprador.idComprador;
    temp.idProveedor = element.idProveedor.codigo;
    temp.basesGeneralesClausulas = _.map(baseG.basesGeneralesClausulas, (i) => {
      delete i.tiposDeClausulas;
      const idTC = findAllTipoContrato.findAllTipoContrato.find(
        (it) => it.tipoContrato === "EXCEPCIONAL"
      )?.idTipoContrato;
      if (idTC) {
        i.excepcional =
          baseG.tipoDeContrato.idTipoContrato === idTC ? true : false;
      } else {
        i.excepcional = false;
      }
      return i;
    });
    console.log(temp);
    updateBG({ variables: { createBasesGeneraleInput: temp } }).then((resp) =>
      confirmDialog({
        message: "La base general ha sido guardada correctamente",
        header: "Información",
        icon: "pi pi-exclamation-triangle",
        accept: () => navigate(-1),
        reject: () => navigate(-1),
        rejectClassName: "opacity-0",
      })
    );
  };

  const schema = yup.object().shape({
    idTipoContrato: yup
      .number()
      .typeError("Seleccione un tipo de contrato")
      .required("Seleccione un tipo de contrato"),
    fecha: yup
      .date()
      .typeError("Fecha es requerida")
      .required("Fecha es requerida"),
    idPais: yup
      .number()
      .required("Seleccione un país")
      .typeError("Seleccione un país"),
    lugardeFirma: yup
      .string()
      .required("Firma es requerida")
      .typeError("Firma es requerida"),
    idProveedor: yup
      .object()
      .required("Seleccione un vendedor")
      .typeError("Seleccione un vendedor"),
    idComprador: yup
      .object()
      .required("Seleccione un comprador")
      .typeError("Seleccione un comprador"),
    idIncoterm: yup
      .number()
      .required("Seleccione una condición de compra")
      .typeError("Seleccione una condición de compra"),
    tipoClausula: yup
      .object()
      .typeError("Debe importar las claúsulas de una proforma"),
  });

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
      message: "Desea utilizar las claúsulas del Último contrato Firmado?",
      header: "Pregunta",
      style: { width: "55vh" },
      breakpoints: { "960px": "70vw", "640px": "90vw" },
      icon: "pi pi-question-circle",
      accept: () => {
        const idIncoterm = watchedFields[0];
        const idProveedor = watchedFields[1];
        if (idIncoterm && idProveedor) {
          try {
            getClausulasByIncAndProv({
              variables: {
                idProveedor: idProveedor.codigo,
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
            "Debe seleccionar un vendedor y una condición de compra antes de importar las cláusulas."
          );
      },
    });
  };

  const importProformasClausulas = (data) => {
    if (data?.getClausulasFromBaseGeneral) {
      baseG.basesGeneralesClausulas = data.getClausulasFromBaseGeneral;
      setBaseG(cloneDeep(baseG));
      if (baseG.basesGeneralesClausulas.length > 0) {
        formRef.current?.setValue(
          "tipoClausula",
          baseG.basesGeneralesClausulas[0]
        );
        //en supuesto caso de que ya se haya validado el form, hay que eliminar el error manual
        formRef.current?.clearErrors("tipoClausula");
      }
    }
  };

  const Footer = () => {
    return (
      <div className="flex justify-content-end w-full mt-4">
        <Button label="Aceptar" icon="pi pi-check" />
        <Button
          className="ml-3"
          label="Cancelar"
          icon="pi pi-times"
          type="button"
          onClick={() =>
            confirmDialog({
              message:
                "¿Seguro que desea salir, no se guarderá la información?",
              header: "Confirmación",
              icon: "pi pi-exclamation-triangle",
              accept: () => navigate(-1),
            })
          }
        />
      </div>
    );
  };

  if (
    !baseG ||
    loadingComp ||
    loadingInc ||
    loadingPa ||
    loadingProv ||
    loadingTC
  )
    return <Loading />;
  return (
    <div className="m-5">
      <Form
        ref={formRef}
        schema={schema}
        handle={save}
        containerClassName="grid"
        footer={<Footer />}
      >
        <Field
          label="Tipo de contrato*:"
          name="idTipoContrato"
          containerClassName="col-3"
          defaultValue={baseG?.tipoDeContrato?.idTipoContrato}
          render={(field, watch) => {
            watchedFields = watch(
              ["idIncoterm", "idProveedor", "tipoClausula"],
              {
                idIncoterm: baseG?.idIncoterm,
                idProveedor: baseG?.proveedor?.codigo,
                tipoClausula:
                  baseG?.basesGeneralesClausulas?.length > 0 &&
                  baseG?.basesGeneralesClausulas[0],
              }
            );
            return (
              <Dropdown
                {...field}
                options={findAllTipoContrato?.findAllTipoContrato}
                optionLabel="tipoContrato"
                optionValue="idTipoContrato"
                placeholder="Seleccione un tipo de contrato"
              />
            );
          }}
        />
        <Field
          label="Fecha*:"
          name="fecha"
          containerClassName="col-2"
          defaultValue={moment(baseG?.fecha, moment.ISO_8601).toDate()}
          render={(field) => {
            return (
              <Calendar
                showIcon
                dateFormat="dd/mm/yy"
                placeholder="Seleccione una fecha"
                {...field}
              />
            );
          }}
        />
        <Field
          label="Firma*:"
          name="lugardeFirma"
          containerClassName="col-3"
          defaultValue={baseG?.lugardeFirma}
          render={(field) => {
            return <InputText {...field} />;
          }}
        />
        <Field
          label="País*:"
          name="idPais"
          containerClassName="col-3"
          defaultValue={baseG?.pais?.pais}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={findAllPaises?.findAllPaises}
                optionLabel="nomb"
                optionValue="pais"
                filter
                placeholder="Seleccione un país"
              />
            );
          }}
        />
        <Divider />
        <Field
          label="Vendedor*:"
          name="idProveedor"
          containerClassName="col-4"
          defaultValue={baseG?.proveedor}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={findAllProveedores?.findAllProveedores}
                optionLabel="compaIa"
                filter
                placeholder="Seleccione un vendedor"
                virtualScrollerOptions={{ itemSize: 38 }}
                onChange={(e) => {
                  const prov = e.target.value;
                  formRef?.current.setValue(
                    "representanteVendedor",
                    `-${prov?.representante}\n-${prov?.cargo}\n-${prov?.domicilio}`
                  );
                  field.onChange(prov);
                }}
              />
            );
          }}
        />
        <Field
          label="Comprador*:"
          name="idComprador"
          containerClassName="col-6"
          defaultValue={baseG?.compradores}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={findAllCompradores?.findAllCompradores}
                optionLabel="representante"
                filter
                placeholder="Seleccione un comprador"
                virtualScrollerOptions={{ itemSize: 38 }}
                onChange={(e) => {
                  const comp = e.target.value;
                  formRef?.current.setValue(
                    "representanteComprador",
                    `-${comp?.cargo}\n-${comp?.domicilio}`
                  );
                  field.onChange(comp);
                }}
              />
            );
          }}
        />
        <Field
          label="Condición de compra*:"
          name="idIncoterm"
          containerClassName="col-2"
          defaultValue={baseG?.incoterm?.idIncoterm}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={findAllIncoterm?.findAllIncoterm}
                optionLabel="abreviatura"
                optionValue="idIncoterm"
                filter
                placeholder="Seleccione una condición de compra"
              />
            );
          }}
        />
        <Field
          label="Representante:"
          name="representanteVendedor"
          containerClassName="col-4"
          defaultValue="" // defaultValue={`-${baseG?.proveedor?.representante}\n-${baseG?.proveedor?.cargo}\n-${baseG?.proveedor?.domicilio}`}
          render={(field) => {
            return (
              <InputTextarea
                {...field}
                rows={5}
                cols={5}
                disabled
                className="disabled textArea w-full"
              />
            );
          }}
        />
        <Field
          label="Representante:"
          name="representanteComprador"
          containerClassName="col-4"
          // defaultValue={`-${baseG?.compradores?.cargo}\n-${baseG?.compradores?.domicilio}`}
          defaultValue=""
          render={(field) => {
            return (
              <InputTextarea
                {...field}
                rows={5}
                cols={5}
                disabled
                className="disabled textArea w-full"
              />
            );
          }}
        />
        <div className="col-4" />
        <Field
          label="Tipo de Claúsula*:"
          name="tipoClausula"
          containerClassName="col-4"
          defaultValue={
            baseG?.basesGeneralesClausulas?.length > 0 &&
            baseG?.basesGeneralesClausulas[0]
          }
          render={(field) => {
            return (
              <Dropdown
                {...field}
                disabled={baseG?.basesGeneralesClausulas?.length === 0}
                options={baseG?.basesGeneralesClausulas}
                optionLabel="tiposDeClausulas.nombre"
                filter
                onChange={(e) => {
                  // formRef.current.setValue('clausula', e.target.value.clausula)
                  field.onChange(e.target.value);
                }}
              />
            );
          }}
        />
        <Button
          type="button"
          icon="pi pi-plus"
          className="p-button-rounded p-button-sm mt-5 ml-1"
          onClick={() => {
            baseG?.basesGeneralesClausulas?.length === 0
              ? confirmClausula()
              : confirmDelete();
          }}
        />
        <Field
          label="Claúsula:"
          name="clausula"
          containerClassName="col-12"
          defaultValue={
            baseG?.basesGeneralesClausulas?.length > 0
              ? baseG?.basesGeneralesClausulas[0]?.clausula
              : ""
          }
          render={(field) => {
            return (
              <InputTextarea
                {...field}
                value={watchedFields[2]?.clausula}
                rows={9}
                disabled={baseG?.basesGeneralesClausulas?.length === 0}
                className={
                  baseG?.basesGeneralesClausulas?.length === 0
                    ? "disabled textArea w-full"
                    : "w-full"
                }
                onChange={(e) => {
                  baseG.basesGeneralesClausulas.find(
                    (i) => i.idTipoClausula === watchedFields[2]?.idTipoClausula
                  ).clausula = e.target.value;
                  field.onChange(e.target.value);
                }}
              />
            );
          }}
        />
      </Form>
    </div>
  );
};
