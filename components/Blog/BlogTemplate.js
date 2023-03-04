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
import SuccessModal from "../Modals/SuccessModal";
import { SiGoogletranslate } from "react-icons/si";

function BlogTemplate(props) {
  const router = useRouter();
  const locale = router.locale;
  const postEdit = props.post;
  const titleRef_en = useRef();
  const titleRef_pl = useRef();
  const authorRef = useRef();
  const dateRef = useRef();
  const mainImgSourceRef = useRef();

  const isMobile = useDeviceStore((state) => state.isMobile);
  const theme = useDeviceStore((state) => state.themeState);
  const [langPreview, setLangPreview] = useState(locale);
  const [showSuccess, setShowSuccess] = useState("");
  const [blogContent_en, setBlogContent_en] = useState("");
  const [finalContent_en, setFinalContent_en] = useState("");
  const [blogContent_pl, setBlogContent_pl] = useState("");
  const [finalContent_pl, setFinalContent_pl] = useState("");
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
    content: {
      en: "",
      pl: "",
    },
    date: "",
    mainImg: {
      path: "",
      source: "",
      style: "",
    },
    contentImages: [],
    tags: [],
    title: {
      en: "",
      pl: "",
    },
    comments: [],
    likes: [],
  };
  const [post, updatePost] = useReducer((state, updates) => ({ ...state, ...updates }), initPost);
  const [previewPost, setPreviewPost] = useState(null);
  const mainPicHeight = "200px";
  const themeDarkInput = theme == "dark" ? "bg-accent6 text-light" : "";

  //Update Blog content on evry editor state change
  useEffect(() => {
    setShowPreview(false);
    updateInvalid({ content: false });
  }, [blogContent_en]);

  //Create string form tags array when edit mode is enabled
  useEffect(() => {
    if (postEdit) {
      setImgBase64({ loaded: true, path: postEdit.mainImg.path }); //set url instead of base64
      updateInvalid({ mainImg: false }); //main img setted
      setBlogContent_en(postEdit.content.en);
      setBlogContent_pl(postEdit.content.pl);
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

  const onDropFunc = (files) => {
    //Change main image name to "main"
    // const oldName = files[0].name
    // const newName = "main" + oldName.slice(oldName.lastIndexOf("."), oldName.length)
    // const blob = new Blob([new Uint8Array(files[0])], {type: files[0].type });
    // let tmpFile = new File([blob], newName, {type: files[0].type}) ;
    imgToBase64(files);
    setImgFile(files[0]);
    setEditNewImage(true);
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
    if (titleRef_en.current?.value != "") {
      updateInvalid({ title: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ title: true }); //invalid
      document.getElementsByName("blogTmpTitle")[0].focus();
      document.getElementsByName("blogTmpTitle")[0].scrollIntoView({ block: "center", inline: "nearest" });
    }
    if (titleRef_pl.current?.value != "") {
      updateInvalid({ title: false }); //ok
    } else {
      dataOK = false;
      updateInvalid({ title: true }); //invalid
      document.getElementsByName("blogTmpTitlePL")[0].focus();
      document.getElementsByName("blogTmpTitlePL")[0].scrollIntoView({ block: "center", inline: "nearest" });
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
    if (blogContent_en == "" || blogContent_en == "<p><br></p>") {
      dataOK = false;
      updateInvalid({ content: true }); //invalid
      document.getElementsByName("blogTmpContent")[0].focus();
      document.getElementsByName("blogTmpContent")[0].scrollIntoView({ block: "center", inline: "nearest" });
    } else {
      updateInvalid({ content: false }); //ok
    }
    if (blogContent_pl == "" || blogContent_pl == "<p><br></p>") {
      dataOK = false;
      updateInvalid({ content: true }); //invalid
      document.getElementsByName("blogTmpContentPL")[0].focus();
      document.getElementsByName("blogTmpContentPL")[0].scrollIntoView({ block: "center", inline: "nearest" });
    } else {
      updateInvalid({ content: false }); //ok
    }

    if (dataOK) {
      const data = {
        id: `${postEdit ? postEdit.id : uid}`,
        author: authorRef.current?.value,
        content: {
          en: blogContent_en,
          pl: blogContent_pl,
        },
        date: date,
        mainImg: {
          path: imgBase64.path,
          source: mainImgSourceRef.current?.value,
          style: mainPicStyle,
        },
        tags: tags,
        title: {
          en: titleRef_en.current?.value,
          pl: titleRef_pl.current?.value,
        },
        comments: postEdit ? [...postEdit.comments] : [],
        likes: postEdit ? [...postEdit.likes] : [],
      };
      updatePost({...data}); //data for the database
      data.title = data.title[langPreview];
      data.content = data.content[langPreview];
      data.contentImages = [];
      setPreviewPost(data); //data for the preview

      //prepare html and images for the submit action
      setFinalContent_en(await convertHtml(blogContent_en));
      setFinalContent_pl(await convertHtml(blogContent_pl));
      setShowPreview(!showPreview);
    }
  };

  //Get all the img elements and replace with {{{}}} handleBar variables,
  //to not store base64 images in the firestore but img files in storage
  const convertHtml = async (tmpContent) => {
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
    return tmpContent;
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
        readyBlog.likes = [...actData.likes];
        readyBlog.comments = [...actData.comments];
      }

      //update blog data
      readyBlog.content = {
        en: finalContent_en,
        pl: finalContent_pl,
      };
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
        paths: ["/admin/blogs", "/blog"],
      };
      if (postEdit) {
        revalidateData.paths.push(`/blog/${readyBlog.id}`);
      }

      await axios.post("/api/revalidate", revalidateData);
      setShowSuccess(postEdit ? "Blog post edited successfuly!" : "Blog post created successfuly!");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const translateText = async (inputText, outputText, from, to) => {
    let translatedTxt = "";
    if (inputText != "") {
      try {
        const res = await axios.get(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(
            inputText
          )}`
        );
        res.data[0].map((text) => {
          translatedTxt += text[0];
        });
        outputText.current.value = translatedTxt;
        // console.log(translatedTxt);
      } catch (error) {
        console.log(error);
      }
    } else {
      outputText.current.value = "";
    }
  };

  const translateContent = async (inputText, outputText, from, to) => {
    let translatedTxt = "";

    if (inputText != "") {
      try {
        const res = await axios.get(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(
            inputText
          )}`
        );
        res.data[0].map((text) => {
          translatedTxt += text[0];
        });
        outputText(translatedTxt);
        // console.log(translatedTxt);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <section className="d-flex gap-1">
        <small>
          <Link href="/admin/blogs#main">Blog Menagment</Link>
        </small>
        <small>&gt;</small>
        <small>{postEdit ? postEdit.title[locale] : "New Blog"}</small>
      </section>

      {/* Name of the product */}
      <section className="mt-2 mb-2">
        <Form className={`d-flex text-start align-items-end ${isMobile && "flex-wrap"}`}>
          <div className={`w-100 ${!isMobile && "me-2"}`}>
            <Form.Label style={{ position: "relative", top: "8px" }}>Title:</Form.Label>
            <Form.Control
              type="text"
              name="blogTmpTitle"
              placeholder="Add title"
              ref={titleRef_en}
              onChange={() => setShowPreview(false)}
              defaultValue={postEdit ? postEdit.title.en : ""}
              className={`${invalid.title && "border border-danger"} w-100 ${themeDarkInput}`}
            />
            {isMobile && locale == "pl" && (
              <div style={{ height: "0" }}>
                <Button
                  variant={`outline-${theme == "dark" ? "light" : "dark"}`}
                  size="sm"
                  className="d-flex align-items-center ms-auto me-0"
                  style={{ position: "relative", top: "-35px", right: "3px" }}
                  onClick={() => {
                    translateText(titleRef_pl.current.value, titleRef_en, "pl", "en");
                  }}
                >
                  <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                </Button>
              </div>
            )}
          </div>

          {!isMobile && (
            <div>
              <Button
                variant={`outline-${theme == "dark" ? "light" : "accent1"}`}
                className="d-flex align-items-center"
                onClick={() => {
                  locale == "en" && translateText(titleRef_en.current.value, titleRef_pl, "en", "pl");
                  locale == "pl" && translateText(titleRef_pl.current.value, titleRef_en, "pl", "en");
                }}
              >
                <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
              </Button>
            </div>
          )}

          <div className={`w-100 ${!isMobile && "ms-2"}`}>
            <Form.Label style={{ position: "relative", top: "8px" }}>Tytuł:</Form.Label>
            <Form.Control
              type="text"
              name="blogTmpTitlePL"
              placeholder="Dodaj nazwę"
              ref={titleRef_pl}
              onChange={() => setShowPreview(false)}
              defaultValue={postEdit ? postEdit.title.pl : ""}
              className={`${invalid.title && "border border-danger"} w-100 ${themeDarkInput}`}
            />
            {isMobile && locale == "en" && (
              <div style={{ height: "0" }}>
                <Button
                  variant={`outline-${theme == "dark" ? "light" : "dark"}`}
                  size="sm"
                  className="d-flex align-items-center ms-auto me-0"
                  style={{ position: "relative", top: "-35px", right: "3px" }}
                  onClick={() => {
                    translateText(titleRef_en.current.value, titleRef_pl, "en", "pl");
                  }}
                >
                  <SiGoogletranslate style={{ width: "22px", height: "22px" }} />
                </Button>
              </div>
            )}
          </div>
        </Form>
        {invalid.title && <small className="text-danger">Please add title.</small>}
        {isMobile && (
          <div className="mt-3 pt-1">
            <hr />
          </div>
        )}
      </section>
      {/* Main picture & DropZone */}
      <div
        name="blogTmpImg"
        className={`w-100 border rounded ${invalid.mainImg && "border-danger"}`}
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
      {/* Content EN */}
      <p className="mt-2 mb-0 text-start">Content:</p>
      <div className={`border rounded w-100 ${invalid.content && "border-danger border-2"}`} name="blogTmpContent">
        <TextEditorQuill
          content={setBlogContent_en}
          initOnEditMode={postEdit?.content.en}
          updateContent={blogContent_en}
          placeholder={"Here is place for your blog content..."}
        />
        {locale == "pl" && (
          <div style={{ height: "0" }}>
            <Button
              variant={`outline-${theme == "dark" ? "light" : "dark"}`}
              size="sm"
              className="d-flex align-items-center ms-auto me-0"
              style={{ position: "relative", top: "-35px", right: "3px" }}
              onClick={() => {
                translateContent(blogContent_pl, setBlogContent_en, "pl", "en");
              }}
              title="Translate from PL to EN"
            >
              <SiGoogletranslate style={{ width: "22px", height: "22px" }} title="Translate from PL to EN" />
            </Button>
          </div>
        )}
      </div>
      {invalid.content && (
        <div className="text-start mt-0">
          <small className="text-danger">Please add some content.</small>
        </div>
      )}
      {/* Content PL */}
      <p className="mt-2 mb-0 text-start">Treść:</p>
      <div className={`border rounded w-100 ${invalid.content && "border-danger border-2"}`} name="blogTmpContent">
        <TextEditorQuill
          content={setBlogContent_pl}
          initOnEditMode={postEdit?.content.pl}
          updateContent={blogContent_pl}
          placeholder={"Dodaj treść swojego bloga..."}
        />
        {locale == "en" && (
          <div style={{ height: "0" }}>
            <Button
              variant={`outline-${theme == "dark" ? "light" : "dark"}`}
              size="sm"
              className="d-flex align-items-center ms-auto me-0"
              style={{ position: "relative", top: "-35px", right: "3px" }}
              onClick={() => {
                translateContent(blogContent_en, setBlogContent_pl, "en", "pl");
              }}
              title="Translate from EN to PL"
            >
              <SiGoogletranslate style={{ width: "22px", height: "22px" }} title="Translate from EN to PL" />
            </Button>
          </div>
        )}
      </div>
      {invalid.content && (
        <div className="text-start mt-0">
          <small className="text-danger">Please add some content.</small>
        </div>
      )}

      {/* Tag menager */}
      <section className="mt-2 mb-2">
        <Form className="text-start">
          <Form.Label style={{ position: "relative", top: "8px" }}>Tags:</Form.Label>
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
              <Badge key={idx} bg={theme == "dark" ? "primary" : "dark"} className="pointer">
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
        <Button
        className="ms-1"
        variant="outline-primary"
          onClick={() => {
            setLangPreview(langPreview == "en" ? "pl" : "en");
            setShowPreview(false);
          }}
        >
          <span className="text-uppercase">{langPreview}</span>
        </Button>
      </div>
      {showPreview && (
        <div className="mt-4">
          <hr />
          <BlogPost post={previewPost} preview={true} editMode={postEdit ? true : false} />
          <hr className="mt-5" />
          <div>
            <Button
              onClick={handleSendBlog}
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
                <span className="text-uppercase">{postEdit ? "Save changes!" : "Create this Blog!"}</span>
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

export default BlogTemplate;
