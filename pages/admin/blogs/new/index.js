import React, { useEffect, useState, useReducer, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Container, Button, Form, Spinner, Badge } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import { uploadFileToStorage } from "../../../../firebase/Storage";
import placeholder from "../../../../utils/placeholder";
import TextEditorQuill from "../../../../components/TextEditorQuill";
import Dropzone from "react-dropzone";
import styles from "../../../../styles/components/Admin/Blogs.module.scss";
import { BsCloudUpload } from "react-icons/bs";
import BlogPost from "../../../../components/BlogPost";
import { v4 as uuidv4 } from "uuid";
import { createDocFirestore, getDocsFromCollection } from "../../../../firebase/Firestore";

function AdminNewBlogPage() {
  const titleRef = useRef();
  const authorRef = useRef();
  const dateRef = useRef();
  const mainImgSourceRef = useRef();

  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
  const [blogContent, setBlogContent] = useState("");
  const [imgBase64, setImgBase64] = useState({ loaded: false, path: placeholder("pinkPX") }); //used only for preview
  const [imgFile, setImgFile] = useState(null); //image wich will be uploaded to storage
  const [tags, setTags] = useState([]);
  const [mainPicStyle, setMainPicStyle] = useState("cover");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const initPost = {
    id: "",
    author: "",
    content: "",
    date: "",
    mainImg: "",
    mainImgSource: "",
    tags: [],
    title: "",
    comments: [],
    likes: [],
  };
  const [post, updatePost] = useReducer((state, updates) => ({ ...state, ...updates }), initPost);

  const router = useRouter();
  const mainPicHeight = "200px";
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  async function scroll() {
    await sleep(300);
    document.getElementById("ab-ctx").scrollIntoView();
  }

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin) {
        isMobile && scroll();
      } else {
        router.replace("/");
        return;
      }
    } else {
      router.replace("/sign-in");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMainPicStyle = (e) => {
    setMainPicStyle(e?.target.value);
  };

  const imgToBase64 = (files) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgBase64({ loaded: true, path: reader.result });
      //console.log(reader.result);
      // Logs data:image/jpeg;base64,wL2dvYWwgbW9yZ...
      //? Convert to Base64 string
      // const getBase64StringFromDataURL = (dataURL) => dataURL.replace("data:", "").replace(/^.+,/, "");
      // const base64 = getBase64StringFromDataURL(reader.result);
      // Logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(files[0]);
  };

  const handleTags = (e) => {
    let words = e.target.value.split(" ");
    setTags(words.filter((word) => word.length >= 1));
  };

  const handlePreview = () => {
    const uid = uuidv4().slice(0, 13);
    updatePost({
      id: uid,
      author: authorRef.current?.value,
      content: blogContent,
      date: dateRef.current?.value,
      mainImg: imgBase64.path,
      mainImgSource: mainImgSourceRef.current?.value,
      tags: tags,
      title: titleRef.current?.value,
      comments: [],
      likes: [],
    });

    setShowPreview(!showPreview);
  };

  //  upload main pic and update blog data on Create Blog request
  const uploadImg = async () => {
    const imgUrl = await uploadFileToStorage(imgFile, `blog/${post.id}`);
    updatePost({ mainImg: imgUrl });
    let postWithUrl = { ...post };
    postWithUrl.mainImg = imgUrl;
    return postWithUrl;
  };

  const handleSendBlog = async () => {
    setLoading(true);
    try {
      const readyBlog = await uploadImg();
      await createDocFirestore("blog", readyBlog.id, readyBlog);
      router.push("/admin/blogs#main");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const convertHtml = () => {
    console.log(blogContent);
    const startString = "<img";
    const endString = '"></p>';
    const string = blogContent;
    const imgTagExist = string.search(startString); //if exists then returns the index

    if(imgTagExist > 0){
        const stopIndex = imgTagExist + string.substring(imgTagExist).indexOf(endString);
        const imgTag = string.slice(imgTagExist, stopIndex + 2);
        const newContent = string.replace(imgTag,"{{img}}");
        console.log(newContent);
    }else{
        console.log("Without img files");
    }
    
  };
  return (
    <>
      <Head>
        <title>BrightLight | Admin - New Blog</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="ab-ctx">
        <h1>Create new Blog</h1>
        {/* Title */}
        <section className="mt-2 mb-2">
          <Form className="text-start">
            <Form.Label style={{ position: "relative", top: "8px" }}>TITLE:</Form.Label>
            <Form.Control type="text" placeholder="Add title" ref={titleRef} className="w-100" />
          </Form>
        </section>
        {/* Main picture & DropZone */}
        <div className="w-100 border rounded mb-2 " style={{ minHeight: mainPicHeight, position: "relative" }}>
          <Dropzone
            onDrop={(acceptedFiles) => {
              imgToBase64(acceptedFiles);
              setImgFile(acceptedFiles[0]);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section style={{ position: "relative", zIndex: 100 }}>
                <div
                  className={`${
                    imgBase64.loaded ? styles.DropSectionLoaded : styles.DropSection
                  } color-primary pointer`}
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
            style={{ objectFit: mainPicStyle, borderRadius: ".25rem" }}
          />
        </div>
        {/* Main image options */}
        {imgBase64.loaded && (
          <Form className="d-flex flex-nowrap align-items-center justify-content-end mb-2">
            <Form.Label className="me-2 mt-1">
              <small>Source:</small>
            </Form.Label>
            <Form.Control type="text" size="sm" placeholder="(optional)" ref={mainImgSourceRef} className="w-75 me-2" />
            <Form.Label className="me-2 mt-1">
              <small style={{ whiteSpace: "nowrap" }}>Image style:</small>
            </Form.Label>
            <Form.Select type="text" size="sm" id="BlogMainPicViewProp" onChange={changeMainPicStyle} className="w-25">
              <option value="cover">Cover</option>
              <option value="fill">Fill</option>
              <option value="contain">Contain</option>
              <option value="none">None</option>
              <option value="scale-down">Scale down</option>
            </Form.Select>
          </Form>
        )}
        {/* Text Editor */}
        <TextEditorQuill placeholder={"Here is place for your blog content..."} content={setBlogContent} />
        {/* <Button onClick={convertHtml}>Convert</Button> */}

        {/* Tag menager */}
        <section className="mt-2 mb-2">
          <Form className="text-start">
            <Form.Label style={{ position: "relative", top: "8px" }}>TAGS:</Form.Label>
            <Form.Control type="text" placeholder="Eg: tag1 tag2" className="w-100" onChange={handleTags} />
          </Form>
          <div className="d-flex flex-wrap gap-2 text-start mt-2">
            {tags.length > 0 &&
              tags.map((tag, idx) => (
                <Badge key={idx} bg="dark" className="pointer">
                  #{tag}
                </Badge>
              ))}
          </div>
        </section>

        {/* Tag menager */}
        <section className="mt-2 mb-2">
          <Form className="d-flex flex-wrap gap-2 text-start">
            <div className={`d-block ${isMobile && "w-100"}`}>
              <Form.Label style={{ position: "relative", top: "8px" }}>Author:</Form.Label>
              <Form.Control type="text" onChange={() => {}} ref={authorRef} defaultValue={"BrightLightGypsy"} />
            </div>
            <div className={`d-block ${isMobile && "w-100"}`}>
              <Form.Label style={{ position: "relative", top: "8px" }}>Date:</Form.Label>
              <Form.Control
                type="text"
                onChange={() => {}}
                ref={dateRef}
                defaultValue={new Date().toLocaleDateString()}
              />
              <small className="text-muted ms-1">Today: {new Date().toLocaleDateString()}</small>
            </div>
          </Form>
        </section>
        <div className="text-end">
          <Button onClick={handlePreview}>{showPreview ? "Close Preview" : "Preview Blog"}</Button>
        </div>
        {showPreview && (
          <div className="mt-4">
            <hr />
            <BlogPost post={post} preview={true} />
            <hr className="mt-5" />
            <div>
              <Button onClick={handleSendBlog} className="w-100" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span> Loading...</span>
                  </>
                ) : (
                  <span className="text-uppercase">Create this Blog!</span>
                )}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default AdminNewBlogPage;
