import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { IPostInitialState, resetStatus, setFilter } from "@/services/store/post/post.slice";
import { deletePost, getAllPosts } from "@/services/store/post/post.thunk";
import { GoDownload } from "react-icons/go";
import ImageTable from "@/components/table/ImageTable";
import { EButtonTypes } from "@/shared/enums/button";
// import { EPermissions } from "@/shared/enums/permissions";

const Posts = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IPostInitialState>("post");
  // const [isModal, setIsModal] = useState(false);
  // const [confirmItem] = useState<ITableData | null>();

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/posts/detail/${record?.key}`);
      },
      // permission: EPermissions.DETAIL_POST,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`update/${record?.key}`);
      },
      // permission: EPermissions.UPDATE_POST,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deletePost(record?.key));
      },
      // permission: EPermissions.DESTROY_POST,
    },
  ];

  const columns: ColumnsType<ITableData> = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "author_name",
      title: "Người đăng bài",
    },
    {
      dataIndex: "post_catalog_name",
      title: "Thể loại",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      dataIndex: "short_title",
      title: "Tiêu đề ngắn",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        const statusMap: { [key: number]: { text: string; title: string } } = {
          1: { text: "Công khai", title: "Bạn có chắc chắn muốn ẩn lĩnh vực này?" },
          2: { text: "Ẩn", title: "Bạn có chắc chắn muốn công khai lĩnh vực này?" },
          3: { text: "Nháp", title: "Bạn có chắc chắn muốn công khai lĩnh vực này?" },
        };

        const { text } = statusMap[record.status as number] || { text: "Không xác định", title: "Trạng thái không xác định" };

        return (
          <div className="flex items-center space-x-2">
            <span>{text}</span>
            {/* <FormSelect
              onChange={() => handleChangeStatus(record)}
              title={text}
            /> */}
          </div>
        );
      },
    },
    {
      dataIndex: "thumbnail",
      title: "Ảnh",
      render(_, record) {
        return <ImageTable imageSrc={"https://base.septenarysolution.site/" + record.thumbnail} title="" />;
      },
    },
    // {
    //   title: "Tài liệu",
    //   dataIndex: "document"
    // },
    {
      dataIndex: "content",
      title: "Nội dung",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }} className="text-compact-3"></div>;
      },
    },
  ];

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
        ? state.posts.map(({ id, author_name, post_catalog_name, short_title, title, thumbnail, status }, index) => ({
          index: index + 1,
          key: id,
          id: id,
          author_name,
          post_catalog_name,
          short_title,
          title,
          thumbnail,
          status,
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

  // const handleChangeStatus = (item: ITableData) => {
  //   setIsModal(true);
  //   setConfirmItem(item);
  // };

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
