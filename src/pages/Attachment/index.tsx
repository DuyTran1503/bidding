import Heading from "@/components/layout/Heading";

import IMAGE_ICON from "@/assets/images/customerDefaultAvatar.png";
import EXCEL from "@/assets/images/excel.png";
import DEFAULT_FILE from "@/assets/images/file_error.png";
import PDF from "@/assets/images/pdf.png";
import WORD from "@/assets/images/word.jpg";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IAttachmentInitialState, resetStatus, setFilter } from "@/services/store/attachment/attachment.slice";
import { getAllAttachment } from "@/services/store/attachment/attachment.thunk";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { unwrapResult } from "@reduxjs/toolkit";
import { formatTreeSelect } from "@/shared/enums/formatTreeSelect";

export const getFileIcon = (fileType: string | undefined) => {
  if (!fileType) {
    return DEFAULT_FILE;
  }

  const isFullFileName = fileType.includes(".");
  const extension = isFullFileName ? fileType.split(".").pop()!.toLowerCase() : fileType.toLowerCase(); // Sử dụng '!' để khẳng định rằng pop không trả về undefined

  switch (extension) {
    case "pdf":
      return PDF;
    case "xlsx":
    case "xls":
      return EXCEL;
    case "doc":
    case "docx":
      return WORD;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return IMAGE_ICON;
    default:
      return DEFAULT_FILE;
  }
};
const Attachment = () => {
  // const navigate = useNavigate();
  const { state, dispatch } = useArchive<IAttachmentInitialState>("attachment");
  const { dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const [parentOptions, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[] | undefined>(undefined);

  useEffect(() => {
    dispatchProject(getListProject())
      .then(unwrapResult)
      .then((result) => {
        const data = result.data;
        const formattedData = formatTreeSelect(data);
        setTreeData(formattedData);
      });
  }, []);
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên tài liệu",
    },
    {
      dataIndex: "url",
      title: "Tài liệu đính kèm",
      className: "flex justify-center",
      render: (_, record) => {
        return (
          <Tooltip title={record.name} color={"#108ee9"}>
            <a href={record.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              {record.type && getFileIcon(record.type) && <img src={getFileIcon(record.type)} alt={record.type} className="h-6 w-6 object-contain" />}
            </a>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: "project",
      title: "Dự án ",
      render: (_, record) => {
        return <span>{record.project?.name || "Không có tên dự án"}</span>;
      },
    },
  ];
  const typeOption = Object.entries({
    pdf: "PDF",
    doc: "Word (.doc)",
    docx: "Word (.docx)",
    xls: "Excel (.xls)",
    xlsx: "Excel (.xlsx)",
    ppt: "PowerPoint (.ppt)",
    pptx: "PowerPoint (.pptx)",
    jpg: "JPEG (.jpg)",
    jpeg: "JPEG (.jpeg)",
    png: "PNG",
    gif: "GIF",
    mp4: "MP4",
    avi: "AVI",
    zip: "ZIP",
    rar: "RAR",
    txt: "Text File (.txt)",
    csv: "CSV",
  }).map(([value, label]) => ({ value, label }));

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên file...",
      label: "Tên file",
      type: "text",
    },
    {
      id: "type",
      placeholder: "Chọn loại file...",
      label: "Loại file",
      type: "select",
      options: typeOption
    },
    {
      id: "project",
      placeholder: "Chọn dự án ...",
      label: "Tên dự án",
      type: "treeSelect",
      treeData: parentOptions,
    },
  ];

  const data: ITableData[] = useMemo(() =>
    state.attachments && state.attachments.length > 0
      ? state.attachments.map(({ id, name, project, url, type, project_id, user_id, is_active }, index) => ({
        index: index + 1,
        key: id,
        name,
        url,
        type,
        project_id,
        project,
        user_id,
        is_active,
      }))
      : [], [JSON.stringify(state.attachments)]);
  useEffect(() => {
    dispatch(getAllAttachment({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllAttachment({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "attachment",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });
  useEffect(() => {
    return () => {
      setFilter({ page: 1, size: 10 });
    };
  }, []);
  return (
    <>
      <Heading
        title="Tài liệu đính kèm"
        hasBreadcrumb
      />
      <ManagementGrid
        columns={columns}
        data={data}
        search={search}
        pagination={{
          current: state.filter.page ?? 1,
          pageSize: state.filter.size ?? 10,
          total: state.totalRecords,
          number_of_elements: state.number_of_elements && state.number_of_elements,
          // showSideChanger:true
        }}
        setFilter={setFilter}
        filter={state.filter}
      // scroll={{ x: 1600 }}
      />
    </>
  );
};

export default Attachment;
