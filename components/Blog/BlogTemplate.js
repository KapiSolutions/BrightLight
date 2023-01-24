import React, { useEffect, useState, useReducer, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { Button, Form, Spinner, Badge } from "react-bootstrap";
import { useDeviceStore } from "../../stores/deviceStore";
import { uploadFileToStorage } from "../../firebase/Storage";
import placeholder from "../../utils/placeholder";
import TextEditorQuill from "../../components/TextEditorQuill";
import Dropzone from "react-dropzone";
import styles from "../../styles/components/Blog/BlogTemplate.module.scss";
import { BsCloudUpload } from "react-icons/bs";
import BlogPost from "./BlogPost";
import { v4 as uuidv4 } from "uuid";
import { createDocFirestore, getDocById, updateDocFields } from "../../firebase/Firestore";


function BlogTemplate(props) {
  const postEdit = props.post;
  const titleRef = useRef();
  const authorRef = useRef();
  const dateRef = useRef();
  const mainImgSourceRef = useRef();
  const router = useRouter();

  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const [blogContent, setBlogContent] = useState("");
  const [finalContent, setFinalContent] = useState("");
  const [imgBase64, setImgBase64] = useState({ loaded: false, path: placeholder("pinkPX") }); //used only for preview
  const [imgFile, setImgFile] = useState(null); //image wich will be uploaded to storage
  const [editNewImage, setEditNewImage] = useState(false);
  const [contentImages, setContentImages] = useState([]); //store images added to blog content
  const [tagsString, setTagsString] = useState("");
  const [tags, setTags] = useState([]);
  const [mainPicStyle, setMainPicStyle] = useState("cover");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const invalidInit = { title: false, mainImg: false, content: false, author: false, date: false };
  const [invalid, updateInvalid] = useReducer((state, updates) => ({ ...state, ...updates }), invalidInit);
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
  const mainPicHeight = "200px";
  const themeDarkInput = themeState == "dark" ? "bg-accent6 text-light" : "";

  //Update Blog content on evry editor state change
  useEffect(() => {
    setShowPreview(false);
    updateInvalid({ content: false });
  }, [blogContent]);

  //Create string form tags array when edit mode is enabled
  useEffect(() => {
    if (postEdit) {
      setImgBase64({ loaded: true, path: postEdit.mainImg.path }); //set url instead of base64
      updateInvalid({ mainImg: false }); //main img setted
      setBlogContent(postEdit.content);
      setTagsString(postEdit.tags.join(" "));
      setTags([...postEdit.tags]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMainPicStyle = (e) => {
    setMainPicStyle(e?.target.value);
  };

  const timeStampToDate = (time) => {
    return new Date(time.seconds * 1000 + time.nanoseconds / 100000);
  };

  //Convert eg. main image to to base64 to display it on the client without uploading files to the firebase storage
  const imgToBase64 = (files) => {
    updateInvalid({ mainImg: false });
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
    let dataOK = true;
    const uid = uuidv4().slice(0, 13);
    // Convert the date
    const inputDate = dateRef.current?.value;
    const enDate = inputDate.includes("/"); //"01/12/2012"
    const plDate = inputDate.includes("."); //"1.12.2012"
    const csDate = inputDate.includes("-"); //"1-12-2012"
    const splitChar = (enDate && "/") || (plDate && ".") || (csDate && "-");
    const dArray = inputDate.split(splitChar);
    const date = new Date(
      `${dArray[2]}/
      ${dArray[1]}/
      ${dArray[0]}${" "} 
      ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    );
    // check if user provided valid date format
    if (date instanceof Date && !isNaN(date)) {
      if (date < new Date("2000-01-01")) {
        dataOK = false;
        updateInvalid({ date: true }); //invalid
        document.getElementsByName("blogTmpDate")[0].focus();
        document.getElementsByName("blogTmpDate")[0].scrollIntoView({ block: "center", inline: "nearest" });
      } else {
        updateInvalid({ date: false }); //ok
      }
    } else {
      dataOK = false;
      updateInvalid({ date: true }); //invalid
      document.getElementsByName("blogTmpDate")[0].focus();
      document.getElementsByName("blogTmpDate")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check title field
    if (titleRef.current?.value != "") {
      updateInvalid({ title: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ title: true }); //invalid
      document.getElementsByName("blogTmpTitle")[0].focus();
      document.getElementsByName("blogTmpTitle")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check author field
    if (authorRef.current?.value != "") {
      updateInvalid({ author: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ author: true }); //invalid
      document.getElementsByName("blogTmpAuthor")[0].focus();
      document.getElementsByName("blogTmpAuthor")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check if main image was added
    if (imgBase64.loaded) {
      updateInvalid({ mainImg: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ mainImg: true }); //invalid
      document.getElementsByName("blogTmpImg")[0].focus();
      document.getElementsByName("blogTmpImg")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    // check if blog content is added
    if (blogContent == "" || blogContent == "<p><br></p>") {
      dataOK = false;
      updateInvalid({ content: true }); //invalid
      document.getElementsByName("blogTmpContent")[0].focus();
      document.getElementsByName("blogTmpContent")[0].scrollIntoView({ block: "center", inline: "nearest" });
    } else {
      updateInvalid({ content: false }); //ok
    }

    if (dataOK) {
      updatePost({
        id: `${postEdit ? postEdit.id : uid}`,
        author: authorRef.current?.value,
        content: blogContent,
        date: date,
        mainImg: {
          path: imgBase64.path,
          source: mainImgSourceRef.current?.value,
          style: mainPicStyle,
        },
        tags: tags,
        title: titleRef.current?.value,
        comments: postEdit ? [...postEdit.comments] : [],
        likes: postEdit ? [...postEdit.likes] : [],
      });

      //prepare html and images for the submit action
      await convertHtml();
      setShowPreview(!showPreview);
    }
  };

  //Get all the img elements and replace with {{{}}} handleBar variables,
  //to not store base64 images in the firestore but img files in storage
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
  const uploadImgAndGetReactions = async () => {
    try {
      let readyBlog = { ...post };
      let imgContent = [];
      let imgUrl = "";
      //Create object containing all necessary info about images used in the blog content
      //and upload these images to the firebase storage
      await Promise.all(
        contentImages.map(async (img, idx) => {
          imgContent.push({ fileName: img.file.name, attributes: { imgWidth: img.imgWidth } });
          await uploadFileToStorage(img.file, `images/blog/${post.id}`);
        })
      );
      //upload main image when admin is creating new blog or in editing mode user added new image
      if (editNewImage) {
        imgUrl = await uploadFileToStorage(imgFile, `images/blog/${post.id}`);
      } else {
        imgUrl = postEdit.mainImg.path;
      }
      if (postEdit) {
        const actData = await getDocById("blog", post.id);
        readyBlog.likes = [...actData.likes]
        readyBlog.comments = [...actData.comments]
      }

      //update blog data
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
      const readyBlog = await uploadImgAndGetReactions();
      if (postEdit) {
        //edit existing blog
        await updateDocFields("blog", readyBlog.id, readyBlog);
      } else {
        //create new blog
        await createDocFirestore("blog", readyBlog.id, readyBlog);
      }
      const revalidateData = {
        secret: process.env.NEXT_PUBLIC_API_KEY,
        paths: ["/admin/blogs", "/blog"]
      }
      await axios.post("/api/revalidate", revalidateData);

      router.push("/admin/blogs#main");

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
          <Link href="/admin/blogs#main">Blog Menagment</Link>
        </small>
        <small>&gt;</small>
        <small>{postEdit ? postEdit.title : "New Blog"}</small>
      </section>

      <section className="mt-2 mb-2">
        <Form className="text-start">
          <Form.Label style={{ position: "relative", top: "8px" }}>TITLE:</Form.Label>
          <Form.Control
            type="text"
            name="blogTmpTitle"
            placeholder="Add title"
            ref={titleRef}
            onChange={() => setShowPreview(false)}
            defaultValue={postEdit ? postEdit.title : ""}
            className={`${invalid.title && "border border-danger"} w-100 ${themeDarkInput}`}
          />
          {invalid.title && <small className="text-danger">Please add title.</small>}
        </Form>
      </section>
      {/* Main picture & DropZone */}
      <div
        name="blogTmpImg"
        className={`w-100 border rounded ${invalid.mainImg && "border-danger"}`}
        style={{ minHeight: mainPicHeight, position: "relative" }}
      >
        <Dropzone
          onDrop={(acceptedFiles) => {
            imgToBase64(acceptedFiles);
            setImgFile(acceptedFiles[0]);
            setEditNewImage(true);
          }}
        >
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
          style={{ objectFit: mainPicStyle, borderRadius: ".25rem" }}
        />
      </div>
      {invalid.mainImg && (
        <div className="text-start mt-0">
          <small className="text-danger">Please upload main picture.</small>
        </div>
      )}
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
            defaultValue={postEdit ? postEdit.mainImg.source : ""}
            onChange={() => setShowPreview(false)}
            className={`w-75 me-2 ${themeDarkInput}`}
          />
          <Form.Label className="me-2 mt-1">
            <small style={{ whiteSpace: "nowrap" }}>Image style:</small>
          </Form.Label>
          <Form.Select
            type="text"
            size="sm"
            id="BlogMainPicViewProp"
            onChange={changeMainPicStyle}
            className={`w-25 ${themeDarkInput}`}
          >
            <option value="cover">Cover</option>
            <option value="fill">Fill</option>
            <option value="contain">Contain</option>
            <option value="none">None</option>
            <option value="scale-down">Scale down</option>
          </Form.Select>
        </Form>
      )}
      {/* Text Editor */}
      <div className={`mt-2 border rounded w-100 ${invalid.content && "border-danger border-2"}`} name="blogTmpContent">
        <TextEditorQuill
          content={setBlogContent}
          initOnEditMode={postEdit?.content}
          placeholder={"Here is place for your blog content..."}
        />
      </div>
      {invalid.content && (
        <div className="text-start mt-0">
          <small className="text-danger">Please add some content.</small>
        </div>
      )}

      {/* Tag menager */}
      <section className="mt-2 mb-2">
        <Form className="text-start">
          <Form.Label style={{ position: "relative", top: "8px" }}>TAGS:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Eg: tag1 tag2"
            className={`w-100 ${themeDarkInput}`}
            onChange={handleTags}
            defaultValue={tagsString}
          />
        </Form>
        <div className="d-flex flex-wrap gap-2 text-start mt-2">
          {tags.length > 0 &&
            tags.map((tag, idx) => (
              <Badge key={idx} bg={themeState == "dark" ? "primary" : "dark"} className="pointer">
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
              name="blogTmpAuthor"
              onChange={() => setShowPreview(false)}
              ref={authorRef}
              defaultValue={postEdit ? postEdit.author : "BrightLightGypsy"}
              className={`${invalid.author && "border border-danger"} ${themeDarkInput}`}
            />
            {invalid.author && <small className="text-danger">Incorrect value.</small>}
          </div>
          <div className={`d-block ${isMobile && "w-100"}`}>
            <Form.Label style={{ position: "relative", top: "8px" }}>Date:</Form.Label>
            <Form.Control
              type="text"
              name="blogTmpDate"
              onChange={() => setShowPreview(false)}
              ref={dateRef}
              defaultValue={
                postEdit ? timeStampToDate(postEdit.date).toLocaleDateString() : new Date().toLocaleDateString()
              }
              className={`${invalid.date && "border border-danger"} ${themeDarkInput}`}
            />
            {invalid.date && <small className="text-danger">Incorrect value.</small>}
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
          <BlogPost post={post} preview={true} editMode={postEdit ? true : false} />
          <hr className="mt-5" />
          <div>
            <Button onClick={handleSendBlog} className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span> Loading...</span>
                </>
              ) : (
                <span className="text-uppercase">{postEdit ? "Save changes!" : "Create this Blog!"}</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default BlogTemplate;
