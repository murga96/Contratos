import { Button } from "primereact/button";
import React, { useState, useRef, useEffect } from "react";
import { cloneDeep } from "lodash";
import { Dropdown } from "primereact/dropdown";
import { Form } from "../../ui/form/Form";
import { Field } from "../../ui/form/Field";
import * as yup from "yup";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { PagosTable } from "./PagosTable";
import { PagosForm } from "./PagosForm";
import { PuertosForm } from "./PuertosForm";
import { PuertosListView } from "./PuertosListView";
import { fireError } from "../../utils";
import { ProductsTable } from "./ProductsTable";
import { confirmDialog } from "primereact/confirmdialog";

export const EmbarquesStep = ({
  bg,
  contrato,
  initValues,
  setActiveIndex,
  addContrato,
}) => {
  const [embarques, setEmbarques] = useState(contrato?.embarques);
  const [selectedEmbarque, setSelectedEmbarque] = useState(null);
  const [flete, setFlete] = useState(0);
  const [seguro, setSeguro] = useState(0);
  const [importe, setImporte] = useState(0);
  const [cubicaje, setCubicaje] = useState(0);
  const [bultos, setBultos] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const initEmbarque = {
    numero: embarques.length + 1,
    pagos: [],
    puertoEmbarque: [],
    contratoDesglose: [],
  };
  //Carga los pgos,productos y puertos del primer embarque si existe
  const [pagos, setPagos] = useState(
    contrato?.embarques.length > 0 ? contrato?.embarques[0].pagos : []
  );
  const [puertos, setPuertos] = useState(
    contrato?.embarques.length > 0 ? contrato?.embarques[0].puertoEmbarque : []
  );
  const [products, setProducts] = useState(
    contrato?.embarques.length > 0
      ? contrato?.embarques[0].contratoDesglose
      : []
  );
  const [visiblePagosForm, setVisiblePagosForm] = useState(false);
  const [visiblePuertosForm, setVisiblePuertosForm] = useState(false);
  const formRef = useRef(null);

  const validatingPortsAndPayments = () => {
    let message = `El embarque ${selectedEmbarque?.numero}`;
    let messages = [];
    if (pagos.length === 0 && selectedEmbarque) {
      messages.push(" debe tener al menos un pago");
    }
    if (puertos.length === 0 && selectedEmbarque) {
      messages.push(" al menos un puerto de origen y de destino");
    }
    if (products.length === 0 && selectedEmbarque) {
      messages.push("  al menos un producto embarcado");
    }
    if (messages.length > 0) fireError(message.concat(messages.join(",")));
    return messages.length === 0;
  };
  const addEmbarque = async () => {
    //Garantizar que al introducir un embarque que no sea el inicial hayas introducido todos los datos
    if (!validatingPortsAndPayments()) {
      return;
    }
    if (embarques.length > 0) {
      await formRef.current.submit();
      //si la validacion no es correcta sale del metodo
      if (!(await formRef.current.trigger())) return;
      formRef.current.resetForm();
    }
    //agrega el embarque
    let temp = initEmbarque;
    setEmbarques((prev) => [...prev, temp]);
    setSelectedEmbarque(temp);
    //resetea los form values
  };
  const removeEmbarque = () => {
    confirmDialog({
      message: "Desea eliminar el embarque actual?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setEmbarques((current) => {
          let newEmbarque = current.filter(
            (emb) => emb.numero !== selectedEmbarque.numero
          );
          if (newEmbarque.length > 0) {
            setSelectedEmbarque(newEmbarque[0]);
            populatesDataToInputs({ test: newEmbarque[0].test });
          } else {
            setSelectedEmbarque(null);
            formRef.current.resetForm();
          }
          return newEmbarque;
        });
      },
    });
  };
  const onChangeEmbarque = async (e) => {
    //valida el formulario primero
    if (!validatingPortsAndPayments()) {
      return;
    }
    if (await formRef.current.trigger()) {
      await formRef.current.submit();
      populatesDataToInputs({ test: e.target.value.test });
      setPagos([]);
      setPuertos([]);
      setSelectedEmbarque(e.target.value);
    }
  };
  const populatesDataToInputs = (fields) => {
    formRef.current.setValue("test", fields.test);
  };

  const addPayment = (data) => {
    console.log(data, "data");
    setPagos((prev) => [...prev, data]);
    setVisiblePagosForm(false);
  };
  const addPuertos = (data) => {
    console.log(data, "data");
    setPuertos((prev) => [...prev, data]);
    setVisiblePuertosForm(false);
  };
  console.log(embarques, "embarques");
  console.log(pagos, "pagos");
  console.log(puertos, "puertos");

  useEffect(() => {
    if (selectedEmbarque)
      setSelectedEmbarque((prev) => {
        let temp = cloneDeep(pagos);
        prev.pagos = temp.map((p) => {
          p.idFormaPago = p.idFormaPago.idFormaPago;
          p.idPagosApartirDe = p.idPagosApartirDe.idPartir;
          return p;
        });
        return prev;
      });
  }, [pagos, selectedEmbarque]);

  useEffect(() => {
    if (products.length > 0) {
      setImporte(
        products
          .reduce((previousValue, currentValue, index) => {
            let prev = previousValue;
            if (index === 1) {
              prev =
                previousValue?.precioPaquete *
                previousValue.cantidadCartones *
                previousValue.cantidadPorCarton;
            }
            return (
              prev +
              currentValue?.precioPaquete *
                currentValue.cantidadCartones *
                currentValue.cantidadPorCarton
            );
          })
          .toFixed(2)
      );
      setCubicaje(
        products.reduce((previousValue, currentValue, index) => {
          let prev = previousValue;
          if (index === 1) {
            prev = previousValue?.volumen;
          }
          return prev + currentValue?.volumen;
        })
      );
      setBultos(
        products.reduce((previousValue, currentValue, index) => {
          let prev = previousValue;
          if (index === 1) {
            let picos =
              previousValue.cantidadPorCarton * previousValue.packing > 1
                ? 1
                : 0;
            console.log(picos, "picos");
            prev = previousValue?.cajas + picos;
            console.log(prev, "prev");
          }
          return (
            prev +
            currentValue?.cajas +
            (currentValue.cantidadPorCarton * currentValue.packing > 1 ? 1 : 0)
          );
        })
      );
    }
  }, [products]);
  console.log(importe, "importe");

  useEffect(() => {
    if (selectedEmbarque)
      setSelectedEmbarque((prev) => {
        let temp = cloneDeep(puertos);
        prev.puertoEmbarque = temp.map((p) => {
          p.idPuertoOrigen = p.idPuertoOrigen.idPuerto;
          p.idPuertoDestino = p.idPuertoDestino.idPuerto;
          return p;
        });
        return prev;
      });
  }, [puertos, selectedEmbarque]);

  //FormPropsEmbarques
  const schema = yup.object().shape({
    fechaEntrega: yup
      .date()
      .required("Fecha de entrega es requerida")
      .typeError("Fecha de entrega es requerida"),
      c40: yup
        .number()
        .min(1, "El número de contenedores de 40' debe ser mayor que cero"),
      c20: yup
        .number()
        .min(1, "El número de contenedores de 20' debe ser mayor que cero"),
    qtyCont: yup
      .number()
      .min(1, "El número de contenedores debe ser mayor que cero").when(['c40', 'c20'], (c40, c20, schema) => {
        return c40 > 0 && c20 > 0 ? schema.max(c40 / c20) : schema.max(0);
    }),
    flete: yup.number(),
    seguro: yup.number(),
    inspeccion: yup.number(),
    otros: yup.number(),
    descuento: yup.number(),
    financiamiento: yup.number(), 
  });
  const handleNext = async (e) => {
    // if (!validatingPortsAndPayments()) {
    //   return;
    // }
    if (await formRef.current?.trigger()) {
      console.log(embarques);
      let temp = cloneDeep(contrato);
      temp.embarques = embarques;
      //Enviar consulta
      addContrato({ variables: { createContratoInput: temp } });
    }
  };
  const ButtonsEmbarqueComponent = () => (
    <div className="flex justify-content-end mt-3">
      <Button
        label="Anterior"
        className="mr-4 p-button-danger"
        type="button"
        onClick={(e) => {
          confirmDialog({
            message:
              "Desea volver a anexos, perderá los datos insertados hasta ahora?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            accept: () => setActiveIndex((prev) => prev - 1),
          });
        }}
      />
      <Button
        className={`${embarques.length === 0 && "p-disabled"}`}
        label="Siguiente"
        onClick={handleNext}
      />
    </div>
  );

  const getDescuento = () => {
    return ((importe * descuento) / 100).toFixed(3);
  };

  return (
    <div className="p-4 ">
      <div className="flex justify-content-start my-3">
        <Dropdown
          className={`${embarques.length === 0 && "p-disabled"}`}
          value={selectedEmbarque}
          onChange={onChangeEmbarque}
          options={embarques}
          optionLabel="numero"
          valueTemplate={(option) => <div>Embarque {option?.numero}</div>}
          itemTemplate={(option) => <div>Embarque {option?.numero}</div>}
        />
        <Button
          className="p-button-sm mx-3 p-button-rounded"
          icon="pi pi-plus"
          type="button"
          tooltip="Añadir"
          tooltipOptions={{ position: "bottom" }}
          onClick={addEmbarque}
        />
        {embarques.length > 0 && (
          <Button
            type="button"
            className="p-button-sm p-button-rounded p-button-danger"
            tooltip="Eliminar"
            tooltipOptions={{ position: "bottom" }}
            icon="pi pi-minus"
            onClick={removeEmbarque}
          />
        )}
      </div>
      <Divider />
      {selectedEmbarque && (
        <Form
          ref={formRef}
          defaultValues={initValues}
          schema={schema}
          handle={(data) => {
            setEmbarques((current) =>
              current.map((emb) => {
                if (emb.numero === selectedEmbarque.numero) {
                  let v = { ...emb, ...data };
                  return v;
                }
                return emb;
              })
            );
          }}
          footer={<></>}
          containerClassName="grid"
        >
          <Field
            name="fechaEntrega"
            label="Fecha de entrega:"
            containerClassName="col-2"
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
            label="Cont:"
            name="qtyCnt"
            containerClassName="col-1 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
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
            label="40'':"
            name="c40"
            containerClassName="col-1 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
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
            label="20'':"
            name="c20"
            containerClassName="col-1 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
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
            label="Flete:"
            name="flete"
            containerClassName="col-2 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => {
                    setFlete(e.value);
                    field.onChange(e.value);
                  }}
                  step={1000}
                  size={1}
                  min={0}
                  showButtons
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  minFractionDigits={2}
                  allowEmpty={false}
                  type="float"
                />
              );
            }}
          />
          <Field
            label="Seguro:"
            name="seguro"
            containerClassName="col-2 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => {
                    setSeguro(e.value);
                    field.onChange(e.value);
                  }}
                  step={1000}
                  size={1}
                  min={0}
                  showButtons
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  minFractionDigits={2}
                  allowEmpty={false}
                  type="float"
                />
              );
            }}
          />
          <Field
            label="Inspección:"
            name="inspeccion"
            containerClassName="col-1 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
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
            label="Otros:"
            name="otros"
            containerClassName="col-1 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
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
          <PagosTable
            pagos={pagos}
            setPagos={setPagos}
            setVisiblePagosForm={setVisiblePagosForm}
          />
          <PuertosListView
            puertos={puertos}
            setPuertos={setPuertos}
            setVisiblePuertosForm={setVisiblePuertosForm}
          />
          <div className="col-6" />
          <ProductsTable
            products={products}
            setProducts={setProducts}
            idProveedor={bg.idProveedor}
          />
          <Field
            label="% Descuento:"
            name="descuento"
            containerClassName="col-2 mr-3"
            render={(field, watch) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.value);
                    setDescuento(e.value);
                  }}
                  step={10}
                  size={1}
                  min={0}
                  max={100}
                  showButtons
                  suffix="%"
                  minFractionDigits={2}
                  allowEmpty={false}
                  type="float"
                />
              );
            }}
          />
          {products.length > 0 && (
            <div className="col-1" style={{ wordBreak: "break-word" }}>
              <label className="block text-900 font-medium mb-3">
                Descuento:
              </label>
              <label className="text-2xl">${getDescuento()}</label>
            </div>
          )}
          <Field
            label="Financiamiento:"
            name="financiamiento"
            containerClassName="col-2 mr-3"
            render={(field) => {
              return (
                <InputNumber
                  {...field}
                  onChange={(e) => field.onChange(e.value)}
                  step={1000}
                  size={1}
                  min={0}
                  showButtons
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  minFractionDigits={2}
                  allowEmpty={false}
                  type="float"
                />
              );
            }}
          />
          {products.length > 0 && (
            <div className="col-1" style={{ wordBreak: "break-word" }}>
              <label className="block text-900 font-medium mb-3">
                Cubicaje:
              </label>
              <label className="text-2xl">{cubicaje}</label>
            </div>
          )}
          {products.length > 0 && (
            <div className="col-1" style={{ wordBreak: "break-word" }}>
              <label className="block text-900 font-medium mb-3">
                Total bultos:
              </label>
              <label className="text-2xl">{bultos}</label>
            </div>
          )}
          {products.length > 0 && (
            <div className="col-1" style={{ wordBreak: "break-word" }}>
              <label className="block text-900 font-medium mb-3">
                Importe Total:
              </label>
              <label className="text-2xl">
                ${flete + seguro + importe - (importe * descuento) / 100}
              </label>
            </div>
          )}
          {products.length > 0 && (
            <div className="col-2" style={{ wordBreak: "break-word" }}>
              <label className="block text-900 font-medium mb-3">
                Importe:
              </label>
              <label className="text-2xl">${importe}</label>
            </div>
          )}
        </Form>
      )}
      <PagosForm
        addPayment={addPayment}
        visiblesPagosForm={visiblePagosForm}
        setVisiblePagosForm={setVisiblePagosForm}
      />
      <PuertosForm
        addPuertos={addPuertos}
        visiblesPuertosForm={visiblePuertosForm}
        setVisiblePuertosForm={setVisiblePuertosForm}
      />
      <ButtonsEmbarqueComponent />
    </div>
  );
};
