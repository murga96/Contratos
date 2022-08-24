import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Loading } from "../LoadingComponent";
import { confirmDialog } from "primereact/confirmdialog";
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
import { Form } from "../ui/form/Form";
import * as yup from "yup";
import moment from "moment";
import _, { cloneDeep } from "lodash";
import { Field } from "../ui/form/Field";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useFormContext } from "react-hook-form";
import { fireError, fireInfo } from "../utils";

export const BaseGeneralEdit = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const [baseG, setBaseG] = useState(null);
  let watchedFields;
  //graphql
  useQuery(selectOneBasesGenerales, {
    variables: { id: parseInt(useParams().BaseGeneral) },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setBaseG(JSON.parse(JSON.stringify(data.findOneBasesGenerales)));
    },
  });
  const [getClausulasByIdBG] = useLazyQuery(
    actualizarClausulasFromBaseGeneral,
    {
      fetchPolicy: "network-only",
    }
  );
  const [getClausulasByIncAndProv] = useLazyQuery(getClausulasFromBaseGeneral, {
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
    lugardeFirma: yup.string().required("Firma es requerida"),
    idPais: yup.number().required("Seleccione un país"),
    idProveedor: yup.number().required("Seleccione un vendedor"),
    idComprador: yup.number().required("Seleccione un comprador"),
    idIncoterm: yup.number().required("Seleccione una condición de compra"),
  });

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
        getClausulasByIdBG({
          variables: { id: baseG.idBasesGenerales },
        }).then(({ data }) => {
          if (data) {
            baseG.basesGeneralesClausulas =
              data.actualizarClausulasFromBaseGeneral;
            setBaseG(cloneDeep(baseG));
            if (baseG.basesGeneralesClausulas.length > 0) {
              formRef.current?.setValue(
                "tipoClausula",
                baseG.basesGeneralesClausulas[0]
              );
            }
          }
        });
      },
      reject: () => {
        if (watchedFields[0] && watchedFields[1]) {
          getClausulasByIncAndProv({
            variables: {
              idIncoterm: watchedFields[0],
              idProveedor: watchedFields[1],
            },
          }).then(({ data }) => {
            if (data) {
              baseG.basesGeneralesClausulas = data.getClausulasFromBaseGeneral;
              setBaseG(cloneDeep(baseG));
              if (baseG.basesGeneralesClausulas.length > 0) {
                formRef.current?.setValue(
                  "tipoClausula",
                  baseG.basesGeneralesClausulas[0]
                );
              }
            }
          });
        } else
          fireError(
            "Debe seleccionar un vendedor y una condición de compra antes de importar las cláusulas."
          );
      },
    });
  };

  const save = (element) => {
    let temp = _.omit(element, [
      "representanteComprador",
      "representanteVendedor",
      "tipoClausula",
      "clausula",
      "noContrato",
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
      .then((resp) => {
        fireInfo("La base general ha sido guardada correctamente");
        navigate(-1)
      })
      .catch((error) => console.log(error));
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
            return <Calendar showIcon dateFormat="dd/mm/yy" {...field} />;
          }}
        />
        <Field
          label="No:"
          name="noContrato"
          containerClassName="col-2"
          defaultValue={baseG?.noContrato}
          render={(field) => {
            return <InputText {...field} disabled className="disabled" />;
          }}
        />
        <Field
          label="Firma*:"
          name="lugardeFirma"
          containerClassName="col-2"
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
              />
            );
          }}
        />
        <Divider />
        <Field
          label="Vendedor*:"
          name="idProveedor"
          containerClassName="col-4"
          defaultValue={baseG?.proveedor?.codigo}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={findAllProveedores?.findAllProveedores}
                optionLabel="compaIa"
                optionValue="codigo"
                filter
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
          defaultValue={baseG?.compradores.idComprador}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={findAllCompradores?.findAllCompradores}
                optionLabel="representante"
                optionValue="idComprador"
                filter
                virtualScrollerOptions={{ itemSize: 38 }}
                onChange={(e) => {
                  const comp = e.target.value;
                  // formRef?.current.setValue(
                  //   "representanteComprador",
                  //   `-${comp?.cargo}\n-${comp?.domicilio}`
                  // );
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
          defaultValue={baseG?.idIncoterm}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={findAllIncoterm?.findAllIncoterm}
                optionLabel="abreviatura"
                optionValue="idIncoterm"
                filter
              />
            );
          }}
        />
        <Field
          label="Representante:"
          name="representanteVendedor"
          containerClassName="col-4"
          defaultValue={`-${baseG?.proveedor?.representante}\n-${baseG?.proveedor?.cargo}\n-${baseG?.proveedor?.domicilio}`}
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
          defaultValue={`-${baseG?.compradores?.cargo}\n-${baseG?.compradores?.domicilio}`}
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
                // optionValue="idTipoClausula"
                filter
                onChange={(e) => {
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
          render={(field, watch) => {
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
