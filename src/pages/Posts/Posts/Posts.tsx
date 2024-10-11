import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { IPostInitialState, resetStatus, setFilter } from "@/services/store/post/post.slice";
import { deletePost, getAllPosts } from "@/services/store/post/post.thunk";
import { EPermissions } from "@/shared/enums/permissions";
import { GoDownload } from "react-icons/go";
import FormModal from "@/components/form/FormModal";
import DetailPost from "../DetailPost/DetailPost";

const Posts = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IPostInitialState>("post");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        setModalContent(<DetailPost record={record} />);
        setIsModalOpen(true);
      },
      permission: EPermissions.DETAIL_POST,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_POST,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deletePost(record?.key));
      },
      permission: EPermissions.DESTROY_POST,
    },
  ];

  const columns: ColumnsType<ITableData> = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "title",
      title: "Tiêu đề",
    },
    {
      dataIndex: "short_title",
      title: "Tiêu đề ngắn",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active"
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail"
    },
    {
      title: "Tài liệu",
      dataIndex: "document"
    },
    {
      dataIndex: "content",
      title: "Nội dung",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }} className="text-compact-3"></div>;
      },
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const search: ISearchTypeTable[] = [
    {
      id: "title",
      placeholder: "Nhập tiêu đề bài viết...",
      label: "Tiêu đề bài viết",
      type: "text",
    },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.posts && state.posts.length > 0
        ? state.posts.map(({ id, short_title, title, thumbnail, document, is_active }, index) => ({
          index: index + 1,
          key: id,
          id: id,
          short_title,
          title,
          thumbnail,
          document,
          is_active,
        }))
        : [],
    [JSON.stringify(state.posts)],
  );

  useFetchStatus({
    module: "post",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllPosts({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useEffect(() => {
    dispatch(getAllPosts({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  return (
    <>
      <Heading
        title="Bài viết"
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            icon: <FaPlus className="text-[18px]" />,
            // permission: EPermissions.CREATE_POST,
            text: "Thêm mới",
            onClick: () => navigate("create"),
          },
        ]}
      />
      <FormModal open={isModalOpen} onCancel={handleCancel}>
        {modalContent}
      </FormModal>
      <ManagementGrid
        columns={columns}
        data={data}
        search={search}
        buttons={buttons}
        pagination={{
          current: state.filter.page ?? 1,
          pageSize: state.filter.size ?? 10,
          total: state.totalRecords!,
        }}
        setFilter={setFilter}
        filter={state.filter}
      />
    </>
  );
};

export default Posts;
