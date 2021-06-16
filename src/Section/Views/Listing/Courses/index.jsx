import React from "react";
import { useSubscription } from "@apollo/client";
import { ReactTabulator } from "react-tabulator";
import { Wrapper } from "./styles";
import tableOptions from "../../../../tableOptions";
import { COURSES } from "../../../../GraphQl";
export default function Courses() {
  const {
    data: { courses_courses: courses = [] } = {},
    loading,
    error,
  } = useSubscription(COURSES);

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
      title: "Duration(in Years)",
      field: "duration",
      width: "200",
      headerFilter: true,
      hozAlign: "left",
    },
    {
      title: "Name",
      field: "name",
      headerFilter: true,
      hozAlign: "left",
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
  }
  return (
    <Wrapper>
      <h1 className="heading">College Listing</h1>
      {Boolean(courses) && (
        <ReactTabulator
          columns={columns}
          data={courses}
          options={{
            ...tableOptions,
            placeholder: "No Courses Available Yet !",
          }}
          // ref={tableRef}
        />
      )}
    </Wrapper>
  );
}
