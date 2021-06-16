import { gql } from "@apollo/client";

export const CATEGORIES = gql`
  subscription CATEGORIES {
    courses_courseCategory(order_by: { title: desc }) {
      assets
      title
    }
  }
`;
export const COLLEGES = gql`
  subscription COLLEGES {
    colleges_college(order_by: { name: asc }) {
      assets
      id
      info
      location
      metaDetails
      name
    }
  }
`;
export const COURSES = gql`
  subscription COURSES {
    courses_courses(order_by: { id: asc }) {
      id
      duration
      name
    }
  }
`;
