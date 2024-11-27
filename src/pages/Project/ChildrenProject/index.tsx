import Dialog from "@/components/dialog/Dialog";
import { INewProject } from "@/services/store/project/project.model";
import { EPageTypes } from "@/shared/enums/page";
import { useViewport } from "@/hooks/useViewport";
import { FormikProps } from "formik";

interface IChildrenProjectProps {
  title?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  footerContent?: React.ReactNode;
  onSave: (values: INewProject) => void;
  children?: React.ReactNode;
  className?: string;
  project?: INewProject;
  type?: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW | EPageTypes.APPROVE;
  formikRef: React.RefObject<FormikProps<INewProject>>; // Add formikRef to props
}

const ChildrenProject: React.FC<IChildrenProjectProps> = (props) => {
  const { title, visible, setVisible, footerContent, children, className, onSave, formikRef } = props;

  const { screenSize } = useViewport();

  const handleSubmit = () => {
    if (formikRef.current) {
      const values = formikRef.current.values;
      onSave(values);
    }
  };

  return (
    <Dialog
      title={title}
      visible={visible}
      setVisible={setVisible}
      footerContent={footerContent}
      handleSubmit={handleSubmit}
      screenSize={screenSize}
      className={className}
    >
      {children}
    </Dialog>
  );
};

export default ChildrenProject;
