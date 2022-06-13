import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useRef, useState, useEffect } from "react";
import {
  selectAllDatosEntidades,
  selectConfiguraciones,
  updateConfiguracion,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export const Configuracion = () => {
  const formRef = useRef();
  const [configuracion, setConfiguracion] = useState(null);
  const navigate = useNavigate();
  const [formProps, setFormProps] = useState(null);
  const { data: findAllConfiguracion, loading: loading } = useQuery(
    selectConfiguraciones,
    {
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        setConfiguracion(JSON.parse(JSON.stringify(data.findAllConfiguracion[0])));
      },
    }
  );
  const { data, loading: loadingDE } = useQuery(
    selectAllDatosEntidades,
    {
      fetchPolicy: "network-only",
    }
  );
  const [updateBG] = useMutation(updateConfiguracion, {
    refetchQueries: ["selectConfiguraciones"],
  });
  
  let dataStruct = null;

  const save = (element) => {
    console.log(element);
    console.log(configuracion.idEntidad)
    element.idEntidad = configuracion.idEntidad
    
    updateBG({ variables: { createConfiguracionInput: element } }).then((resp) =>
      navigate(-1)
    );
  };

  useEffect(() => {
    if (configuracion) {
      const schema = yup.object().shape({
        idEntidad: yup
          .string()
          .required("Entidad es requerida"),
        lugarFirma: yup
          .string()
          .required("Lugar de firma es requerido"),
        pathContratosPdf: yup.string().required("URL COntratos es requerido"),
        vigenciaContrato: yup.number().required("Vigencia contrato es requerida"),
        alertaVencContratos: yup.number().required("Vencimiento contrato es requerida"),
      });
      dataStruct = [
        {
          id: 1,
          component: "Dropdown",
          name: "idEntidad",
          defaultValue: configuracion?.entidad.idEntidad,
          label: "Entidad*:",
          props: {
            options: data?.findAllDatosEntidad,
            optionLabel: "nombre",
            optionValue: "idEntidad",
            placeholder: "Seleccione una entidad",
            filter:true,
          },
          fieldLayout: { className: "col-3" },
        },
        {
          id: 1,
          component: "InputText",
          name: "lugarFirma",
          defaultValue: configuracion?.lugarFirma,
          label: "Lugar de firma*:",
          fieldLayout: { className: "col-3" },
        },
        {
          id: 1,
          component: "InputText",
          name: "pathContratosPdf",
          defaultValue: configuracion?.pathContratosPdf,
          label: "URL Contratos*:",
          fieldLayout: { className: "col-3" },
        },
        {
          id: 1,
          component: "InputNumber",
          name: "vigenciaContrato",
          defaultValue: configuracion?.vigenciaContrato,
          label: "Vigencia contrato*:",
          props: {
              step: 10,
              min: 10,
              showButtons: true,
              allowEmpty: false,
              type: "int",
          },
          fieldLayout: { className: "col-3" },
        },
        {
          id: 1,
          component: "InputNumber",
          name: "alertaVencContratos",
          defaultValue: configuracion?.alertaVencContratos,
          label: "Vencimiento contrato*:",
          props: {
              step: 10,
              min: 10,
              showButtons: true,
              allowEmpty: false,
              type: "int",
          },
          fieldLayout: { className: "col-3" },
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
  }, [configuracion, loading, loadingDE]);

  return (
    <div>
      {(!configuracion || loading || loadingDE) && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {configuracion && formProps && !loading && !loadingDE ? (
        <div className="p-card p-4 m-5">
          <Form
            ref={formRef}
            data={formProps.data}
            schema={formProps.schema}
            handle={save}
            cancel={() => navigate(-1)}
            buttonsNames={formProps.buttonsNames}
            formLayout={{ className: "grid" }}
          />
        </div>
      ) : undefined}
    </div>
  );
};
