import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Button, message, Image } from "antd";
import { RcFile, UploadProps } from "antd/es/upload";
import { Backend_URL } from "@/lib/Constants";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("UploadImage");
  const props: UploadProps = {
    name: "file",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(t("successUpload"));
      } else if (info.file.status === "error") {
        message.error(t("uploadFailed"));
      }
    },
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        message.error(t("fileError"));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t("fileSizeError"));
        return false;
      }
      return isJpgOrPng && isLt2M;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const image = await uploadImageAPI(file);
        //@ts-ignore
        onSuccess(null, file);
        if (image) {
          setImage(image.url);
        }
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
      <p className="ant-upload-text">{t("dragAndDrop")}</p>
      <p className="ant-upload-hint">{t("onlyJpgPng")}</p>
    </Dragger>
  );
};

export default UploadImage;
