import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useState } from "react";

export const ContratoClausula = ({ contratoClausulas, selectedContratoClausula, setSelectedContratoClausula, setAddClausulaDialog }) => {
  const [contenido, setContenido] = useState(
    selectedContratoClausula?.contenido
  );
  console.log(contratoClausulas);
  useEffect(() => {
    setContenido(selectedContratoClausula?.contenido);
  }, [selectedContratoClausula]);

  

  //form ClausulasComponent
  const deleteClausula = () => {
    let index = contratoClausulas?.findIndex(
      (cc) => selectedContratoClausula === cc
    );
    contratoClausulas.splice(index, 1);
    contratoClausulas.length > 0
      ? setSelectedContratoClausula(contratoClausulas[0])
      : setSelectedContratoClausula(null);
  };
  

 
  return (
    <div className="grid w-full">
      <div className="col-4">
        <label className="block text-900 font-medium mb-2">
          Tipo de cláusula:
        </label>
        <Dropdown
          className="w-full"
          onChange={(e) => {
            setSelectedContratoClausula(e.target.value);
          }}
          value={selectedContratoClausula}
          options={contratoClausulas}
          optionLabel="tipoClausula.nombre"
          placeholder="Seleccione un tipo de cláusula "
          filter
          disabled={contratoClausulas.length === 0}
        />
      </div>
      <div className="col-1 flex align-items-end justify-content-between">
        <Button
          className="p-button-rounded"
          icon="pi pi-plus"
          type="button"
          tooltip="Adicionar cláusula"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => setAddClausulaDialog(true)}
        />
        {contratoClausulas.length > 0 && (
          <Button
            className="p-button-rounded"
            icon="pi pi-minus"
            type="button"
            tooltip="Eliminar cláusula"
            tooltipOptions={{ position: "bottom" }}
            onClick={deleteClausula}
          />
        )}
      </div>
      {selectedContratoClausula && (
        <div className="col-1 col-offset-6">
          <label className="block text-900 font-medium mb-2">Orden:</label>
          <InputNumber
            className="w-full"
            step={1}
            type="int"
            allowEmpty={false}
            showButtons
            size={1}
            value={selectedContratoClausula?.noClausula}
            onValueChange={(e) => {
              selectedContratoClausula.noClausula = e.value;
              setSelectedContratoClausula(selectedContratoClausula);
            }}
          />
        </div>
      )}
      {selectedContratoClausula && (
        <div className="col-12">
          <label className="block text-900 font-medium mb-2">Cláusula:</label>
          <InputTextarea
            className="w-full"
            rows={12}
            value={contenido}
            onChange={(e) => {
              selectedContratoClausula.contenido = e.target.value;
              setSelectedContratoClausula(selectedContratoClausula);
              setContenido(e.target.value);
            }}
          />
        </div>
      )}
        
    </div>
  );
};
