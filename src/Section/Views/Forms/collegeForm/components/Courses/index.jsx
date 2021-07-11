import React, { useRef, useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Badge } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Multiselect from "multiselect-react-dropdown";
import { useSubscription, useMutation } from "@apollo/client";
import { COURSES, CREATE_COLLEGE_COURSES } from "../../../../../../GraphQl";

export default function CoursesComp({ defaultCourses, collegeId }) {
  const { addToast } = useToasts();
  const courseRef = useRef("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const {
    data: { courses_courses: courses = [] } = {},
    loading: isCoursesLoading,
    error: coursesError,
  } = useSubscription(COURSES);

  const [addCoursesToCollege, { loading: isAddingCourses }] = useMutation(
    CREATE_COLLEGE_COURSES,
    {
      onCompleted: () => {
        console.log("Course Added successfully!");
        addToast("Course Added successfully!", { appearance: "success" });
      },
      onError: (error) => {
        console.error(error);
        addToast("Something went wrong!", { appearance: "error" });
      },
    }
  );

  const onRemoveHandler = (data) => {
    setSelectedCourses(data);
  };
  const onSelectHandler = (data) => {
    setSelectedCourses(data);
  };

  const addHandler = () => {
    const coursesArray = selectedCourses.map((course) => {
      return {
        collegeId,
        courseId: course.id,
      };
    });
    addCoursesToCollege({
      variables: {
        objects: coursesArray,
      },
    });
  };

  useEffect(() => {
    if (defaultCourses.length > 0) {
      const selectedCoursesFromDefaultCourses = courses.filter((course) =>
        defaultCourses.includes(course.id)
      );
      setSelectedCourses(selectedCoursesFromDefaultCourses);
    }
  }, [defaultCourses]);

  if (isCoursesLoading) return <div className="loader">Loading...</div>;
  if (coursesError) {
    console.error(coursesError);
    addToast("Something went wrong!", { appearance: "error" });
  }
  return (
    <Container fluid>
      <div className="d-flex justify-content-between">
        <h5>Add Courses to the college</h5>
        <p>
          <Button
            variant="primary"
            onClick={addHandler}
            disabled={isAddingCourses}
          >
            {isAddingCourses ? "Adding..." : "Add Courses"}
          </Button>
        </p>
      </div>
      <Form.Group>
        <Form.Label>Course category</Form.Label>
        <Multiselect
          options={courses} // Options to display in the dropdown
          selectedValues={selectedCourses} // Preselected value to persist in dropdown
          onSelect={onSelectHandler} // Function will trigger on select event
          onRemove={onRemoveHandler} // Function will trigger on remove event
          displayValue="name" // Property name to display in the dropdown options
        />
      </Form.Group>
    </Container>
  );
}
