import React, { useRef, useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Badge } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Multiselect from "multiselect-react-dropdown";
import { useSubscription, useMutation } from "@apollo/client";
import { COURSES, CREATE_COLLEGE_COURSES } from "../../../../../../GraphQl";
import { getBooleanKeys, getBooleanObject } from "../../../../../../utils";

export default function MetadataComp({ collegeMetaData, collegeId }) {
  const { addToast } = useToasts();
  const feesDurationTypeRef = useRef();
  const feeRef = useRef();
  const [eligibility, setEligibility] = useState("");
  const [eligibilityList, setEligibilityList] = useState([]);
  const [facility, setFacility] = useState(
    getBooleanObject(collegeMetaData.facility)
  );

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

  const checkboxHandler = (e) => {
    const checked = e.target.checked;
    const name = e.target.name;
    setFacility((prev) => {
      return {
        ...prev,
        [name]: checked,
      };
    });
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "eligibility") {
      setEligibility(value);
      if (e.key === "Enter" || e.keyCode === 13) {
        setEligibility("");
        setEligibilityList((prev) => [...prev, value]);
      }
      console.log({ code: e.keyCode });
    }
  };

  //   const addHandler = () => {
  //     const coursesArray = selectedCourses.map((course) => {
  //       return {
  //         collegeId,
  //         courseId: course.id,
  //       };
  //     });
  //     addCoursesToCollege({
  //       variables: {
  //         objects: coursesArray,
  //       },
  //     });
  //   };

  //   useEffect(() => {
  //     if (defaultCourses.length > 0) {
  //       const selectedCoursesFromDefaultCourses = courses.filter((course) =>
  //         defaultCourses.includes(course.id)
  //       );
  //       setSelectedCourses(selectedCoursesFromDefaultCourses);
  //     }
  //   }, [defaultCourses]);

  //   if (isCoursesLoading) return <div className="loader">Loading...</div>;
  //   if (coursesError) {
  //     console.error(coursesError);
  //     addToast("Something went wrong!", { appearance: "error" });
  //   }
  return (
    <Container fluid>
      <div className="d-flex justify-content-between">
        <h5>Add college meta data</h5>
        <p>
          <Button
            variant="primary"
            // onClick={addHandler}
            disabled={isAddingCourses}
          >
            {isAddingCourses ? "Adding..." : "Add metadata"}
          </Button>
        </p>
      </div>
      <Row>
        <Form.Group>
          <Form.Label>Course fee</Form.Label>
          <Form.Control type="number" placeholder="Enter fee" ref={feeRef} />
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
      </Row>
      <Form.Group>
        <Form.Label> Facility</Form.Label>
        <br />
        {getBooleanKeys(collegeMetaData.facility).map((key, index) => {
          return (
            <Form.Check
              key={key}
              inline
              label={key}
              name={key}
              type="checkbox"
              id={index}
              checked={facility[key]}
              onChange={checkboxHandler}
            />
          );
        })}
      </Form.Group>
      <Form.Group>
        <Form.Label>Eligibility</Form.Label>
        <Form.Control
          type="text"
          name="eligibility"
          placeholder="Enter eligibility"
          onChange={onChangeHandler}
          onKeyDown={onChangeHandler}
          value={eligibility}
        />
      </Form.Group>
    </Container>
  );
}
