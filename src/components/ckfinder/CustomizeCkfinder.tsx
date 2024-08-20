import { CKEditor } from "@ckeditor/ckeditor5-react";
// import Editor from "ckeditor5-custom-build";
import * as Editor from "ckeditor5-custom-build";
import "./ckfinder.scss";
const defaultToolbar = {
  items: [
    "heading",
    "|",
    "fontFamily",
    "fontBackgroundColor",
    "fontColor",
    "fontSize",
    "highlight",
    "|",
    "bold",
    "italic",
    "underline",
    "link",
    "alignment",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "imageUpload",
    "blockQuote",
    "insertTable",
    "undo",
    "redo",
    "horizontalLine",
    "pageBreak",
    "|",
    "findAndReplace",
    "selectAll",
  ],
};

const simpleToolbar = {
  items: [
    "bold",
    "italic",
    "underline",
    "link",
    "|",
    "alignment",
    "bulletedList",
    "numberedList",
    "|",
    "imageUpload",
    "blockQuote",
    "insertTable",
    "undo",
    "redo",
  ],
};
interface ICustomEditorProps {
  id: string;
  readonly?: boolean;
  value?: string;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  name: string;
  simpleMode?: boolean;
  size?: "sm" | "lg";
  noBorder?: boolean;
  onChange?: (value: string) => void;
}

const CustomFormikEditor = (props: ICustomEditorProps) => {
  const { readonly, setFieldValue, value, name, simpleMode, size, noBorder, id, onChange } = props;

  return (
    <div className={`custom-editor ${size ? `size-${size}` : ""} ${noBorder ? "no-border" : ""}`}>
      <CKEditor
        editor={Editor}
        data={value || ""}
        onChange={(event: any, editor: any) => {
          if (!editor) return;

          const data = editor.getData();
          setFieldValue && setFieldValue(name, data || "");
          onChange && onChange(data);
        }}
        onReady={(editor: any) => {
          if (editor) {
            const toolbarElement = editor?.ui?.view?.toolbar?.element || null;
            if (readonly) {
              editor.enableReadOnlyMode(id);
              if (toolbarElement) {
                toolbarElement.style.display = "none";
              }
            } else {
              editor.disableReadOnlyMode(id);
              if (toolbarElement) {
                toolbarElement.style.display = "block";
              }
            }
          }
        }}
        config={{
          toolbar: simpleMode ? simpleToolbar : defaultToolbar,
          removePlugins: ["Title", "SpecialCharacters"],
          simpleUpload: {
            uploadUrl: `https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json`,

            // withCredentials: true,
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // },
          },
        }}
      />
    </div>
  );
};

export default CustomFormikEditor;
