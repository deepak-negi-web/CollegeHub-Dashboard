import React, { useRef, useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Badge } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import Multiselect from "multiselect-react-dropdown";
import { useSubscription, useMutation } from "@apollo/client";
import { UPDATE_COLLEGE_INFO } from "../../../../../../GraphQl";
import {
  getBooleanKeys,
  getBooleanObject,
  getStringObject,
  getStringKeys,
} from "../../../../../../utils";
import metaDataOptions from "../../../../../../collegeMetaData.json";

export default function MetadataComp({ collegeMetaData, collegeId }) {
  console.log("MetadataComp", collegeMetaData);
  const { addToast } = useToasts();
  const feesDurationTypeRef = useRef();
  const feeRef = useRef();
  const [eligibility, setEligibility] = useState("");
  const [eligibilityList, setEligibilityList] = useState([]);
  const [metaDetails, setMetaDetails] = useState(collegeMetaData);

  console.log(getStringObject(collegeMetaData?.metaDetails));

  const [updateCollegeInfo, { loading: isUpdatingCollegeInfo }] = useMutation(
    UPDATE_COLLEGE_INFO,
    {
      onCompleted: () => {
        addToast("College info updated successfully!", {
          appearance: "success",
        });
      },
      onError: (error) => {
        console.error(error);
        addToast("Something went wrong!", { appearance: "error" });
      },
    }
  );

  const checkboxHandler = (e) => {
    const name = e.target.name;
    setMetaDetails((prev) => {
      return {
        ...prev,
        facility: {
          ...prev.facility,
          [name]: !prev.facility[name],
        },
      };
    });
  };

  const onChangeHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "root") {
      setMetaDetails((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      setMetaDetails((prev) => {
        return {
          ...prev,
          [type]: {
            ...prev[type],
            [name]: value,
          },
        };
      });
    }
  };

  const addMetaDetailsHandler = () => {
    updateCollegeInfo({
      variables: {
        id: collegeId,
        _set: {
          metaDetails,
        },
      },
    });
  };

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
            onClick={addMetaDetailsHandler}
            disabled={isUpdatingCollegeInfo}
          >
            {isUpdatingCollegeInfo ? "Adding..." : "Add metadata"}
          </Button>
        </p>
      </div>

      <Form.Group>
        <Form.Label> Facility</Form.Label>
        <br />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gridGap: "16px",
          }}
        >
          {metaDetails &&
            getBooleanKeys(metaDetails?.facility).map((key, index) => {
              return (
                <Form.Check
                  key={key}
                  inline
                  label={key}
                  name={key}
                  type="checkbox"
                  id={index}
                  checked={metaDetails?.facility[key]}
                  onChange={checkboxHandler}
                />
              );
            })}
        </div>
      </Form.Group>
      {metaDetails &&
        getStringKeys(metaDetails?.facility).map((key) => (
          <Form.Group key={key}>
            <Form.Label>{key}</Form.Label>
            <Form.Control
              type="text"
              name={key}
              placeholder={`Enter ${key}`}
              onChange={(e) => onChangeHandler(e, "facility")}
              // onKeyDown={(e) => onChangeHandler(e, course?.id)}
              value={metaDetails?.facility[key]}
            />
          </Form.Group>
        ))}
      {metaDetails &&
        getStringKeys(metaDetails).map((key) => (
          <Form.Group key={key}>
            <Form.Label>{key}</Form.Label>
            <Form.Control
              type="text"
              name={key}
              placeholder={`Enter ${key}`}
              onChange={(e) => onChangeHandler(e, "root")}
              value={metaDetails[key]}
            />
          </Form.Group>
        ))}
    </Container>
  );
}
