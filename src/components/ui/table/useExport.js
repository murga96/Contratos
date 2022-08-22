import React from "react"
import { saveAs } from "file-saver";
import logo from "../../../assets/images/logo1.png";
import pie from "../../../assets/images/piepag.png";
import { get } from "lodash";

export const useExport = (children, value, header) => {
    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
          import("jspdf-autotable").then(() => {
            const doc = new jsPDF.default(0, 0, "letter", true);
            let arr = [];
            let temp = [];
            const exportColumns = React.Children.map(children, ({props}) => {return {
        title: props.header,
        dataKey: props.field,
      }});
            value.map((index) => {
              exportColumns.map((x) => {
                const havePoint = x.dataKey.split(".").length !== 0;
                if (
                  havePoint &&
                  Array.isArray(get(index, x.dataKey.split(".")[0]))
                ) {
                  const array = get(index, x.dataKey.split(".")[0]);
                  if (array.length > 0) {
                    //llave del objeto
                    const objectKey = Object.keys(array[0]);
                    //Obtengo el segundo item del arreglo para mostrarlo en la cadena
                    temp.push(
                      array
                        .map((i) =>
                          Object.keys(i).length === 1
                            ? i[objectKey][Object.keys(i[objectKey])[1]]
                            : i[Object.keys(i)[1]]
                        )
                        .toString()
                    );
                  }
                } else {
                  temp.push(get(index, x.dataKey));
                }
              });
              arr.push(temp);
              temp = [];
            });
            doc.autoTableSetDefaults(
              {
                headStyles: { fillColor: "#ed2939" }, // Purple
              },
              doc
            );
            doc.autoTable({
              head: [exportColumns.map((i) => i.title)],
              startY: doc.autoTable() + 50,
              margin: { horizontal: 10 },
              styles: { overflow: "linebreak" },
              bodyStyles: { valign: "top" },
              theme: "striped",
              showHead: "everyPage",
              body: arr,
              didDrawPage: function (data) {
                // Header
                doc.setFontSize(16);
                doc.setTextColor(20);
                doc.text("Listado de " + header, data.settings.margin.left, 15);
                doc.addImage(
                  logo,
                  "PNG",
                  doc.internal.pageSize.getWidth() - 20,
                  7,
                  10,
                  10,
                  "",
                  "SLOW"
                );
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.getHeight();
                doc.addImage(
                  pie,
                  "PNG",
                  0,
                  pageHeight - 25,
                  pageSize.getWidth(),
                  25,
                  "",
                  "SLOW"
                );
              },
            });
    
            doc.save(`${header}.pdf`);
          });
        });
      };
    
      const exportExcel = () => {
        import("xlsx").then((xlsx) => {
          let arr = [];
          let obj = {};
          const exportColumns = React.Children.map(children, ({props}) => {return {
            title: props.header,
            dataKey: props.field,
          }});
          value.map((v) => {
            exportColumns.map((col) => {
              const havePoint = col.dataKey.split(".").length !== 0;
              if (havePoint && Array.isArray(get(v, col.dataKey.split(".")[0]))) {
                const array = get(v, col.dataKey.split(".")[0]);
                if (array.length > 0) {
                  //llave del objeto
                  const objectKey = Object.keys(array[0]);
                  //Obtengo el segundo item del arreglo para mostrarlo en la cadena
                  obj[col.title] = array
                    .map((i) =>
                      Object.keys(i).length === 1
                        ? i[objectKey][Object.keys(i[objectKey])[1]]
                        : i[Object.keys(i)[1]]
                    )
                    .toString();
                }
              } else {
                obj[col.title] = get(v, col.dataKey);
              }
            });
            arr.push(obj);
            obj = {};
          });
          const worksheet = xlsx.utils.json_to_sheet(arr);
          const workbook = { Sheets: { Datos: worksheet }, SheetNames: ["Datos"] };
          const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          saveAsExcelFile(excelBuffer, header);
        });
      };
    
      const saveAsExcelFile = (buffer, fileName) => {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });
        saveAs(data, fileName + EXCEL_EXTENSION);
      };

      return { exportPdf, exportExcel }
    
}