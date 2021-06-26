import React, { useState } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { Modal, Button, Form, Image } from "react-bootstrap";
import { Wrapper } from "./styles";
import { DeleteIcon } from "../../../../Assets/icons";
import tableOptions from "../../../../tableOptions";
import {
  CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../../../../GraphQl";
import { firebaseUpload } from "../../../../utils";
import { useEffect } from "react";

export default function Categories() {
  const [show, setShow] = useState(false);
  const [titleAsId, setTitleAsId] = useState("");
  const [title, setTitle] = useState("");
  const [imageAsFile, setImageAsFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    data: { courses_courseCategory: categories = [] } = {},
    loading: isLoadingCategories,
    error,
  } = useSubscription(CATEGORIES);
  const [createCategory, { loading: isCreatingCategory }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: () => {
        setShow(false);
        setTitle("");
        setTitleAsId("");
        setImageUrl("");
      },
      onError: (error) => {
        setShow(false);
        setTitle("");
        setTitleAsId("");
        setImageUrl("");
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
        setImageUrl("");
      },
      onError: (error) => {
        setShow(false);
        setTitle("");
        setTitleAsId("");
        setImageUrl("");
        console.log(error);
      },
    }
  );

  const handleClose = () => {
    setTitle("");
    setTitleAsId("");
    setImageUrl("");
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const rowClick = (e, cell) => {
    const { title: categoryTitle, assets } = cell._cell.row.data;
    setTitle(categoryTitle);
    setTitleAsId(categoryTitle);
    setImageUrl(assets.images[0]);
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

  const upsertHandler = async () => {
    setLoading(true);
    if (titleAsId) {
      const url = await firebaseUpload(imageAsFile);
      setImageUrl(url);
      setLoading(false);
      updateCategory({
        variables: {
          title: titleAsId,
          _set: {
            title: title.trim(),
            assets: { images: [url] },
          },
        },
      });
    } else {
      const url = await firebaseUpload(imageAsFile);
      setImageUrl(url);
      setLoading(false);
      createCategory({
        variables: {
          title: title.trim(),
          assets: { images: [url] },
        },
      });
    }
  };

  useEffect(() => {
    if (
      isCreatingCategory ||
      isUpdatingCategory ||
      !title ||
      !imageAsFile ||
      loading
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [isCreatingCategory, isUpdatingCategory, loading, title, imageAsFile]);

  if (isLoadingCategories) return <div className="loader">Loading...</div>;
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
          {imageUrl && (
            <Image
              src={imageUrl}
              style={{ width: "100%", height: "50px", objectFit: "cover" }}
              alt="no image added"
            />
          )}
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Category Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.File
              id="exampleFormControlFile1"
              label="Category Image"
              accept="images/*"
              onChange={(e) => setImageAsFile(e.target.files[0])}
              required
            />
          </Form.Group>
          {/* <ProgressBar animated now={45} /> */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={upsertHandler}
            disabled={isDisabled}
          >
            {isCreatingCategory || isUpdatingCategory ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Wrapper>
  );
}
