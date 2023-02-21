import React, { useEffect, useState, useReducer, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDeviceStore } from "../../../stores/deviceStore";
import { uploadFileToStorage } from "../../../firebase/Storage";
import placeholder from "../../../utils/placeholder";
import Dropzone from "react-dropzone";
import styles from "../../../styles/components/Blog/BlogTemplate.module.scss";
import { BsCloudUpload } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { createDocFirestore, getDocById, updateDocFields } from "../../../firebase/Firestore";
import SuccessModal from "../../Modals/SuccessModal";

function ProductTemplate(props) {
  const prodEdit = props.product;
  const titleRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const cardsRef = useRef();
  const router = useRouter();

  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const [showSuccess, setShowSuccess] = useState("");
  const [description, setDescription] = useState("");
  const [imgBase64, setImgBase64] = useState({ loaded: false, path: placeholder("pinkPX") }); //used only for preview
  const [imgFile, setImgFile] = useState(null); //image wich will be uploaded to storage
  const [editNewImage, setEditNewImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const invalidInit = { title: false, image: false, description: false, price: false, cardSet: false };
  const [invalid, updateInvalid] = useReducer((state, updates) => ({ ...state, ...updates }), invalidInit);
  const initPost = {
    id: "",
    title: "",
    description: "",
    price: 0,
    cardSet: 0,
    image: ""
  };
  const [product, updatePost] = useReducer((state, updates) => ({ ...state, ...updates }), initPost);
  const mainPicHeight = "200px";
  const themeDarkInput = themeState == "dark" ? "bg-accent6 text-light" : "";

  //Create string form tags array when edit mode is enabled
  useEffect(() => {
    if (prodEdit) {
      setImgBase64({ loaded: true, path: prodEdit.image }); //set url instead of base64
      updateInvalid({ image: false }); //main img setted
      setDescription(prodEdit.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  const onDropFunc = (files) => {
    imgToBase64(files);
    setImgFile(files[0]);
    setEditNewImage(true);
  };

  //Convert eg. main image to to base64 to display it on the client without uploading files to the firebase storage
  const imgToBase64 = (files) => {
    updateInvalid({ image: false });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgBase64({ loaded: true, path: reader.result });
    };
    reader.readAsDataURL(files[0]);
  };

  const handlePreview = async () => {
    let dataOK = true;
    const uid = uuidv4().slice(0, 13);

    // check title field
    if (titleRef.current?.value != "") {
      updateInvalid({ title: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ title: true }); //invalid
      document.getElementsByName("ProdAdminTmpTitle")[0].focus();
      document.getElementsByName("ProdAdminTmpTitle")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check if main image was added
    if (imgBase64.loaded) {
      updateInvalid({ image: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ image: true }); //invalid
      document.getElementsByName("ProdAdminTmpImg")[0].focus();
      document.getElementsByName("ProdAdminTmpImg")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check if description is added
    if (description == ""){
      dataOK = false;
      updateInvalid({ description: true }); //invalid
      document.getElementsByName("ProdAdminTmpDesc")[0].focus();
      document.getElementsByName("ProdAdminTmpDesc")[0].scrollIntoView({ block: "center", inline: "nearest" });
    } else {
      updateInvalid({ description: false }); //ok
    }

    if (dataOK) {
      updatePost({
        id: `${prodEdit ? prodEdit.id : uid}`,
        description: description,
        image: imgBase64.path,
        title: titleRef.current?.value,
      });
      setShowPreview(!showPreview);
    }
  };

  // upload main pic and update blog data on Create Blog request
  const uploadImg = async () => {
    try {
      let readyProduct = { ...product };
      let imgUrl = "";
      //upload main image when admin is creating new blog or in editing mode user added new image
      if (editNewImage) {
        imgUrl = await uploadFileToStorage(imgFile, `images/blog/${product.id}`);
      } else {
        imgUrl = prodEdit.image;
      }
      //update blog data
      readyProduct.image = imgUrl;
      return readyProduct;
    } catch (error) {
      console.error(error);
    }
  };

  const createProduct = async () => {
    setLoading(true);
    try {
      const readyProduct = await uploadImg();
      if (prodEdit) {
        //edit existing blog
        await updateDocFields("tarot", readyProduct.id, readyProduct);
      } else {
        //create new blog
        await createDocFirestore("tarot", readyProduct.id, readyProduct);
      }
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/admin/products", "/"],
      };
      if (prodEdit) {
        revalidateData.paths.push(`/blog/${readyProduct.id}`);
      }

      await axios.post("/api/revalidate", revalidateData);
      setShowSuccess(prodEdit ? "Product edited successfuly!" : "Product created successfuly!");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="d-flex gap-1">
        <small>
          <Link href="/admin/products#main">Products Menagment</Link>
        </small>
        <small>&gt;</small>
        <small>{prodEdit ? prodEdit.title : "New Product"}</small>
      </section>

      <section className="mt-2 mb-2">
        <Form className="text-start">
          <Form.Label style={{ position: "relative", top: "8px" }}>TITLE:</Form.Label>
          <Form.Control
            type="text"
            name="ProdAdminTmpTitle"
            placeholder="Add title"
            ref={titleRef}
            onChange={() => setShowPreview(false)}
            defaultValue={prodEdit ? prodEdit.title : ""}
            className={`${invalid.title && "border border-danger"} w-100 ${themeDarkInput}`}
          />
          {invalid.title && <small className="text-danger">Please add title.</small>}
        </Form>
      </section>
      {/* Main picture & DropZone */}
      <div
        name="ProdAdminTmpImg"
        className={`w-100 border rounded ${invalid.image && "border-danger"}`}
        style={{ minHeight: mainPicHeight, position: "relative" }}
      >
        <Dropzone onDrop={(acceptedFiles) => onDropFunc(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section style={{ position: "relative", zIndex: 100 }}>
              <div
                className={`${imgBase64.loaded ? styles.DropSectionLoaded : styles.DropSection} color-primary pointer`}
                style={{ minHeight: mainPicHeight }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="mt-1">
                  {imgBase64.loaded ? (
                    <>
                      {isMobile ? (
                        <p className="border rounded p-1 me-2 text-light">
                          <small>Select another</small>
                        </p>
                      ) : (
                        <p className={`${styles.pSelect} border rounded p-1 me-2 text-light`}>
                          <small>Select or Drop another file</small>
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-muted text-uppercase">Main Picture</p>
                      <p className="mb-2">
                        Drag &#39;n&#39; drop some files here
                        <br />
                        or click to select files
                      </p>
                      <BsCloudUpload style={{ width: "25px", height: "25px" }} />
                    </>
                  )}
                </div>
              </div>
            </section>
          )}
        </Dropzone>
        <Image
          src={imgBase64.path}
          fill
          alt="uploaded file"
          style={{borderRadius: ".25rem" }}
        />
      </div>
      {invalid.image && (
        <div className="text-start mt-0">
          <small className="text-danger">Please upload main picture.</small>
        </div>
      )}
      
      {/* Description */}
      <section className="mt-2 mb-2">
        <Form className="text-start">
          <Form.Label style={{ position: "relative", top: "8px" }}>Description:</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            name="ProdAdminTmpDesc"
            placeholder="Add some text..."
            ref={descRef}
            onChange={() => setShowPreview(false)}
            defaultValue={prodEdit ? prodEdit.description : ""}
            className={`${invalid.description && "border border-danger"} w-100 ${themeDarkInput}`}
          />
          {invalid.description && <small className="text-danger">Please add descsription.</small>}
        </Form>
      </section>

      {/* Description */}
      <section className="mt-2 mb-2">
        <Form className="text-start">
          <Form.Label style={{ position: "relative", top: "8px" }}>Cards quantity:</Form.Label>
          <Form.Control
            type="number"
            name="ProdAdminTmpCards"
            placeholder="Add some text..."
            ref={cardsRef}
            onChange={() => setShowPreview(false)}
            defaultValue={prodEdit ? prodEdit.cardSet : 0}
            className={`w-25 ${invalid.cards && "border border-danger"} ${themeDarkInput}`}
          />
          {invalid.description && <small className="text-danger">Please add number of cards.</small>}
        </Form>
      </section>

      <div className="text-end">
        <Button onClick={handlePreview}>{showPreview ? "Close Preview" : "Preview Product"}</Button>
      </div>
      {showPreview && (
        <div className="mt-4">
          <hr />
          {/* <BlogPost product={product} preview={true} editMode={prodEdit ? true : false} /> */}
          <hr className="mt-5" />
          <div>
            <Button
              onClick={createProduct}
              className="w-100"
              variant={showSuccess ? "success" : "primary"}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span> Loading...</span>
                </>
              ) : (
                <span className="text-uppercase">{prodEdit ? "Save changes!" : "Create this Blog!"}</span>
              )}
            </Button>
          </div>
        </div>
      )}
      {showSuccess && (
        <SuccessModal
          msg={showSuccess}
          btn={"Back"}
          closeFunc={() => {
            router.push("/admin/blogs#main");
            setShowSuccess("");
          }}
        />
      )}
    </>
  );
}

export default ProductTemplate;
