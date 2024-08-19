import { ResourceType } from "@/shared/enums/resourceType";
import { IFile } from "@/shared/interface/file";
import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Upload from "../icon/Upload";
import { getFileExtension } from "@/shared/utils/common/function";
import { ETYPEFILE } from "@/shared/enums/fileType";
import Word from "../icon/Word";
import Pdf from "../icon/Pdf";
import Excel from "../icon/Excel";
import { Col, Image, Row } from "antd";
import { FormikErrors, FormikTouched } from "formik";
interface IProps {
  id: string;
  name: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  value: string | IFile[] | any;
  selectedFiles?: any[];
  buttonTitle?: string;
  multiFiles?: boolean;
  onChange?: (value: IFile[]) => void;
  isHideButton?: boolean;
  className?: string;
  maxWidth?: number;
  isMultiple?: boolean;
  resourceTypes: ResourceType;
  disabled?: boolean;
  direction?: "vertical" | "horizontal";
  isRequired?: boolean;
  label?: string;
  placeholder?: string;
  buttonClose?: boolean;
  errors?: FormikErrors<any>;
  touched?: FormikTouched<any>;
}

const FormCkFinder = forwardRef(function FormCkFinder(props: IProps, ref?: ForwardedRef<any>) {
  const {
    name,
    setFieldValue,
    value,
    selectedFiles = [],
    disabled = false,
    multiFiles = false,
    buttonTitle = "Tải lên ảnh",
    onChange,
    isHideButton,
    className,
    maxWidth,
    direction,
    isRequired,
    resourceTypes,
    label,
    placeholder,
    isMultiple,
    buttonClose,
    errors,
    touched,
    id,
  } = props;
  const [imageLink, setImageLink] = useState(value);

  useEffect(() => {
    if (!value) return;
    setImageLink(value);
  }, [value]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://ckeditor.com/apps/ckfinder/3.5.0/ckfinder.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const handleCkFinder = () => {
    // Open CKFinder when button is clicked
    // CKFinder instance should be available globally after initialization
    // Here you can access CKFinder and open it programmatically
    if (window.CKFinder) {
      const finder = window.CKFinder;
      finder.popup({
        chooseFiles: true,
        resourceType: resourceTypes,
        onInit: function (finder: any) {
          finder.on("files:choose", function (evt: any) {
            const files = evt.data.files.map((element: any) => ({
              name: element.attributes.name,
              path: element.getUrl(),
            }));

            onChange && onChange([...value, ...files]);
          });
          finder.on("file:choose:resizedImage", function (evt: any) {});
        },
      });
    } else {
      console.error("CKFinder is not initialized yet");
    }
  };

  const handleDeleteFile = (indexToDelete: Number) => {
    const updatedFilesList = value.filter((_: any, index: Number) => index !== indexToDelete);
    onChange && onChange(updatedFilesList);
  };
  const Label = () => <div className={`text-medium-md leading-0 ${isRequired ? "required-start" : ""}`}>{label}</div>;

  const Button = () => (
    <>
      <button
        className="ck-finder-button"
        onClick={(e) => {
          e.preventDefault();
          handleCkFinder();
        }}
        disabled={disabled}
      >
        <p className="ck-finder-button-text text-semibold-sm">{placeholder ?? "Chọn"}</p>
        <Upload color="#1b4ab6" />
      </button>
    </>
  );
  const Error = () => errors && !!errors[id] && touched && touched[id] && <div className="block">{`${errors[id]}`}</div>;

  const SelectedFile = () => (
    <div className="mt-2 flex w-full flex-row flex-wrap gap-2">
      {!!value &&
        value?.map((file: any, index: number) => {
          const fileExt = getFileExtension(file.path);
          const fileName = file.name;
          if (fileExt === ETYPEFILE.IMAGE) {
            return (
              <div key={index} className={`relative flex items-start justify-center gap-1`}>
                {(!isMultiple && value?.length === 1) || (isMultiple && value?.length > 0) ? (
                  <Image key={index} src={file.path} alt={fileName} width="200px" preview />
                ) : null}
                {buttonClose && !disabled && (
                  <i
                    className={`${!!disabled ? "pointer-events-none" : "cursor-pointer"} pi pi-times absolute right-1 top-1 bg-red-500 text-white`}
                    onClick={() => handleDeleteFile(index)}
                  ></i>
                )}
              </div>
            );
          }

          if (fileExt === ETYPEFILE.WORD) {
            return (
              <div
                key={index}
                className={`focus:border-indigo-500 focus:ring-indigo-500 w-full items-center rounded border border-gray-300 px-4 py-3 shadow-sm sm:text-sm`}
              >
                <div className="flex items-center">
                  <Word width={24} height={30} />
                  <a className="text-gray-900 ml-2 flex-1" href={file.path} target="_blank">
                    {fileName}
                  </a>
                </div>
                {!disabled && (
                  <i
                    className={`${!!disabled ? "pointer-events-none" : "cursor-pointer"} pi pi-minus text-red-500`}
                    onClick={() => handleDeleteFile(index)}
                  ></i>
                )}
              </div>
            );
          }

          if (fileExt === ETYPEFILE.PDF) {
            return (
              <div
                key={index}
                className={`focus:border-indigo-500 focus:ring-indigo-500 w-full items-center rounded border border-gray-300 px-4 py-3 shadow-sm sm:text-sm`}
              >
                <div className="flex items-center gap-2">
                  <Pdf width={24} height={30} />
                  <a className="text-gray-900 ml-2 flex-1" href={file.path} target="_blank">
                    {fileName}
                  </a>
                </div>
                {!disabled && (
                  <i
                    className={`${!!disabled ? "pointer-events-none" : "cursor-pointer"} pi pi-minus text-red-500`}
                    onClick={() => handleDeleteFile(index)}
                  ></i>
                )}
              </div>
            );
          }

          if (fileExt === ETYPEFILE.EXCEL) {
            return (
              <div
                key={index}
                className={`focus:border-indigo-500 focus:ring-indigo-500 w-full items-center rounded border border-gray-300 px-4 py-3 shadow-sm sm:text-sm`}
              >
                <div className="flex items-center gap-2">
                  <Excel width={24} height={30} />
                  <a className="text-gray-900 ml-2 flex-1" href={file.path} target="_blank">
                    {fileName}
                  </a>
                </div>
                {!disabled && (
                  <i
                    className={`${!!disabled ? "pointer-events-none" : "cursor-pointer"} pi pi-minus text-red-500`}
                    onClick={() => handleDeleteFile(index)}
                  ></i>
                )}
              </div>
            );
          }
          return <></>;
        })}
    </div>
  );
  return direction === "vertical" ? (
    <div ref={ref} className="flex w-full items-start justify-start gap-5">
      <div className={`flex ${className} items-center gap-3`}>
        {label ? <Label /> : ""}
        <Button />
      </div>
      <SelectedFile />
      <Error />
    </div>
  ) : (
    <Row ref={ref}>
      <Col xs={24} lg={6}>
        <Label />
      </Col>
      <Col xs={24} lg={18}>
        <Button />
        <SelectedFile />
        <Error />
      </Col>
    </Row>
  );
});

export default FormCkFinder;
