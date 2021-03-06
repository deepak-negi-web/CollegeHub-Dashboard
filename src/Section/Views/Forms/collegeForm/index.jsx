import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useSubscription, useMutation } from "@apollo/client";
import {
  Modal,
  Button,
  Form,
  Image,
  Container,
  Row,
  Col,
  Tabs,
  Tab,
} from "react-bootstrap";
import { AssetsComp, MetaDataComp, CoursesComp } from "./components";
import { Wrapper } from "./styles";
import { COLLEGE_INFO, UPDATE_COLLEGE_INFO } from "../../../../GraphQl";

export default function CollegeForm() {
  const { addToast } = useToasts();
  const { collegeId } = useParams();
  const nameRef = useRef();
  const [tabKey, setTabKey] = useState("home");
  const {
    data: { colleges_college_by_pk: college = {} } = {},
    error: hasCollegeError,
    loading: isLoadingCollege,
  } = useSubscription(COLLEGE_INFO, {
    variables: {
      id: collegeId,
    },
  });

  const [updateCollegeInfo, { loading: isUpdatingCollegeInfo }] = useMutation(
    UPDATE_COLLEGE_INFO,
    {
      onCompleted: () => {
        console.log("update completed");
        addToast("Successfully updated!", { appearance: "success" });
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const onBlurHandler = (e) => {
    const { name, value } = e.target;
    updateCollegeInfo({
      variables: {
        id: collegeId,
        _set: {
          [name]: value,
        },
      },
    });
  };

  if (isLoadingCollege) return <div className="loader">Loading...</div>;
  if (hasCollegeError) {
    console.error(hasCollegeError);
  }
  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Form.Group controlId="formCollegeName">
            <Form.Label>College Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter name"
              ref={nameRef}
              defaultValue={college?.name}
              onBlur={onBlurHandler}
              disabled={isUpdatingCollegeInfo}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formCollegeLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder="Enter location"
              ref={nameRef}
              defaultValue={college?.location}
              onBlur={onBlurHandler}
              disabled={isUpdatingCollegeInfo}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="formCollegeInfo">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="info"
              row={3}
              placeholder="Enter description"
              ref={nameRef}
              defaultValue={college?.info}
              onBlur={onBlurHandler}
              disabled={isUpdatingCollegeInfo}
            />
          </Form.Group>
        </Col>
      </Row>
      <Tabs
        id="controlled-tab-example"
        activeKey={tabKey}
        onSelect={(k) => setTabKey(k)}
        className="mb-3 "
      >
        <Tab eventKey="home" title="Assets">
          <AssetsComp assets={college?.assets} collegeId={+collegeId} />
        </Tab>
        <Tab eventKey="profile" title="Metadata">
          <MetaDataComp
            collegeMetaData={college?.metaDetails}
            collegeId={+collegeId}
          />
        </Tab>
        <Tab eventKey="contact" title="Courses">
          <CoursesComp
            defaultCourses={college?.college_courses?.map((clg_course) => ({
              ...clg_course,
              id: clg_course?.course?.id,
              name: clg_course?.course?.name,
            }))}
            collegeId={+collegeId}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
