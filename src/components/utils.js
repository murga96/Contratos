import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content"


//sweetalert

const MySwal = withReactContent(Swal)

export const fireError = ( message) => {
    MySwal.fire({
        icon: "error",
        title: "Error",
        text: message,
        background: "var(--surface-b)",
        iconColor: "tomato",
        color: "var(--text-color)",
        customClass: {
          confirmButton: 'p-button',
        },
        buttonsStyling: false
      });
}
export const fireInfo = ( message) => {
  MySwal.fire({
      icon: "success",
      title: "Información",
      text: message,
      background: "var(--surface-b)",
      // iconColor: "tomato",
      color: "var(--text-color)",
      customClass:{
        confirmButton: 'p-button',
      },
      buttonsStyling: false
    });
}

//export
const loadFile = (url, callback) => {
  PizZipUtils.getBinaryContent(url, callback);
};

export const generateBGDocumentInternacional = (bg) => {
  console.log(bg);
  if (bg) {
    loadFile(
      "http://localhost:3001/streaming/base-general-internacional",
      function (error, content) {
        if (error) {
          throw error;
        }
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        const o = {
          "tipoDeContrato.encabezado": bg.tipoDeContrato.encabezado,
          "noContrato": bg.noContrato,
          "compradores.nombre": bg.compradores.nombre,
          "compradores.domicilio": bg.compradores.domicilio,
          "compradores.representante": bg.compradores.representante,
          "compradores.cargo": bg.compradores.cargo,
          "proveedor.compaIa": bg.proveedor.compaIa,
          "proveedor.domicilio": bg.proveedor.domicilio,
          "proveedor.representante": bg.proveedor.representante,
          "proveedor.cargo": bg.proveedor.cargo,
          "ambasPartes": bg.tipoDeContrato.ambasPartes,
          "basesGeneralesClausulas": bg.basesGeneralesClausulas,
          "lugardeFirma": bg.lugardeFirma,
          "dia": bg.fecha.getDate(),
          "mes": new Date().toLocaleString('es-ES', { month: 'long' }),
          "anno": bg.fecha.getFullYear(),
        };
        doc.setData(o);
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render();
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function (
                error,
                key
              ) {
                error[key] = value[key];
                return error;
              },
              {});
            }
            return value;
          }
          console.log(JSON.stringify({ error: error }, replaceErrors));

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join("\n");
            console.log("errorMessages", errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        var out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }); //Output the document using Data-URI
        saveAs(out, `${bg.noContrato}.docx`);
      }
    );
  }
};

export const generateBGDocumentNacional = (bg) => {
  console.log(bg);
  if (bg) {
    loadFile(
      "http://localhost:3001/streaming/base-general-nacional",
      function (error, content) {
        if (error) {
          throw error;
        }
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        const o = {
          "tipoDeContrato.encabezado": bg.tipoDeContrato.encabezado,
          "noContrato": bg.noContrato,
          "nombreParte": bg.tipoDeContrato?.tipoContrato.includes("Compraventa") ? "COMPRADOR" : "CLIENTE",
          "nombreOtraParte": bg.tipoDeContrato?.tipoContrato.includes("Compraventa") ? "VENDEDOR" : "SUMINISTRADOR",
          "compradores.nombre": bg.compradores.nombre,
          "compradores.domicilio": bg.compradores.domicilio,
          "compradores.representante": bg.compradores.representante,
          "compradores.cargo": bg.compradores.cargo,
          "compradores.codigoEnt": bg.compradores.entidad.codigoEnt,
          "compradores.cuentaUsd": bg.compradores.entidad.cuentaUsd,
          "compradores.agenciaUsd": bg.compradores.entidad.agenciaUsd,
          "compradores.cuentaMn": bg.compradores.entidad.cuentaMn,
          "compradores.agenciaMn": bg.compradores.entidad.agenciaMn,       
          "proveedor.compaIa": bg.proveedor.compaIa,
          "proveedor.codigo": bg.proveedor.codigo,
          "proveedor.domicilio": bg.proveedor.domicilio,
          "proveedor.representante": bg.proveedor.representante,
          "proveedor.cuentaUsd": bg.proveedor.cuentaUsd,
          "proveedor.agenciaUsd": bg.proveedor.agenciaUsd,
          "proveedor.cuentaMn": bg.proveedor.cuentaMn,
          "proveedor.agenciaMn": bg.proveedor.agenciaMn,
          "proveedor.cargo": bg.proveedor.cargo,
          "ambasPartes": bg.tipoDeContrato.ambasPartes,
          "basesGeneralesClausulas": bg.basesGeneralesClausulas,
          "lugardeFirma": bg.lugardeFirma,
          "dia": bg.fecha.getDate(),
          "mes": new Date().toLocaleString('es-ES', { month: 'long' }),
          "anno": bg.fecha.getFullYear(),
        };
        doc.setData(o);
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render();
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function (
                error,
                key
              ) {
                error[key] = value[key];
                return error;
              },
              {});
            }
            return value;
          }
          console.log(JSON.stringify({ error: error }, replaceErrors));

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join("\n");
            console.log("errorMessages", errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        var out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }); //Output the document using Data-URI
        saveAs(out, `${bg.noContrato}.docx`);
      }
    );
  }
};
