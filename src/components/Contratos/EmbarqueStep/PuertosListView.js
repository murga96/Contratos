import React, { useState } from "react";
import { Button } from "primereact/button";
import { ListBox } from "primereact/listbox";
import { PagosForm } from "./PagosForm";
import { confirmDialog } from "primereact/confirmdialog";

export const PuertosListView = ({
  puertos,
  setPuertos,
  setVisiblePuertosForm,
}) => {
  const [selectedElements, setSelectedElements] = useState([]);
  const addPuerto = () => {
    setVisiblePuertosForm(true);
  };
  const removePuerto = () => {
    confirmDialog({
      message: "Desea eliminar el puerto seleccionado?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => setPuertos((prev) => prev.filter((p) => !selectedElements.includes(p))),
    });
  };

  const itemTemplate = (option) => {
    return (
      <div>
        {option.idPuertoOrigen.nombre} - {option.idPuertoDestino.nombre}
      </div>
    );
  };
  console.log(selectedElements, "selectedElements");
  return (
    <div className="col-6">
      <div className={puertos.length > 0 ? "flex justify-content-between" : "flex"}>
        <div className="text-xl my-3">Puertos</div>
        <div className="flex justify-content-end mb-3">
          <Button
            // className="p-button-sm mx-3 p-button-rounded"
            className={`p-button-sm p-button-success ${puertos.length > 0 ? "mr-3" : "ml-3"}`}
            type="button"
            label="Añadir"
            // icon="pi pi-plus"
            onClick={addPuerto}
          />
          {puertos.length > 0 && (
            <Button
              type="button"
              disabled={selectedElements.length === 0}
              label="Eliminar"
              // icon="pi pi-minus"
              className="p-button-sm p-button-danger"
              // className="p-button-sm mx-3 p-button-rounded"
              onClick={removePuerto}
            />
          )}
        </div>
      </div>
      {puertos.length > 0 && (
        <ListBox
          value={selectedElements}
          options={puertos}
          multiple
          onChange={(e) => setSelectedElements(e.value)}
          itemTemplate={itemTemplate}
        />
      )}
    </div>
  );
};
