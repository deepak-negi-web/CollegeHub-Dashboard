import React, { useRef, useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Badge } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { useSubscription } from "@apollo/client";
import { COURSES } from "../../../../../../GraphQl";

export default function CoursesComp({ defaultCourses, collegeId }) {
  console.log({ defaultCourses, collegeId });
  const courseRef = useRef("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const {
    data: { courses_courses: courses = [] } = {},
    loading: isCoursesLoading,
    error: coursesError,
  } = useSubscription(COURSES);

  const onRemoveHandler = (data) => {
    setSelectedCourses(data);
  };
  const onSelectHandler = (data) => {
    setSelectedCourses(data);
  };

  useEffect(() => {
    if (defaultCourses.length > 0) {
      const selectedCoursesFromDefaultCourses = courses.filter((course) =>
        defaultCourses.includes(course.id)
      );
      console.log(courseRef.current);
      setSelectedCourses(selectedCoursesFromDefaultCourses);
    }
  }, [defaultCourses, courseRef]);
  if (isCoursesLoading) return <div className="loader">Loading...</div>;
  if (coursesError) {
    console.error(coursesError);
  }
  return (
    <Container fluid>
      <div className="d-flex justify-content-between">
        <h5>Add Courses to the college</h5>
        <p>
          <Button variant="primary">Add</Button>
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
