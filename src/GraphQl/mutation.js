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

export const UPDATE_CATEGORY = gql`
  mutation UPDATE_CATEGORY(
    $title: String!
    $_set: courses_courseCategory_set_input!
  ) {
    update_courses_courseCategory(
      where: { title: { _eq: $title } }
      _set: $_set
    ) {
      returning {
        title
        assets
      }
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CREATE_COURSE($object: courses_courses_insert_input!) {
    insert_courses_courses_one(object: $object) {
      duration
      id
      name
    }
  }
`;
export const CREATE_COURSE_CATEGORY_LINK = gql`
  mutation CREATE_COURSE_CATEGORY_LINK(
    $object: courses_courses_courseCategory_insert_input!
  ) {
    insert_courses_courses_courseCategory_one(object: $object) {
      courseCategoryTitle
      courseId
      courseType
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DELETE_COURSE($id: Int!) {
    delete_courses_courses_by_pk(id: $id) {
      duration
      id
      name
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UPDATE_COURSE($id: Int!, $_set: courses_courses_set_input!) {
    update_courses_courses_by_pk(pk_columns: { id: $id }, _set: $_set) {
      duration
      id
      name
    }
  }
`;

export const UPDATE_COURSE_CATEGORY_LINK = gql`
  mutation UPDATE_COURSE_CATEGORY_LINK(
    $courseCategoryTitle: String!
    $courseId: Int!
    $_set: courses_courses_courseCategory_set_input!
  ) {
    update_courses_courses_courseCategory_by_pk(
      pk_columns: {
        courseCategoryTitle: $courseCategoryTitle
        courseId: $courseId
      }
      _set: $_set
    ) {
      courseCategoryTitle
      courseId
      courseType
    }
  }
`;
