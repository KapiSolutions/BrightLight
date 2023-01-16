import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import { uploadFileToStorage } from "../../../../firebase/Storage";
import placeholder from "../../../../utils/placeholder";
import TextEditorQuill from "../../../../components/TextEditorQuill";
import Dropzone from "react-dropzone";
import styles from "../../../../styles/components/Admin/Blogs.module.scss";
const parse = require("html-react-parser");

function AdminNewBlogPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const themeState = useDeviceStore((state) => state.themeState);
  const { isAuthenticated, isAdmin } = useAuth();
  const [blogContent, setBlogContent] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(placeholder("pinkPX"));
  const [imgUrlLoading, setImgUrlLoading] = useState(false);
  const [mainPicStyle, setMainPicStyle] = useState("cover");
  const router = useRouter();
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

  const uploadMainPic = async () => {
    setImgUrlLoading(true);

    try {
      const url = await uploadFileToStorage(imgFile[0], "blog/sda");
      setImgUrl(url);
    } catch (e) {
      console.log(e);
    }
    setImgUrlLoading(false);
  };

  const changeMainPicStyle = (e) => {
    setMainPicStyle(e?.target.value);
  };

  const selectedImgToBase64 = (files) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgUrl(reader.result);
      //console.log(reader.result);
      // Logs data:image/jpeg;base64,wL2dvYWwgbW9yZ...
      //? Convert to Base64 string
      // const getBase64StringFromDataURL = (dataURL) => dataURL.replace("data:", "").replace(/^.+,/, "");
      // const base64 = getBase64StringFromDataURL(reader.result);
      // Logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(files[0]);
  };

  return (
    <>
      <Head>
        <title>BrightLight | Admin - New Blog</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="ab-ctx">
        <h1>Create new Blog</h1>
        <div className="text-end mb-2 mt-5">
          {/* <Button className="mt-2" onClick={selectedImgToBase64} disabled={imgUrlLoading}>
            {imgUrlLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload main picture</span>
            )}
          </Button> */}
          <div className="d-flex align-items-center justify-content-end  mt-3">
            <span className="me-2">Image style:</span>
            <Form style={{ width: "120px" }}>
              <Form.Select type="text" id="BlogMainPicViewProp" onChange={changeMainPicStyle}>
                <option value="cover">Cover</option>
                <option value="fill">Fill</option>
                <option value="contain">Contain</option>
                <option value="none">None</option>
                <option value="scale-down">Scale down</option>
              </Form.Select>
            </Form>
          </div>
        </div>
        <div className="w-100 border mb-2 " style={{ minHeight: "150px", position: "relative" }}>
          <Dropzone onDrop={(acceptedFiles) => selectedImgToBase64(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section style={{ position: "relative", zIndex: 100 }}>
                <div
                  className={`${
                    imgFile && imgUrl ? styles.DropSectionLoaded : styles.DropSection
                  } color-primary pointer`}
                  style={{ minHeight: "150px" }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div className="mt-3">
                    {imgFile ? (
                      <>
                        {imgUrl ? (
                          <p className="border rounded p-1 me-3">Select or Drop another file.</p>
                        ) : (
                          <p>Selected File: {imgFile[0].name}</p>
                        )}
                      </>
                    ) : (
                      <p>Drag &#39;n&#39; drop some files here, or click to select files</p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
          <Image src={imgUrl} fill alt="uploaded file" style={{ objectFit: mainPicStyle }} />

          {!imgUrl && <p className="text-center text-uppercase mt-2">Main Blog picture</p>}
        </div>

        <TextEditorQuill placeholder={"Here is place for your blog content..."} content={setBlogContent} />

        <div className="text-start">
          Output html:
          {parse(blogContent)}
        </div>
        <Image src="data:image/webp;base64,UklGRjoBAABXRUJQVlA4IC4BAADwCwCdASoyAD8APp0+m0iloyKhMBYLALATiUAX3oQ6IJImjkF9CZXgvWUXr5sA58i1cH6qPJrncoZfDDpcTkmeoJOpNz6i8UnEWJ17L24hd32PR/HflmfJJgK9sEszxrWpyiaM8mQwaADyNJLXZ8KaKtKf+q8KJ8QQcxQUvVq2n2DwhfQWpztU/+TkTuzHzwrykCRWoOjfWbs2fSP5Gc1PMW7ArA/+AFhiCpOnNCm7FvDLuBk/cwTVnEgGfGPWYuAMCGmTsSBJHtQX/B9Wu6xktT0cBQS7aReTd9dWMftDeOsLFqd7tTGFvoZWQZ+DPpUf/Kx6cUglrp1IaD4NeVLT9UOPzUGxl8E2BBiBlEKCAuQP37hvNRODLHd5uX73kPnFiIla0ON5gJdTtzWgAA==" width="50" height="63" alt="uploaded file"/>
      </Container>
    </>
  );
}

export default AdminNewBlogPage;
