import React, { useState, useRef } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Wrapper } from "./styles";
import { DeleteIcon } from "../../../../Assets/icons";
import tableOptions from "../../../../tableOptions";
import {
  COLLEGES,
  COURSES,
  CREATE_COLLEGE,
  DELETE_COLLEGE,
} from "../../../../GraphQl";
import { getBooleanKeys, getBooleanObject } from "../../../../utils";
import collegeMetaData from "../../../../collegeMetaData.json";

export default function Colleges() {
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [facility, setFacility] = useState(
    getBooleanObject(collegeMetaData.facility)
  );
  const nameRef = useRef("");
  const locationRef = useRef(1);
  const courseRef = useRef("");
  const descriptionRef = useRef("");
  const {
    data: { colleges_college: colleges = [] } = {},
    loading,
    error,
  } = useSubscription(COLLEGES);
  const {
    data: { courses_courses: courses = [] } = {},
    loading: isCoursesLoading,
    error: coursesError,
  } = useSubscription(COURSES);

  const [deleteCollege, { loading: isDeletingCollege }] = useMutation(
    DELETE_COLLEGE,
    {
      onCompleted: ({ delete_colleges_college_by_pk: college }) => {
        console.log({ college });
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const [createCollege, { loading: isCreatingCollege }] = useMutation(
    CREATE_COLLEGE,
    {
      onCompleted: ({ insert_colleges_college_one: college }) => {
        setModalShow(false);
        history.push(`/colleges/${college?.id}`);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const deleteHandler = (e, college) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete ${college.name} course?`)
    ) {
      deleteCollege({
        variables: {
          id: college.id,
        },
      });
    }
  };

  const rowClick = (e, cell) => {
    const { id } = cell._cell.row.data;
    history.push(`/colleges/${id}`);
  };

  const columns = [
    {
      title: "Id",
      field: "id",
      width: "100",
      headerFilter: true,
      cssClass: "rowClick",
      hozAlign: "left",
    },
    {
      title: "Name",
      field: "name",
      width: "300",
      headerFilter: true,
      hozAlign: "left",
      cellClick: (e, cell) => {
        rowClick(e, cell);
      },
    },
    {
      title: "Location",
      field: "location",
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

  const handleCreate = () => {
    createCollege({
      variables: {
        object: {
          name: nameRef.current.value,
          location: locationRef.current.value,
          info: descriptionRef.current.value,
          metaDetails: {
            facility: {
              atm: false,
              gym: false,
              mess: false,
              tour: false,
              hostel: false,
              canteen: false,
              library: false,
              classrooms: false,
              playground: false,
              campus_wifi: false,
              gate_timing: "",
              scholarship: null,
              sports_level: "",
              students_club: false,
              nearest_market: "",
              transportation: false,
              nearest_bus_stand: "",
              medical_facilities: false,
              nearest_metro_station: "",
            },
            approved_by:
              "Approved by All India Council for Technical Education (AICTE)",
            campus_area: "",
            established: null,
            accredited_by: "",
            affiliated_to: "",
            institute_type: "",
          },
        },
      },
    });
    // console.log({
    //   name: nameRef.current.value,
    //   location: locationRef.current.value,
    //   description: descriptionRef.current.value,
    // });
  };

  if (loading || isCoursesLoading)
    return <div className="loader">Loading...</div>;
  if (error || coursesError) {
    console.error(error || coursesError);
  }
  return (
    <Wrapper>
      <h1 className="heading">College Listing</h1>
      <Button
        variant="primary"
        className="mb-4"
        onClick={() => setModalShow(true)}
      >
        Add Colleges
      </Button>
      {Boolean(colleges) && (
        <ReactTabulator
          columns={columns}
          data={colleges}
          options={{
            ...tableOptions,
            placeholder: "No Colleges Available Yet !",
          }}
          // ref={tableRef}
        />
      )}

      <Modal
        show={modalShow}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add College</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                ref={nameRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                ref={locationRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label> Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                ref={descriptionRef}
              />
            </Form.Group>

            {/* <Form.Group>
              <Form.File
                id="college-image"
                label="Images"
                accept="image/*"
                multiple
              />
            </Form.Group>

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
              <Form.Label>Course category</Form.Label>
              <Form.Control as="select" multiple ref={courseRef}>
                {courses.map((course) => {
                  return (
                    <option key={course?.id} value={course?.id}>
                      {course?.name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group> */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={isCreatingCollege}
              variant="primary"
              onClick={handleCreate}
            >
              {isCreatingCollege ? "Creating..." : "Create"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Wrapper>
  );
}
