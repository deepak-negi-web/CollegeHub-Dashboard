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

  const onChangeHandler = (e, id) => {
    const { name, value } = e.target;
    if (name === "eligibility") {
      console.log([{ id, value }]);
      setEligibilityList((prev) => {
        const prevValueById = prev.find((el) => el.id === id);
        if (prevValueById) {
          prevValueById.value = value;
          return [...prev];
        } else {
          return [...prev, { id, value }];
        }
      });
    } else if (name === "stream") {
      setStreamList((prev) => {
        const prevValueById = prev.find((el) => el.id === id);
        if (prevValueById) {
          prevValueById.value = value;
          return [...prev];
        } else {
          return [...prev, { id, value, hasStream: true }];
        }
      });
    }
  };

  const checkboxHandler = (id) => {
    setStreamList((prev) => {
      const prevStreams = prev;
      const prevValueByIdIndex = prev.findIndex((el) => el.id === id);
      if (prevValueByIdIndex !== -1) {
        prevStreams[prevValueByIdIndex] = {
          ...prevStreams[prevValueByIdIndex],
          hasStream: !prevStreams[prevValueByIdIndex].hasStream,
        };
        return [...prevStreams];
      } else {
        return [...prev, { id, value: "", hasStream: true }];
      }
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
                    placeholder="Enter fee"
                    ref={feeRef}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Course type</Form.Label>
                  <Form.Control as="select" ref={feesDurationTypeRef}>
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
                    onKeyDown={(e) => onChangeHandler(e, course?.id)}
                    value={
                      eligibilityList.find(
                        (eligibility) => eligibility?.id === course?.id
                      )?.value
                    }
                  />
                </Form.Group>
                <Form.Group className="ml-2">
                  <Form.Label>hasStream</Form.Label>
                  <br />
                  <Form.Check
                    inline
                    type="checkbox"
                    checked={
                      streamList.find((stream) => stream?.id === course?.id)
                        ?.hasStream || false
                    }
                    onChange={() => checkboxHandler(course?.id)}
                  />
                </Form.Group>
                {(streamList.find((stream) => stream?.id === course?.id)
                  ?.hasStream ||
                  false) && (
                  <Form.Group className="ml-2">
                    <Form.Label>Streams</Form.Label>
                    <Form.Control
                      type="text"
                      name="stream"
                      placeholder="Enter streams"
                      onChange={(e) => onChangeHandler(e, course?.id)}
                      onKeyDown={(e) => onChangeHandler(e, course?.id)}
                      value={
                        streamList.find((stream) => stream?.id === course?.id)
                          ?.value
                      }
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
