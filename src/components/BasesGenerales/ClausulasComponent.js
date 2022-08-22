import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";

export const ClausulasComponent = ({
  baseGeneral,
  basesGeneralesClausulas,
  addClausula,
}) => {
  const [tipoClausula, setTipoClausula] = useState(null);
  const [clausula, setClausula] = useState(null);

  return (
    <div className="grid">
      <div className="col-4">
        <Dropdown
          value={tipoClausula}
          onChange={(e) => {
            setTipoClausula(e.target.value);
          }}
          options={basesGeneralesClausulas}
          optionLabel="tiposDeClausulas.nombre"
          //   optionValue="idTipoClausula"
          filter
          disabled={
            !baseGeneral?.basesGeneralesClausulas ||
            baseGeneral?.basesGeneralesClausulas?.length === 0
          }
        />
      </div>
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-sm mt-5 ml-1"
        onClick={addClausula}
        /* onClick={() => {
          if (
            baseGeneral?.basesGeneralesClausulas &&
            baseGeneral?.basesGeneralesClausulas.length > 0
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
        }} */
      />
      <div className="col-12">
        <InputTextarea
          value={clausula}
          onChange={(e) => setClausula(e.target.value)}
          rows={15}
          disabled={
            !baseGeneral?.basesGeneralesClausulas ||
            baseGeneral?.basesGeneralesClausulas?.length === 0
          }
        />
      </div>
    </div>
  );
};
