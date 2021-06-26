import React, { useState, useRef } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { Wrapper } from "./styles";
import tableOptions from "../../../../tableOptions";
import { DeleteIcon } from "../../../../Assets/icons";
import {
  COURSES,
  CREATE_COURSE,
  CATEGORIES,
  DELETE_COURSE,
  CREATE_COURSE_CATEGORY_LINK,
  UPDATE_COURSE,
  UPDATE_COURSE_CATEGORY_LINK,
} from "../../../../GraphQl";
export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const nameRef = useRef("");
  const durationRef = useRef(1);
  const courseCategoryRef = useRef("");
  const courseTypeRef = useRef("");
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

  const {
    data: { courses_courseCategory: categories = [] } = {},
    loading: isLoadingCategories,
    error: categoriesError,
  } = useSubscription(CATEGORIES);

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    onError: (error) => {
      console.log(error);
    },
  });

  const [createCourse, { loading: isCreatingCourse }] = useMutation(
    CREATE_COURSE,
    {
      onCompleted: () => {
        setModalShow(false);
      },
      onError: (error) => {
        setModalShow(false);
        console.log(error);
      },
    }
  );
  const [updateCourse, { loading: isUpdatingCourse }] = useMutation(
    UPDATE_COURSE,
    {
      onCompleted: () => {
        setModalShow(false);
      },
      onError: (error) => {
        setModalShow(false);
        console.log(error);
      },
    }
  );
  const [createCourseCategoryLink, { loading: isCreatingCourseCategoryLink }] =
    useMutation(CREATE_COURSE_CATEGORY_LINK, {
      onCompleted: () => {
        setModalShow(false);
      },
      onError: (error) => {
        setModalShow(false);
        console.log(error);
      },
    });
  const [updateCourseCategoryLink, { loading: isUpdatingCourseCategoryLink }] =
    useMutation(UPDATE_COURSE_CATEGORY_LINK, {
      onCompleted: () => {
        setModalShow(false);
      },
      onError: (error) => {
        setModalShow(false);
        console.log(error);
      },
    });

  const deleteHandler = (e, course) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete ${course.name} course?`)
    ) {
      deleteCourse({
        variables: {
          id: course.id,
        },
      });
    }
  };

  const rowClick = (e, cell) => {
    const { id, name, duration, category, type } = cell._cell.row.data;
    setCourseData({
      id,
      category,
    });
    setModalShow(true);
    nameRef.current.value = name;
    durationRef.current.value = duration;
    courseCategoryRef.current.value = category;
    courseTypeRef.current.value = type;
  };

  const columns = [
    {
      title: "Name",
      field: "name",
      headerFilter: true,
      hozAlign: "left",
      width: "400",
      cellClick: (e, cell) => {
        rowClick(e, cell);
      },
    },

    {
      title: "Duration(in Years)",
      field: "duration",
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
    {
      title: "Remove",
      field: "action",
      cellClick: (e, cell) => {
        e.stopPropagation();
        deleteHandler(e, cell._cell.row.data);
      },
      formatter: reactFormatter(<DeleteIcon size="20" color="#e76f51" />),
      hozAlign: "center",
      width: 150,
    },
  ];

  const closeModal = () => {
    setModalShow(false);
  };

  const createCourseHandler = async () => {
    if (!courseData) {
      const { data: { insert_courses_courses_one: course = {} } = {} } =
        await createCourse({
          variables: {
            object: {
              name: nameRef.current.value.trim(),
              duration: durationRef.current.value,
            },
          },
        });
      await createCourseCategoryLink({
        variables: {
          object: {
            courseCategoryTitle: courseCategoryRef.current.value.trim(),
            courseType: courseTypeRef.current.value.trim(),
            courseId: course?.id,
          },
        },
      });
    } else {
      await updateCourse({
        variables: {
          id: courseData?.id,
          _set: {
            name: nameRef.current.value.trim(),
            duration: durationRef.current.value,
          },
        },
      });
      await updateCourseCategoryLink({
        variables: {
          courseCategoryTitle: courseData?.category.trim(),
          courseId: courseData?.id,
          _set: {
            courseType: courseTypeRef.current.value.trim(),
            courseCategoryTitle: courseCategoryRef.current.value.trim(),
            courseId: courseData?.id,
          },
        },
      });
    }
  };

  if (loading || isLoadingCategories)
    return <div className="loader">Loading...</div>;
  if (error || categoriesError) {
    setLoading(false);
    console.error(error || categoriesError);
  }
  return (
    <Wrapper>
      <h1 className="heading">Course Listing</h1>
      <Button
        variant="primary"
        className="mb-4"
        onClick={() => setModalShow(true)}
      >
        Add Category
      </Button>
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

      <Modal
        show={modalShow}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Course name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                ref={nameRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course duration</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Duration (in year)"
                ref={durationRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course type</Form.Label>
              <Form.Control as="select" ref={courseTypeRef}>
                <option value="undergraduation">undergraduation</option>
                <option value="postgraduation">postgraduation</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Course category</Form.Label>
              <Form.Control as="select" ref={courseCategoryRef}>
                {categories.map((category) => {
                  return (
                    <option key={category?.title} value={category?.title}>
                      {category?.title}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={createCourseHandler}>
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Wrapper>
  );
}
