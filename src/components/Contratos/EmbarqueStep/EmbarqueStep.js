import { Button } from "primereact/button";
import React, { useState, useRef, useEffect } from "react";
import { cloneDeep } from "lodash";
import { Dropdown } from "primereact/dropdown";
import { Embarque } from "./Embarque";

export const EmbarquesStep = ({
  contrato,
  setContrato,
  activeIndex,
  setActiveIndex,
}) => {
  console.log(contrato);
  const [embarques, setEmbarques] = useState(contrato?.embarques);
  const [selectedEmbarque, setSelectedEmbarque] = useState(null);
  const formRef = useRef(null);


  //FormPropsEmbarques
  const handleNext = async (e) => {
    if (await formRef.current?.trigger()) {
      console.log(embarques);
      let temp = cloneDeep(contrato);
      contrato.embarques = embarques;
      setContrato(temp);
      //Enviar consulta
    }
  };

  const ButtonsEmbarqueComponent = () => (
    <div className="flex justify-content-end mt-3">
      <Button
        label="Anterior"
        className="mr-4"
        type="button"
        onClick={(e) => {
          setContrato({ ...contrato, embarques: [] });
          setActiveIndex(activeIndex - 1);
        }}
      />
      <Button
        className={`${embarques.length === 0 && "p-disabled"}`}
        label="Siguiente"
        onClick={handleNext}
      />
    </div>
  );

  const addEmbarque = async () => {
    //Garantizar que al introducir un embarque que no sea el inicial hayas inroducido todos los datos
    if (embarques.length > 0) {
      formRef.current.submit()
      if(!(await formRef.current.trigger()))
        return;
    }
    let temp = { numero: embarques.length + 1}
    setEmbarques([...embarques, temp]);
    setSelectedEmbarque(temp)
  };
  const removeEmbarque = () => {
    setEmbarques((current) =>
      current.filter((emb) => emb.numero !== selectedEmbarque.numero)
    );
  };
  const onChangeEmbarque = async (e) => {
    if (await formRef.current.trigger()) {
      console.log('cambio')
    setSelectedEmbarque(e.target.value);
      // formRef.current.submit()
    }
  };
  console.log(embarques);
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
          onClick={addEmbarque}
        />
        {embarques.length > 0 && (
          <Button
            className="p-button-sm p-button-rounded"
            icon="pi pi-minus"
            onClick={removeEmbarque}
          />
        )}
      </div>
      {selectedEmbarque && (
        <Embarque
          embarque={selectedEmbarque}
          setEmbarques={setEmbarques}
          ref={formRef}
        />
      )}

      <ButtonsEmbarqueComponent />
    </div>
  );
};
