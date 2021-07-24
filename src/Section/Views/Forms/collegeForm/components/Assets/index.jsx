import React, { useEffect, useState } from "react";
import { Form, Image, Container, Button, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { useMutation } from "@apollo/client";
import { UPDATE_COLLEGE_INFO } from "../../../../../../GraphQl";
import { firebaseUpload } from "../../../../../../utils";
export default function AssetsComp({ assets, collegeId }) {
  const { addToast } = useToasts();
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState({
    logo: null,
    main: null,
    gallery: [],
  });
  const [urls, setUrls] = useState({
    logo: "",
    main: "",
    gallery: [],
  });

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

  const onAddingImages = (e) => {
    const { files, name } = e.target;
    console.log({ files, name });
    switch (name) {
      case "logo":
        setImages((prev) => ({ ...prev, logo: Array.from(files)[0] }));
        break;
      case "main":
        setImages((prev) => ({ ...prev, main: Array.from(files)[0] }));
        break;
      case "gallery":
        setImages((prev) => ({ ...prev, gallery: Array.from(files) }));
        break;
      default:
        return null;
    }
  };

  const uploadImageHandler = async () => {
    setIsUploading(true);
    const logoUrl = images.logo
      ? await firebaseUpload(images.logo, `colleges/${collegeId}`)
      : null;
    const mainUrl = images.main
      ? await firebaseUpload(images.main, `colleges/${collegeId}`)
      : null;
    const galleryUrls = Boolean(images.gallery.length)
      ? await Promise.all(
          images.gallery.map(async (file) => {
            try {
              const url = await firebaseUpload(file, `colleges/${collegeId}`);
              return url;
            } catch (error) {
              setIsUploading(false);
              return error;
            }
          })
        )
      : [];

    await updateCollegeInfo({
      variables: {
        id: collegeId,
        _set: {
          assets: {
            images: {
              logo: logoUrl ? [logoUrl] : [urls.logo],
              main: mainUrl ? [mainUrl] : [urls.main],
              gallery: [...urls.gallery, ...galleryUrls],
            },
          },
        },
      },
    });
    setIsUploading(false);
  };

  useEffect(() => {
    if (assets) {
      setUrls({
        logo: assets.images?.logo[0] || "",
        main: assets.images?.main[0] || "",
        gallery: assets.images?.gallery || [],
      });
    }
  }, [assets]);
  return (
    <Container fluid>
      <div className="d-flex justify-content-between">
        <h5>Add Images to the college</h5>
        <p>
          <Button
            variant="primary"
            onClick={uploadImageHandler}
            disabled={isUploading || isUpdatingCollegeInfo}
          >
            {Boolean(isUploading || isUpdatingCollegeInfo)
              ? "Uploading..."
              : "Upload Assets"}
          </Button>
        </p>
      </div>
      <Row>
        <Form.Group controlId="college-logo" className="mb-3">
          <Form.Label>College logo </Form.Label>
          <Form.Control
            name="logo"
            type="file"
            accept="image/*"
            onChange={onAddingImages}
          />
          <Image
            className="mt-4"
            style={{ width: "150px", height: "150px" }}
            src={
              urls.logo
                ? urls.logo
                : "https://via.placeholder.com/150?text=Upload+logo"
            }
          />
        </Form.Group>
        <Form.Group controlId="college-main" className="mb-3">
          <Form.Label>College main </Form.Label>
          <Form.Control
            name="main"
            type="file"
            accept="image/*"
            onChange={onAddingImages}
          />
          <Image
            className="mt-4"
            style={{ width: "150px", height: "150px" }}
            src={
              urls.main
                ? urls.main
                : "https://via.placeholder.com/150?text=Upload+main"
            }
          />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group controlId="college-gallery" className="mb-3">
          <Form.Label>College gallery </Form.Label>
          <Form.Control
            name="gallery"
            type="file"
            multiple
            accept="image/*"
            onChange={onAddingImages}
          />
          {Boolean(urls.gallery.length) ? (
            <Row>
              {urls.gallery.map((url, index) => (
                <Col key={index}>
                  <Image
                    style={{ width: "150px", height: "150px" }}
                    className="mt-4"
                    src={url}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Image
              className="mt-4"
              src="https://via.placeholder.com/150?text=Upload+gallery"
            />
          )}
        </Form.Group>
      </Row>
    </Container>
  );
}
