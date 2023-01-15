import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthProvider";
import { useDeviceStore } from "../../../../stores/deviceStore";
import placeholder from "../../../../utils/placeholder";
import Image from "next/image";
import { uploadFileToStorage } from "../../../../firebase/Storage";
import TextEditorQuill from "../../../../components/TextEditorQuill";
const parse = require('html-react-parser');

function AdminNewBlogPage() {
  const isMobile = useDeviceStore((state) => state.isMobile);
  const { isAuthenticated, isAdmin } = useAuth();
  const [blogContent, setBlogContent] = useState("");
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

  useEffect(() => {
    console.log("blog: ", blogContent);
  }, [blogContent]);

  const uploadMainPic = async (e) => {
    e.preventDefault();
    setImgUrlLoading(true);
    const file = e.target[0]?.files[0];
    try {
      const url = await uploadFileToStorage(file, "blog/sda");
      setImgUrl(url);
    } catch (e) {
      console.log(e);
    }
    setImgUrlLoading(false);
  };

  const changeMainPicStyle = (e) => {
    setMainPicStyle(e?.target.value);
  };

  return (
    <>
      <Head>
        <title>BrightLight | Admin - New Blog</title>
      </Head>
      <Container className="justify-content-center text-center mt-5 color-primary" id="ab-ctx">
        <h1>Create new Blog</h1>
        <div className="text-end mb-2 mt-5">
          <Form onSubmit={uploadMainPic} className="ms-auto">
            <Form.Control type="file" placeholder="Choose file" />
            <Button type="submit" className="mt-2" disabled={imgUrlLoading}>
              {imgUrlLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Add main picture</span>
              )}
            </Button>
          </Form>

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
          <Image src={imgUrl} fill alt="uploaded file" style={{ objectFit: mainPicStyle }} />
        </div>

        <TextEditorQuill placeholder={"Write something..."} content={setBlogContent} />
        <br/><br/>
        <div className="text-start">
        Output html:
        {parse(blogContent)}
        </div>
      </Container>
    </>
  );
}

export default AdminNewBlogPage;
