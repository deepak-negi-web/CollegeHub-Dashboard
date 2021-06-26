import React from "react";
import { useSubscription } from "@apollo/client";
import { ReactTabulator } from "react-tabulator";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { Wrapper } from "./styles";
import { DeleteIcon } from "../../../../Assets/icons";
import tableOptions from "../../../../tableOptions";
import { COLLEGES } from "../../../../GraphQl";
export default function Colleges() {
  const {
    data: { colleges_college: colleges = [] } = {},
    loading,
    error,
  } = useSubscription(COLLEGES);

  const columns = [
    {
      title: "Id",
      field: "id",
      width: "100",
      headerFilter: true,
      cssClass: "rowClick",
      hozAlign: "left",
    },
    {
      title: "Name",
      field: "name",
      width: "300",
      headerFilter: true,
      hozAlign: "left",
    },
    {
      title: "Location",
      field: "location",
      headerFilter: true,
      hozAlign: "left",
    },
  ];

  if (loading) return <div className="loader">Loading...</div>;
  if (error) {
    console.error(error);
  }
  return (
    <Wrapper>
      <h1 className="heading">College Listing</h1>
      <Button variant="primary" className="mb-4">
        Add Category
      </Button>
      {Boolean(colleges) && (
        <ReactTabulator
          columns={columns}
          data={colleges}
          options={{
            ...tableOptions,
            placeholder: "No Colleges Available Yet !",
          }}
          // ref={tableRef}
        />
      )}
    </Wrapper>
  );
}
