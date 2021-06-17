import React from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { Modal, Button, Form } from "react-bootstrap";
import { Wrapper } from "./styles";
import { DeleteIcon } from "../../../../Assets/icons";
import tableOptions from "../../../../tableOptions";
import {
  CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../../../../GraphQl";
import { useState } from "react";
export default function Categories() {
  const [show, setShow] = useState(false);
  const [titleAsId, setTitleAsId] = useState("");
  const [title, setTitle] = useState("");
  const {
    data: { courses_courseCategory: categories = [] } = {},
    loading,
    error,
  } = useSubscription(CATEGORIES);
  const [createCategory, { loading: isCreatingCategory }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: () => {
        setShow(false);
        setTitle("");
        setTitleAsId("");
      },
      onError: (error) => {
        setShow(false);
        setTitle("");
        setTitleAsId("");
        console.log(error);
      },
    }
  );
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onError: (error) => {
      console.log(error);
    },
  });
  const [updateCategory, { loading: isUpdatingCategory }] = useMutation(
    UPDATE_CATEGORY,
    {
      onCompleted: () => {
        setShow(false);
        setTitle("");
        setTitleAsId("");
      },
      onError: (error) => {
        setShow(false);
        setTitle("");
        setTitleAsId("");
        console.log(error);
      },
    }
  );

  const handleClose = () => {
    setTitle("");
    setTitleAsId("");
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const rowClick = (e, cell) => {
    const { title: categoryTitle } = cell._cell.row.data;
    setTitle(categoryTitle);
    setTitleAsId(categoryTitle);
    setShow(true);
  };

  const deleteHandler = (e, category) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete ${category.title} category?`
      )
    ) {
      deleteCategory({
        variables: {
          title: category.title,
        },
      });
    }
  };

  const columns = [
    {
      title: "Category Title",
      field: "title",
      headerFilter: true,
      cssClass: "rowClick",
      hozAlign: "left",
      cellClick: (e, cell) => {
        rowClick(e, cell);
      },
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

  const upsertHandler = () => {
    if (titleAsId) {
      updateCategory({
        variables: {
          title: titleAsId,
          _set: {
            title,
            assets: { images: [] },
          },
        },
      });
    } else {
      createCategory({
        variables: {
          title,
          assets: { images: [] },
        },
      });
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) {
    console.error(error);
  }
  return (
    <Wrapper>
      <h1 className="heading">Category Listing</h1>
      <Button variant="primary" onClick={handleShow} className="mb-4">
        Add Category
      </Button>
      {Boolean(categories) && (
        <ReactTabulator
          columns={columns}
          data={categories}
          options={{
            ...tableOptions,
            placeholder: "No Categories Available Yet !",
          }}
        />
      )}
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Category Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={upsertHandler}
            disabled={isCreatingCategory}
          >
            {isCreatingCategory || isUpdatingCategory ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Wrapper>
  );
}
