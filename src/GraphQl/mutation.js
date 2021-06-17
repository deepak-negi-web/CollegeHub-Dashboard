import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CREATE_CATEGORY($assets: jsonb, $title: String!) {
    insert_courses_courseCategory(objects: { title: $title, assets: $assets }) {
      returning {
        title
      }
    }
  }
`;
export const DELETE_CATEGORY = gql`
  mutation DELETE_CATEGORY($title: String!) {
    delete_courses_courseCategory_by_pk(title: $title) {
      title
    }
  }
`;
