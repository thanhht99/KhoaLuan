import React from "react";
import { CSVLink } from "react-csv";
import { Button } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";

export const ExportReactCSV = ({ csvData, fileName }) => {
  return (
    <CSVLink data={csvData} filename={fileName}>
      <Button
        type="primary"
        size="small"
        icon={<FileExcelOutlined />}
        style={{ backgroundColor: "#1f6e43", marginLeft: "20px" }}
        className={"btn-Reload-Page-List-Of-Products"}
      >
        Export
      </Button>
    </CSVLink>
  );
};
