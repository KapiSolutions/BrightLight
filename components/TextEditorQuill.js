import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import DOMPurify from 'dompurify';

Quill.register("modules/imageResize", ImageResize);

function TextEditorQuill(props) {
  const [editorState, setEditorState] = useState({ html: "" });
  
  // Quill modules https://quilljs.com/docs/modules/
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };

  // Quill editor formats https://quilljs.com/docs/formats/
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <ReactQuill
      theme={"snow"}
      onChange={(html) => {
        setEditorState({ html: html });
        props.content(DOMPurify.sanitize(html));//send sanitized html to parent
      }}
      value={editorState.html}
      modules={modules}
      formats={formats}
      bounds={"#root"}
      placeholder={props.placeholder}
    />
  );
}

export default TextEditorQuill;
