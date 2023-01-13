import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // (if using Next.js or use own dynamic loader)
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import styles from "../styles/components/Admin/Blogs.module.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { uploadFileToStorage } from "../firebase/Storage";
const parse = require('html-react-parser');
import DOMPurify from 'dompurify';


//? in development mode set reactStrictMode: false (next.config)

function TextEditor(props) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);

  useEffect(() => {
    // let html = convertToHTML(editorState.getCurrentContent());
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    setConvertedContent(html);
  }, [editorState]);

  const uploadImageCallBack = async (file) => {
    if (!file) return;
    const url = await uploadFileToStorage(file, "blog/sda1d12dsss");
    return { data: { link: url } };
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        toolbarClassName={styles.toolbar}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,
            previewImage: true,
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: false },
            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
            defaultSize: {
              height: "auto",
              width: "auto",
            },
          },
        }}
      />
      <div className="mt-4 text-start">
        <p>Preview:</p>
        {parse(DOMPurify.sanitize(`${convertedContent ? convertedContent : ""}`))}
      </div>
    </div>
  );
}

export default TextEditor;
