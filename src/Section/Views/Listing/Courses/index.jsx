import React, { useState } from "react";
import { useSubscription } from "@apollo/client";
import { ReactTabulator } from "react-tabulator";
import { Wrapper } from "./styles";
import tableOptions from "../../../../tableOptions";
import { COURSES } from "../../../../GraphQl";
export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useSubscription(COURSES, {
    onSubscriptionData: ({
      subscriptionData: { data: { courses_courses = [] } = {} } = {},
    } = {}) => {
      const result = courses_courses.map((course) => {
        return {
          id: course?.id,
          duration: course?.duration,
          name: course?.name,
          category: course?.courses_courseCategory?.courseCategoryTitle,
          type: course?.courses_courseCategory?.courseType,
        };
      });
      console.log({ result });
      setCourses(result);
      setLoading(false);
    },
  });

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
    {
      title: "Category",
      field: "category",
      headerFilter: true,
      hozAlign: "left",
    },
    {
      title: "Type",
      field: "type",
      headerFilter: true,
      hozAlign: "left",
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) {
    setLoading(false);
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
        />
      )}
    </Wrapper>
  );
}
