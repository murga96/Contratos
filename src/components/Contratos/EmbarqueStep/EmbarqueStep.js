import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import React, { useState, useRef } from "react";
import { Form } from "../../ui/Form";
import * as yup from "yup";
import { cloneDeep } from "lodash";

export const EmbarqueStep = ({
  contrato,
  setContrato,
  activeIndex,
  setActiveIndex,
}) => {
  console.log(contrato);
  const [activeIndexAcordion, setActiveIndexAcordion] = useState(0);
  const [embarquesObj, setEmbarquesObj] = useState(cloneDeep(contrato?.embarques));
  //FormPropsEmbarques
  const handleEmbarques = (data) => {
    contrato.embarques.push(data);
    // embarquesObj.push(data);
    setContrato(cloneDeep(contrato));
  };
  const [dataStruct, setDataStruct] = useState([
    {
      id: 12,
      component: "InputText",
      name: "test",
      defaultValue: embarquesObj[embarquesObj?.length - 1]?.test,
      label: "Test:",
    },
  ]);
  const schemaE = yup.object().shape({
    test: yup.string().required("Seleccione una moneda"),
  });

  const ButtonsEmbarqueComponent = () => (
    <div className="flex justify-content-end mt-3">
      <Button
        label="Anterior"
        className="mr-4"
        type="button"
        onClick={(e) => {
          setActiveIndex(activeIndex - 1);
        }}
      />
      <Button label="Siguiente" type="submit" />
    </div>
  );
  const [embarques, setEmbarques] = useState([
    {
      ref: useRef(null),
      form: {
        data: dataStruct,
        schema: schemaE,
        handle: handleEmbarques,
        buttonsNames: [],
      },
    },
  ]);

  const addEmbarque = () => {
    embarquesObj.push({ test: "test " + embarquesObj?.length });
    setContrato(cloneDeep(contrato));
    setActiveIndexAcordion(embarquesObj?.length - 1)
    setDataStruct(dataStruct)
    embarques.push({
      ref: React.createRef(null),
      form: {
        data: dataStruct,
        schema: schemaE,
        handle: (data) => console.log(data),
        buttonsNames: [],
      },
    });
    setEmbarques(cloneDeep(embarques));
  };

  const accordionTabChange = async (e) => {
    let c = true;
    // await embarques[activeIndexAcordion].ref.current?.handleSubmit(
    //   handleEmbarques,
    //   (e) => {
    //     c = false;
    //   }
    // );
    if (c) setActiveIndexAcordion(e.index);
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-end my-3">
        <Button label="Añadir" className="mr-3" onClick={addEmbarque} />
        <Button label="Eliminar" />
      </div>
      <Accordion
        activeIndex={activeIndexAcordion}
        onTabChange={accordionTabChange}
      >
        {embarques.map((embarque, j) => (
          <AccordionTab header={`Embarque ${j + 1}`}>
            <Form
              ref={embarque.ref}
              data={embarque.form?.data}
              schema={embarque.form?.schema}
              handle={embarque.form?.handle}
              buttonsNames={embarque.form?.buttonsNames}
              formLayout={{ className: "grid" }}
            />
          </AccordionTab>
        ))}
      </Accordion>
      <ButtonsEmbarqueComponent />
    </div>
  );
};
