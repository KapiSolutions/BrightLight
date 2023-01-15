import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
Quill.register("modules/imageResize", ImageResize);

function TextEditorQuill(props) {
  const [editorState, setEditorState] = useState("");

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

  if (document) {
    return (
      <ReactQuill
        theme={"snow"}
        onChange={(html) => {
          setEditorState(html);
          props.content(DOMPurify.sanitize(html)); //send sanitized html to parent
        }}
        value={editorState}
        modules={modules}
        formats={formats}
        bounds={"#root"}
        placeholder={props.placeholder}
      />
    );
  } else {
    return <textarea value={props.placeholder} />;
  }
}

export default TextEditorQuill;
