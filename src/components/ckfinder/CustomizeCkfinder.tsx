import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5/ckeditor5.css";
import "./ckfinder.scss";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// const defaultToolbar = {
//   items: [
//     "heading",
//     "|",
//     "fontFamily",
//     "fontBackgroundColor",
//     "fontColor",
//     "fontSize",
//     "highlight",
//     "|",
//     "bold",
//     "italic",
//     "underline",
//     "link",
//     "alignment",
//     "bulletedList",
//     "numberedList",
//     "|",
//     "outdent",
//     "indent",
//     "|",
//     "imageUpload",
//     "blockQuote",
//     "insertTable",
//     "undo",
//     "redo",
//     "horizontalLine",
//     "pageBreak",
//     "|",
//     "findAndReplace",
//     "selectAll",
//   ],
// };

// const simpleToolbar = {
//   items: [
//     "bold",
//     "italic",
//     "underline",
//     "link",
//     "|",
//     "alignment",
//     "bulletedList",
//     "numberedList",
//     "|",
//     "imageUpload",
//     "blockQuote",
//     "insertTable",
//     "undo",
//     "redo",
//   ],
// };
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
        // startupPath: 'Images:/' + today.toISOString().slice(0, 8).replaceAll('-', '/'),
        // rememberLastFolder: false,
      },
    },
  };
  return (
    <div className={`custom-editor w-full ${size ? `size-${size}` : ""} ${noBorder ? "no-border" : ""}`}>
      <CKEditor
        editor={ClassicEditor}
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
