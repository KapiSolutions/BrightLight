import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import ReactQuill, { Quill } from "react-quill";
// import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";

//! I option
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const { default: ImageResize } = await import("quill-image-resize-module-react");
    // const ImageResize  = await require("quill-image-resize-module-react").ImageResize
    RQ.Quill.register("modules/imageResize", ImageResize);

    return function forwardRef({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
  }
);

import DOMPurify from "dompurify";

function TextEditorQuill(props) {
  const [editorState, setEditorState] = useState({ html: "" });
  const [enableEditor, setEnableEditor] = useState(false);
  // Quill modules https://quilljs.com/docs/modules/
  const [modules, setModules] = useState({});
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

  const loadQuill = async () => {
    const Quill = await require("react-quill").Quill;
    setModules({
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
    });

    return setEnableEditor(true);
  };

  useEffect(() => {
    loadQuill();
  }, []);

  return (
    <div>
      {enableEditor && (
        <ReactQuill
          theme={"snow"}
          onChange={(html) => {
            setEditorState({ html: html });
            props.content(DOMPurify.sanitize(html)); //send sanitized html to parent
          }}
          value={editorState.html}
          modules={modules}
          formats={formats}
          bounds={"#root"}
          placeholder={props.placeholder}
        />
      )}
    </div>
  );
}

export default TextEditorQuill;
