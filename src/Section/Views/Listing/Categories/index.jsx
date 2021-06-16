import React from "react";
import { useSubscription } from "@apollo/client";
import { ReactTabulator } from "react-tabulator";
import { Wrapper, ListItem } from "./styles";
import tableOptions from "../../../../tableOptions";
import { CATEGORIES } from "../../../../GraphQl";
export default function Categories() {
  const {
    data: { courses_courseCategory: categories = [] } = {},
    loading,
    error,
  } = useSubscription(CATEGORIES);

  const columns = [
    {
      title: "Category Title",
      field: "title",
      headerFilter: true,
      cssClass: "rowClick",
      hozAlign: "left",
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
  }
  return (
    <Wrapper>
      <h1 className="heading">Category Listing</h1>
      {/* {categories.map((category) => {
        return <ListItem key={category?.title}>{category?.title}</ListItem>;
      })} */}
      <ReactTabulator
        columns={columns}
        data={categories}
        options={{
          ...tableOptions,
          placeholder: "No Categories Available Yet !",
        }}
        // ref={tableRef}
      />
    </Wrapper>
  );
}
