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
import { createDocFirestore } from "../../../../firebase/Firestore";

function AdminNewBlogPage() {
  const titleRef = useRef();
  const authorRef = useRef();
  const dateRef = useRef();
  const mainImgSourceRef = useRef();

  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
  const [blogContent, setBlogContent] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [imgBase64, setImgBase64] = useState({ loaded: false, path: placeholder("pinkPX") }); //used only for preview
  const [imgFile, setImgFile] = useState(null); //image wich will be uploaded to storage
  const [contentImages, setContentImages] = useState([]); //store images added to blog content
  const [tags, setTags] = useState([]);
  const [mainPicStyle, setMainPicStyle] = useState("cover");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const initPost = {
    id: "",
    author: "",
    content: "",
    date: "",
    mainImg: {
        path: "",
        source: "",
        style: "",
    },
    contentImages: [],
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

  useEffect(() => {
    setShowPreview(false);
  }, [blogContent]);

  const changeMainPicStyle = (e) => {
    setMainPicStyle(e?.target.value);
  };

  //Convert eg. main image to to base64 to display it on the client without uploading files to the firebase storage
  const imgToBase64 = (files) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgBase64({ loaded: true, path: reader.result });
    };
    reader.readAsDataURL(files[0]);
  };

  const handleTags = (e) => {
    let words = e.target.value.split(" ");
    setTags(words.filter((word) => word.length >= 1));
    setShowPreview(false);
  };

  const handlePreview = async () => {
    const uid = uuidv4().slice(0, 13);
    updatePost({
      id: uid,
      author: authorRef.current?.value,
      content: blogContent,
      date: dateRef.current?.value,
      mainImg: {
        path: imgBase64.path,
        source: mainImgSourceRef.current?.value,
        style: mainPicStyle,
    },
      tags: tags,
      title: titleRef.current?.value,
    });

    //prepare html and images for the submit action
    await convertHtml();
    setShowPreview(!showPreview);
  };

  //Get all the img elements and replace with {{}} handleBar variables,
  //to not store base64 images in the firestore
  const convertHtml = async () => {
    let tmpContent = blogContent; //here will be stored the final html content
    const imgCount = [...tmpContent.matchAll("<img")]; //Count how many images are added to the blog content
    let imgList = [];

    await Promise.all(
      imgCount.map(async (img, idx) => {
        let base64;
        const startIndex = tmpContent.indexOf("<img");
        const stopIndex = startIndex + tmpContent.substring(startIndex).indexOf('"></p>');
        const imgTag = tmpContent.slice(startIndex, stopIndex + 2);
        tmpContent = tmpContent.replace(imgTag, `{{{img${idx}}}}`);
        //Get the raw base64 and other file data
        const fileName = `img${idx}`;
        const fileType = imgTag.slice(imgTag.indexOf(":") + 1, imgTag.indexOf("/")); //output image text etc...
        const fileExtension = imgTag.slice(imgTag.indexOf("/") + 1, imgTag.indexOf(";")); //output jpg gif png etc...
        const widthProp = imgTag.slice(imgTag.indexOf('width="'), imgTag.indexOf('">') + 1);
        if (widthProp) {
          base64 = imgTag.slice(imgTag.indexOf('src="') + 5, imgTag.indexOf('" width'));
        } else {
          base64 = imgTag.slice(imgTag.indexOf('src="') + 5, imgTag.indexOf('">'));
        }
        //create file
        const file = await base64toFile(base64, fileName, fileType, fileExtension);
        imgList.push({ file: file, imgWidth: widthProp });
      })
    );
    setContentImages(imgList);
    setFinalContent(tmpContent);
  };

  // convert base64 to the file format
  const base64toFile = async (url, fileName, type, extension) => {
    return fetch(url)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((buf) => {
        const readyFile = new File([buf], `${fileName}.${extension}`, { type: `${type}/${extension}` });
        return readyFile;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // upload main pic and update blog data on Create Blog request
  const uploadImg = async () => {
    try {
      let imgContent = [];
      //Create object containing all necessary info about images used in the blog content
      //and upload these images to the firebase storage
      await Promise.all(
        contentImages.map(async (img, idx) => {
          imgContent.push({ fileName: img.file.name, attributes: { imgWidth: img.imgWidth } });
          await uploadFileToStorage(img.file, `images/blog/${post.id}`);
        })
      );
      //upload main image
      const imgUrl = await uploadFileToStorage(imgFile, `images/blog/${post.id}`);
      //update blog data
      let readyBlog = { ...post };
      readyBlog.content = finalContent;
      readyBlog.mainImg.path = imgUrl;
      readyBlog.contentImages = imgContent;
      return readyBlog;
    } catch (error) {
      console.error(error);
    }
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
            <Form.Control
              type="text"
              placeholder="Add title"
              ref={titleRef}
              onChange={() => setShowPreview(false)}
              className="w-100"
            />
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
            <Form.Control
              type="text"
              size="sm"
              placeholder="(optional)"
              ref={mainImgSourceRef}
              onChange={() => setShowPreview(false)}
              className="w-75 me-2"
            />
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

        {/* Blog details */}
        <section className="mt-2 mb-2">
          <Form className="d-flex flex-wrap gap-2 text-start">
            <div className={`d-block ${isMobile && "w-100"}`}>
              <Form.Label style={{ position: "relative", top: "8px" }}>Author:</Form.Label>
              <Form.Control
                type="text"
                onChange={() => setShowPreview(false)}
                ref={authorRef}
                defaultValue={"BrightLightGypsy"}
              />
            </div>
            <div className={`d-block ${isMobile && "w-100"}`}>
              <Form.Label style={{ position: "relative", top: "8px" }}>Date:</Form.Label>
              <Form.Control
                type="text"
                onChange={() => setShowPreview(false)}
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
