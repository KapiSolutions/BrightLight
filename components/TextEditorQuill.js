import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
  const [editorState, setEditorState] = useState("");
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
    "align"
  ];

  const loadQuill = async () => {
    const Quill = await require("react-quill").Quill;
    setModules({
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ align: [] },{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
      ],
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    });

    return setEnableEditor(true);
  };

  useEffect(() => {
    loadQuill();
    //If editor is enabled in the edit post mode then use the post content on init in editor
    if (props.initOnEditMode) {
      setEditorState(props.initOnEditMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
      setEditorState(props.updateContent);
  }, [props.updateContent]);

  return (
    <div>
      {enableEditor && (
        <ReactQuill
          theme={"snow"}
          className="color-primary"
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
      )}
    </div>
  );
}

export default TextEditorQuill;
