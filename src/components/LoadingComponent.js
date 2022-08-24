import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";
import "./Loading.css"

export const Loading = () => {
  return (
    <div
      className="flex w-full justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <ProgressSpinner strokeWidth="3" className="text-teal-500" />
    </div>
  );
};
