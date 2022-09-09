import { useQuery } from "@apollo/client";
import { confirmDialog } from "primereact/confirmdialog";
import React, { useRef, useState, useEffect } from "react";
import {
  selectAllTiposDeClausulas,
  selectOneBasesGenerales,
} from "../../../database/GraphQLStatements";
import { Form } from "../../ui/form/Form";
import * as yup from "yup";
import { fireError } from "../../utils";
import { cloneDeep } from "lodash";
import { Button } from "primereact/button";
import { ContratoClausula } from "./ContratoClausula";
import { Dropdown } from "primereact/dropdown";
import { Field } from "../../ui/form/Field";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Loading } from "../../LoadingComponent";
import { DialogComponent } from "../../ui/dialog";


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
  const [selectedContratoClausula, setSelectedContratoClausula] = useState(
    contrato?.contratoClausulas?.length > 0 ? contrato?.contratoClausulas[0] : null
  );
  const [addClausulaDialog, setAddClausulaDialog] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (negociacion) {
      console.log(negociacion, "operacion");
      formRefA.current?.setValue("operacion", negociacion.operacion);
      formRefA.current?.setValue("idMoneda", negociacion.monedas?.idMoneda);
      formRefA.current?.trigger(["idMoneda", "operacion"])
      // formRefA.current.setValue("idIncoterm", negociacion.inco);
    }
  }, [negociacion]);

  //graphql
  const { data: dataBG} = useQuery(
    selectOneBasesGenerales,
    {
      variables: { id: parseInt(idBg) },
      fetchPolicy: "network-only",
      onCompleted: (data) =>
        formRefA?.current?.setValue(
          "noContrato",
          dataBG?.findOneBasesGenerales?.noContrato
        ),
    }
  );
  const { data: dataTC, loading: loadingTC } = useQuery(
    selectAllTiposDeClausulas
  );
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

  //FormPropsContrato
  const acceptContratoStep = (data) => {
    if (contrato?.contratoClausulas.length === 0) {
      fireError("El contrato debe tener cláusulas");
      return;
    }
    //change props
    let temp = data;
    temp.idNegociacion = data.idNegociacion.idNegociacion;
    temp.contratoClausulas = contrato?.contratoClausulas;
    temp.cancelado = false;
    temp.idPais = dataBG?.findOneBasesGenerales?.idPais;
    temp.idBasesGenerales = dataBG?.findOneBasesGenerales?.idBasesGenerales;
    //TODO Hay que poner el usuario autenticado
    temp.realizadoPor = contrato?.idEjecutivo;
    // temp.contratoClausulas = temp.contratoClausulas.map((i) => {
    //   let t = omit(i, "tipoClausula");
    //   return t;
    // });
    temp.embarques = [{ test: "Gustavo" }];
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

  
  
  const Footer = () => {
    return (
      <div className="flex justify-content-end w-full mt-4">
        <Button
          className="mr-3"
          label="Anterior"
          icon="pi pi-times"
          type="button"
          onClick={() =>
            confirmDialog({
              message:
                "¿Seguro que desea salir, no se guardará la información?",
              header: "Confirmación",
              icon: "pi pi-exclamation-triangle",
              accept: () => navigate(-1),
            })
          }
        />
        <Button label="Siguiente" icon="pi pi-check" />
      </div>
    );
  };

  
  if (loadingTC) return <Loading />;
  return (
    <div className="p-4">
      <Form
        ref={formRefA}
        schema={schemaA}
        handle={acceptContratoStep}
        containerClassName="grid"
        footer={<Footer />}
      >
        <Field
          label="No:"
          name="noContrato"
          containerClassName="col-2"
          defaultValue={dataBG?.findOneBasesGenerales?.noContrato}
          render={(field) => {
            return (
              <InputText
                {...field}
                disabled
                className={classNames(field.className, "disabled")}
              />
            );
          }}
        />
        <Field
          label="CMarco:"
          name="idCMarco"
          containerClassName="col-2"
          defaultValue={contrato?.idCMarco}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataCMarco?.findAllContratoMarco}
                optionLabel="noContratoMarco"
                optionValue="idCMarco"
                filter
                placeholder="Seleccione un Contrato Marco"
              />
            );
          }}
        />
        <Field
          label="Fecha confección*:"
          name="fechaElaboracion"
          containerClassName="col-2"
          defaultValue={contrato?.fechaElaboracion}
          render={(field) => {
            return (
              <Calendar
                showIcon
                dateFormat="dd/mm/yy"
                {...field}
                placeholder="Seleccione una fecha"
              />
            );
          }}
        />
        <Field
          label="Lugar firma:"
          name="lugarFirma"
          containerClassName="col-2"
          defaultValue={contrato?.lugarFirma}
          render={(field) => {
            return (
              <InputText
                {...field}
                disabled
                className={classNames(field.className, "disabled")}
              />
            );
          }}
        />
        <Field
          label="Firman:"
          name="firmadoPor"
          containerClassName="col-4"
          defaultValue={contrato?.firmadoPor}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataFirman?.findAllCompradores}
                optionLabel="representante"
                optionValue="idComprador"
                filter
                placeholder="Seleccione un comprador"
              />
            );
          }}
        />
        <Field
          label="Fecha Firma PI"
          name="fechaFirma"
          containerClassName="col-2"
          defaultValue={contrato?.fechaFirma}
          render={(field) => {
            return (
              <Calendar
                showIcon
                dateFormat="dd/mm/yy"
                {...field}
                placeholder="Seleccione una fecha"
              />
            );
          }}
        />
        <Field
          label="Negociación:"
          name="idNegociacion"
          containerClassName="col-2"
          defaultValue={contrato?.idNegociacion}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataN?.findAllNegociacionResumen}
                optionLabel="noNegociacion"
                filter
                placeholder="Seleccione una negociación"
                onChange={(e) => {
                  setNegociacion(e.target.value)
                  field.onChange(e.target.value)
                }}
              />
            );
          }}
        />
        <Field
          label="Operación:"
          name="operacion"
          containerClassName="col-2"
          defaultValue={""}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={[
                  { label: "Multiplicar", value: true },
                  { label: "Dividir", value: false },
                ]}
                placeholder="Seleccione una operación"
              />
            );
          }}
        />
        <Field
          label="Moneda:"
          name="idMoneda"
          containerClassName="col-2"
          defaultValue={contrato?.idMoneda}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataMoneda?.findAllMoneda}
                optionLabel="moneda"
                optionValue="idMoneda"
                placeholder="Seleccione una moneda"
              />
            );
          }}
        />
        <Field
          label="Tasa:"
          name="tasaMoneda"
          containerClassName="col-2"
          defaultValue={contrato?.tasaMoneda}
          render={(field) => {
            return (
              <InputNumber
                {...field}
                className={classNames(field.className, "mr-8")}
                step={1}
                size={1}
                min={0}
                showButtons
                allowEmpty={false}
                type="float"
              />
            );
          }}
        />
        <Field
          label="Fecha:"
          name="fechaTasa"
          containerClassName="col-2"
          defaultValue={contrato?.fechaTasa}
          render={(field) => {
            return (
              <Calendar
                showIcon
                dateFormat="dd/mm/yy"
                {...field}
                placeholder="Seleccione una fecha"
              />
            );
          }}
        />
        <Field
          label="Condición de compra:"
          name="idIncoterm"
          containerClassName="col-2"
          defaultValue={contrato?.idIncoterm}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataIncoterms?.findAllIncoterm}
                optionLabel="abreviatura"
                optionValue="idIncoterm"
                filter
                placeholder="Seleccione una Condición de Compra"
              />
            );
          }}
        />
        <Field
          label="Seguros:"
          name="empresaSeguro"
          containerClassName="col-2"
          defaultValue={contrato?.empresaSeguro}
          render={(field) => {
            return <InputText {...field} />;
          }}
        />
        <Field
          label="Naviera:"
          name="idEmpresaNaviera"
          containerClassName="col-2"
          defaultValue={contrato?.idEmpresaNaviera}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataNav?.findAllCompaniasNavieras}
                optionLabel="nombre"
                optionValue="id"
                filter
                placeholder="Seleccione una naviera"
              />
            );
          }}
        />
        <Field
          label="Ejecutivo:"
          name="idEjecutivo"
          containerClassName="col-2"
          defaultValue={contrato?.idEjecutivo}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataEjecutivos?.findAllEjecutivos}
                optionLabel="nombre"
                optionValue="idEjecutivo"
                filter
                placeholder="Seleccione un ejecutivo"
              />
            );
          }}
        />
        <Field
          label="Producto:"
          name="producto"
          containerClassName="col-12"
          defaultValue={contrato?.producto}
          render={(field) => {
            return <InputTextarea {...field} rows={4} />;
          }}
        />
        <div className="col-12 mt-3 flex justify-content-center">
          Rango de Entregas
        </div>
        <Field
          label="Lugar de Entrega:"
          name="lugarEntrega"
          containerClassName="col-2"
          defaultValue={contrato?.lugarEntrega}
          render={(field) => {
            return <InputText {...field} />;
          }}
        />
        <Field
          label="Forma:"
          name="idFormaEntrega"
          containerClassName="col-2"
          defaultValue={contrato?.idFormaEntrega}
          render={(field) => {
            return (
              <Dropdown
                {...field}
                options={dataFE?.findAllFormasEntrega}
                optionLabel="formaEntrega"
                optionValue="idFormaEntrega"
                filter
                placeholder="Seleccione una forma de entrega"
              />
            );
          }}
        />
        <Field
          label="Fecha de arribo:"
          name="fechaArribo"
          containerClassName="col-2"
          defaultValue={contrato?.fechaArribo}
          render={(field) => {
            return <Calendar {...field} showIcon dateFormat="dd/mm/yy" />;
          }}
        />
        <Field
          label="Fecha de recepción:"
          name="fechaRecepcion"
          containerClassName="col-2"
          defaultValue={contrato?.fechaRecepcion}
          render={(field) => {
            return <Calendar {...field} showIcon dateFormat="dd/mm/yy" />;
          }}
        />
        <Field
          label="Fecha de apertura:"
          name="fechaInicial"
          containerClassName="col-2"
          defaultValue={contrato?.fechaInicial}
          render={(field) => {
            return <Calendar {...field} showIcon dateFormat="dd/mm/yy" />;
          }}
        />
        <Field
          label="Fecha final:"
          name="fechaFinal"
          containerClassName="col-2"
          defaultValue={contrato?.fechaFinal}
          render={(field) => {
            return <Calendar {...field} showIcon dateFormat="dd/mm/yy" />;
          }}
        />
        <Field
          label="No. Entregas:"
          name="noEntregasParciales"
          containerClassName="col-1"
          defaultValue={contrato?.noEntregasParciales}
          render={(field) => {
            return (
              <InputNumber
                {...field}
                className={classNames(field.className, "mr-8")}
                step={1}
                size={1}
                min={0}
                showButtons
                allowEmpty={false}
                type="int"
              />
            );
          }}
        />
        <Field
          label="Financiamiento:"
          name="financiamiento"
          containerClassName="col-2"
          defaultValue={contrato?.financiamiento}
          render={(field) => {
            return (
              <InputNumber
                {...field}
                className={classNames(field.className, "mr-8")}
                step={1000}
                size={1}
                min={0}
                mode="currency"
                currency="USD"
                locale="en-US"
                minFractionDigits={4}
                showButtons
                allowEmpty={false}
                type="float"
              />
            );
          }}
        />
        <Field
          label="%:"
          name="porciento"
          containerClassName="col-2"
          defaultValue=""
          render={(field) => {
            return (
              <InputText
                {...field}
                disabled
                className={classNames(field.className, "disabled")}
              />
            );
          }}
        />
        <Field
          label="Gastos Logísticos:"
          name="gastosLogisticos"
          containerClassName="col-2"
          defaultValue={contrato?.gastosLogisticos}
          render={(field) => {
            return (
              <InputNumber
                {...field}
                className={classNames(field.className, "mr-8")}
                step={1000}
                size={1}
                min={0}
                mode="currency"
                currency="USD"
                locale="en-US"
                minFractionDigits={4}
                showButtons
                allowEmpty={false}
                type="float"
              />
            );
          }}
        />
        <div className="col-5" />
        <Field
          label="Permitir Embarques parciales:"
          name="permitirEmbarquesParciales"
          containerClassName="col-2"
          defaultValue={contrato?.permitirEmbarquesParciales}
          render={(field) => {
            return <Checkbox {...field} />;
          }}
        />
        <Field
          label="Permitir Trasbordos:"
          name="permitirTrasbordos"
          containerClassName="col-2"
          defaultValue={contrato?.permitirTrasbordos}
          render={(field) => {
            return <Checkbox {...field} />;
          }}
        />
        <Field
          label="Permitir Entregas Anticipadas:"
          name="permitirEntregas"
          containerClassName="col-2"
          defaultValue={contrato?.permitirEntregas}
          render={(field) => {
            return <Checkbox {...field} />;
          }}
        />
        <div className="col-2" />
        <Divider className="col-12 grid-nogutter" />
        <ContratoClausula
          className="col-12"
          contratoClausulas={contrato?.contratoClausulas}
          selectedContratoClausula={selectedContratoClausula}
          setSelectedContratoClausula={setSelectedContratoClausula}
          setAddClausulaDialog={setAddClausulaDialog}
        />
      </Form>
      <DialogComponent
          title="Adicionar claúsula"
          hide={() => {
            setAddClausulaDialog(false);
          }}
          visible={addClausulaDialog}
        >
          <Form schema={schemaC} handle={addClausula} containerClassName="grid">
            <Field
              label="Tipo de clausula:"
              name="tipoClausula"
              containerClassName="col-12"
              render={(field) => {
                return (
                  <Dropdown
                    {...field}
                    options={dataTC?.findAllTiposDeClausulas?.filter(
                      (pc) =>
                        contrato?.contratoClausulas?.findIndex((i) => {
                          return (
                            i.tipoClausula.idTipoClausula === pc.idTipoClausula
                          );
                        }) === -1
                    )}
                    optionLabel="nombre"
                    placeholder="Seleccione un tipo de cláusula"
                  />
                );
              }}
            />
          </Form>
        </DialogComponent>
      
    </div>
  );
};
