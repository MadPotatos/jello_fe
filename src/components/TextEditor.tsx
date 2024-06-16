import { Backend_URL } from "@/lib/Constants";
import React, { useCallback, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface OnChangeHandler {
  (e: any): void;
}

type Props = {
  value: string;
  placeholder: string;
  className?: string;
  onChange: OnChangeHandler;
};

const COLORS = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466",
];

const TextEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const reactQuillRef = useRef<ReactQuill>(null);

  async function uploadImageAPI(file: any) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch(Backend_URL + "/upload-cloudinary/image", {
      method: "POST",
      body: data,
    });
    const image = await res.json();
    return image;
  }

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const { url } = await uploadImageAPI(file);
        const quill = reactQuillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          range && quill.insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          {
            color: COLORS,
          },
        ],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "code", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "list",
    "bullet",
    "indent",
    "link",
    "code",
    "image",
  ];

  return (
    <ReactQuill
      ref={reactQuillRef}
      theme="snow"
      className={className}
      value={value || ""}
      modules={modules}
      formats={formats}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default TextEditor;
