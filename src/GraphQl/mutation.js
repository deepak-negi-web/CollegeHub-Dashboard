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

export const CREATE_COLLEGE = gql`
  mutation CREATE_COLLEGE($object: colleges_college_insert_input!) {
    insert_colleges_college_one(object: $object) {
      id
      info
      location
    }
  }
`;

export const DELETE_COLLEGE = gql`
  mutation DELETE_COLLEGE($id: Int!) {
    delete_colleges_college_by_pk(id: $id) {
      id
      name
    }
  }
`;

export const UPDATE_COLLEGE_INFO = gql`
  mutation UPDATE_COLLEGE_INFO($id: Int!, $_set: colleges_college_set_input!) {
    update_colleges_college_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      name
      location
      info
    }
  }
`;

export const CREATE_COLLEGE_COURSES = gql`
  mutation CREATE_COLLEGE_COURSES(
    $objects: [colleges_college_courses_insert_input!]!
  ) {
    insert_colleges_college_courses(
      objects: $objects
      on_conflict: {
        constraint: college_courses_collegeId_courseId_key
        update_columns: courseId
      }
    ) {
      returning {
        id
        courseId
        collegeId
      }
    }
  }
`;
