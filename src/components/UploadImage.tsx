import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Button, message, Image } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import { Backend_URL } from "@/lib/Constants";
const { Dragger } = Upload;
type Props = {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImage: React.FC<Props> = ({ image, setImage }) => {
  const props: UploadProps = {
    name: "file",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error("Please upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const image = await uploadImageAPI(file);
        //@ts-ignore
        onSuccess(null, file);
        setImage(image.url);
      } catch (error) {
        console.log(error);
        //@ts-ignore
        onError(error);
      }
    },
    maxCount: 1,
  };

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

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Only JPG/PNG file with size smaller than 2MB
      </p>
    </Dragger>
  );
};

export default UploadImage;
