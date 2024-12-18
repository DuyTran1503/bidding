import { INewProject } from "@/services/store/project/project.model";
import { Card, Modal, Tooltip } from "antd";
import { HiOutlinePencil } from "react-icons/hi2";
import { IoTrashBinOutline } from "react-icons/io5";

const { confirm } = Modal;

interface ProjectCardProps {
  children: INewProject[]; // Truyền trực tiếp children
  onEdit?: (child: INewProject) => void;
  isRemove?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ children, onEdit }) => {
  const handleRemove = (index: number) => {
    confirm({
      title: "Xóa gói thầu",
      content: "Bạn chắc chắn muốn xóa gói thầu này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { className: "bg-red-500 hover:bg-red-600" },
      onOk: () => {
        console.log(index);
      },
    });
  };

  const handleEdit = (child: any) => {
    if (onEdit) {
      onEdit(child);
    }
  };

  return (
    <div className="my-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children.length > 0 ? (
        children.map((child, index) => (
          <Card key={index} className="transition-shadow duration-300 hover:shadow-lg" bodyStyle={{ padding: "16px" }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 text-sm text-gray-500">Gói thầu {index + 1}</div>
                <h3 className="text-lg font-medium text-gray-900">{child.name}</h3>
                <div className="space-y-2">{/* Render các trường khác trong INewProject */}</div>
              </div>

              <div className="ml-4 flex gap-2">
                <Tooltip title="Cập nhật">
                  <button type="button" className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100" onClick={() => handleEdit(child)}>
                    <HiOutlinePencil className="text-xl text-yellow-500" />
                  </button>
                </Tooltip>

                <Tooltip title="Xóa">
                  <button className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100" onClick={() => handleRemove(index)}>
                    <IoTrashBinOutline className="text-xl text-red-500" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full">
          <Card className="py-8 text-center">
            <p className="text-gray-500">Chưa có gói thầu nào được thêm</p>
          </Card>
        </div>
      )}
    </div>
  );
};
export default ProjectCard;
