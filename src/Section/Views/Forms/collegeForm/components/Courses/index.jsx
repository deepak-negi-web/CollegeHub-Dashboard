import React, { useRef, useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Badge } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Multiselect from "multiselect-react-dropdown";
import { useSubscription, useMutation } from "@apollo/client";
import { COURSES, CREATE_COLLEGE_COURSES } from "../../../../../../GraphQl";

export default function CoursesComp({ defaultCourses, collegeId }) {
  const { addToast } = useToasts();
  const courseRef = useRef("");
  const feesDurationTypeRef = useRef();
  const feeRef = useRef();
  const [eligibilityList, setEligibilityList] = useState([]);
  const [streamList, setStreamList] = useState([]);
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
    setSelectedCourses(
      data.map((el) => ({
        ...el,
        fees: null,
        eligibility: "",
        hasStreams: false,
        streams: "",
      }))
    );
  };

  const addHandler = () => {
    const coursesArray = selectedCourses.map((course) => {
      return {
        collegeId,
        courseId: course?.id,
        fees: course?.fees,
        eligibility: course?.eligibility?.split(",") || null,
        hasStreams: course?.hasStreams || false,
        streams: course?.hasStreams ? course?.streams?.split(",") : null,
      };
    });
    addCoursesToCollege({
      variables: {
        objects: coursesArray,
      },
    });
  };

  const onChangeHandler = (e, id) => {
    const { name, value } = e.target;
    if (name === "eligibility") {
      setSelectedCourses((prev) => {
        return prev.map((el) =>
          el.id === id ? { ...el, eligibility: value } : el
        );
      });
    } else if (name === "streams") {
      setSelectedCourses((prev) => {
        return prev.map((el) =>
          el.id === id ? { ...el, streams: value } : el
        );
      });
    } else if (name === "fees") {
      setSelectedCourses((prev) => {
        return prev.map((el) =>
          el.id === id
            ? {
                ...el,
                fees: {
                  ...el.fees,
                  fee: +value,
                },
              }
            : el
        );
      });
    } else if (name === "feeType") {
      setSelectedCourses((prev) => {
        return prev.map((el) =>
          el.id === id
            ? {
                ...el,
                fees: {
                  ...el.fees,
                  type: value,
                },
              }
            : el
        );
      });
    } else if (name === "hasStreams") {
      setSelectedCourses((prev) => {
        return prev.map((el) =>
          el.id === id ? { ...el, hasStreams: !Boolean(el?.hasStreams) } : el
        );
      });
    }
  };

  useEffect(() => {
    if (defaultCourses.length > 0) {
      setSelectedCourses(defaultCourses);
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
      <div>
        {selectedCourses.map((course) => {
          return (
            <div key={course?.id}>
              <h5>{course?.name}</h5>
              <div className="d-flex">
                <Form.Group>
                  <Form.Label>Course fee</Form.Label>
                  <Form.Control
                    type="number"
                    name="fees"
                    placeholder="Enter fee"
                    value={course?.fees?.fee}
                    onChange={(e) => onChangeHandler(e, course.id)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Fee type</Form.Label>
                  <Form.Control
                    name="feeType"
                    as="select"
                    value={course?.fees?.type}
                    onChange={(e) => onChangeHandler(e, course.id)}
                  >
                    <option value="monthy">monthly</option>
                    <option value="quarterly" selected>
                      quarterly
                    </option>
                    <option value="yearly">yearly</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="ml-2">
                  <Form.Label>Eligibility</Form.Label>
                  <Form.Control
                    type="text"
                    name="eligibility"
                    placeholder="Enter eligibility"
                    onChange={(e) => onChangeHandler(e, course?.id)}
                    value={course?.eligibility}
                  />
                </Form.Group>
                <Form.Group className="ml-2">
                  <Form.Label>hasStream</Form.Label>
                  <br />
                  <Form.Check
                    inline
                    name="hasStreams"
                    type="checkbox"
                    checked={course?.hasStreams}
                    onChange={(e) => onChangeHandler(e, course?.id)}
                  />
                </Form.Group>
                {course.hasStreams && (
                  <Form.Group className="ml-2">
                    <Form.Label>Streams</Form.Label>
                    <Form.Control
                      type="text"
                      name="streams"
                      placeholder="Enter streams"
                      onChange={(e) => onChangeHandler(e, course?.id)}
                      value={course?.streams}
                    />
                  </Form.Group>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
