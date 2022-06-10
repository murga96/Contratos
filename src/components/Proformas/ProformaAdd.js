import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useRef, useState, useEffect } from "react";
import {
  createProforma,
  selectAllIncoterm,
  selectAllTipoContrato,
  selectAllTiposDeClausulas,
  updateProformaeneral,
} from "../../database/GraphQLStatements";
import { Form } from "../ui/Form";
import * as yup from "yup";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

export const ProformaAdd = () => {
  const formRef = useRef();
  const [proforma, setProforma] = useState(null);
  const navigate = useNavigate();
  const [formProps, setFormProps] = useState(null);
  const [updateProforma] = useMutation(createProforma);
  const { data: findAllTipoContrato, loading: loadingTC } = useQuery(
    selectAllTipoContrato
  );
  const { data: findAllIncoterm, loading: loadingInc } =
    useQuery(selectAllIncoterm);

  useEffect(() => {
    console.log("first render");
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    setProforma({
      // idProforma: null,
      idTipoContrato: null,
      idIncoterm: null,
      tipoDeContrato: null,
      incoterm: null,
      activa: false,
      cMarcoF: false,
    });
  };
  let dataStruct = null;

  const save = (element) => {
    console.log(element);
    let temp = _.omit(element, ["tipoClausula", "clausula", "button"]);

    temp.proformaClausulas = _.map(proforma.proformaClausulas, (i) => {
      // delete i.tiposDeClausulas
      // delete i.idProforma
      // const idTC = findAllTipoContrato.findAllTipoContrato.find((it) => it.tipoContrato==="EXCEPCIONAL")?.idTipoContrato
      // if(idTC) {
      //   i.excepcional = proforma.idTipoContrato === idTC ? true : false
      // }else {
      //   i.excepcional = false
      // }
      // return i
    });
    console.log(temp);
    updateProforma({ variables: { createProformaInput: temp } }).then((resp) =>
      navigate(-1)
    );
  };

  useEffect(() => {
    console.log("proforma change");
    if (proforma) {
      const schema = yup.object().shape({
        idTipoContrato: yup
          .number()
          .typeError("Seleccione un tipo de contrato")
          .required("Seleccione un tipo de contrato"),
        nombreProfoma: yup.string().required("Nombre es requerido"),
        activa: yup.boolean(),
        cMarcoF: yup.boolean(),
        idIncoterm: yup.number().required("Seleccione una condición de compra"),
        tipoClausula: yup
          .number()
          .typeError("Debe seleccionar los tipos de clausula"),
      });
      dataStruct = [
        {
          id: 1,
          component: "InputText",
          name: "nombreProfoma",
          defaultValue: proforma?.nombreProfoma,
          label: "Nombre:",
          fieldLayout: { className: "col-4" },
        },
        {
          id: 1,
          component: "Dropdown",
          name: "idTipoContrato",
          defaultValue: proforma?.tipoDeContrato,
          label: "Tipo de contrato*:",
          props: {
            options: findAllTipoContrato?.findAllTipoContrato,
            optionLabel: "tipoContrato",
            optionValue: "idTipoContrato",
            placeholder: "Seleccione un tipo de contrato",
            filter: true,
          },
          fieldLayout: { className: "col-4" },
        },
        {
          id: 8,
          component: "Dropdown",
          name: "idIncoterm",
          defaultValue: proforma?.incoterm?.idIncoterm,
          label: "Condición de Compra:",
          props: {
            options: findAllIncoterm?.findAllIncoterm,
            optionLabel: "abreviatura",
            optionValue: "idIncoterm",
            placeholder: "Seleccione una condición de compra",
            filter: true,
          },
          fieldLayout: { className: "col-4" },
        },
        {
          id: 9,
          component: "CheckBox",
          name: "activa",
          defaultValue: proforma?.activa,
          label: "Activa",
          fieldLayout: { className: "col-4" },
        },
        {
          id: 9,
          component: "CheckBox",
          name: "cMarcoF",
          defaultValue: proforma?.cMarcoF,
          label: "Marco financiero",
          fieldLayout: { className: "col-4" },
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
  }, [proforma, loadingTC, loadingInc]);

  return (
    <div className="flex justify-content-center h-full">
      {(!proforma || loadingTC || loadingInc) && (
        <div className="flex h-30rem justify-content-center align-items-center">
          <ProgressSpinner strokeWidth="3" />
        </div>
      )}
      {proforma && formProps && !loadingTC && !loadingInc ? (
        <div >
          <div className="m-5 p-card p-4">
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
        </div>
      ) : undefined}
    </div>
  );
};
