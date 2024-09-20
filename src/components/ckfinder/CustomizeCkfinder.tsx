import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";
import "./ckfinder.scss";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Editor from "ckeditor5-custom-build";

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
  const { readonly, setFieldValue, value, name, size, noBorder, id, onChange } = props;
  const ckEditorConfig = {
    removePlugins: ["Title", "MediaEmbedToolbar"],
    toolbar: {
      shouldNotGroupWhenFull: true,
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "bulletedList",
        "numberedList",
        "outdent",
        "indent",
        "alignment",
        "|",
        "link",
        "blockQuote",
        // 'imageUpload',
        "mediaEmbed",
        "insertTable",
        "|",
        "undo",
        "redo",
        "specialCharacters",
        "|",
        "pageBreak",
        "findAndReplace",
        "horizontalLine",
        "|",
        // 'style',
        "fontFamily",
        "fontSize",
        "fontColor",
        "fontBackgroundColor",
        "highlight",
      ],
    },

    image: {
      toolbar: ["imageTextAlternative", "toggleImageCaption", "imageStyle:inline", "imageStyle:block", "imageStyle:side", "linkImage"],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableCellProperties", "tableProperties"],
    },
    ckfinder: {
      uploadUrl: "https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json",
      // Upload the images to the server using the CKFinder QuickUpload command.
      // uploadUrl: 'https://ckfinder.metasol.vn/',
      // Define the CKFinder configuration (if necessary).
      options: {
        resourceType: "Images",
        rememberLastFolder: false,
      },
    },
  };
  return (
    <div className={`custom-editor w-full ${size ? `size-${size}` : ""} ${noBorder ? "no-border" : ""}`}>
      <CKEditor
        //@ts-ignore
        editor={Editor}
        data={value || ""}
        //@ts-ignore
        onChange={(event: any, editor: any) => {
          if (!editor) return;
          const data = editor?.getData();
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
        config={ckEditorConfig}
      />
    </div>
  );
};

export default CustomFormikEditor;
