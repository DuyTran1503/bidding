import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IPostInitialState, resetStatus, setFilter } from "@/services/store/post/post.slice";
import { deletePost, getAllPosts } from "@/services/store/post/post.thunk";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import Image from "@/components/table/Image";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { convertDataOptions } from "@/pages/Project/helper";
import { IPostCatalogInitialState } from "@/services/store/postCatalog/postCatalog.slice";
import { getAllPostCatalogs } from "@/services/store/postCatalog/postCatalog.thunk";
import { IAccountInitialState } from "@/services/store/account/account.slice";
import { getListStaff } from "@/services/store/account/account.thunk";

const Posts = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IPostInitialState>("post");
  const { state: stateCatalog, dispatch: dispatchCatalog } = useArchive<IPostCatalogInitialState>("post_catalog");
  const { state: stateStaff, dispatch: dispatchStaff } = useArchive<IAccountInitialState>("account");

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/posts/detail/${record?.key}`);
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

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "author",
      title: "Người đăng bài",
      render: (_, record) => {
        return <span>{record.author?.name}</span>;
      },
    },
    {
      dataIndex: "catalog",
      title: "Thể loại",
      render: (_, record) => {
        return <div className="flex flex-col">{record.catalog?.map((catalog: any) => <div key={catalog.id}>{catalog.name}</div>)}</div>;
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      dataIndex: "thumbnail",
      title: "Ảnh",
      render(_, record) {
        return <Image src={record.thumbnail as unknown as string} alt={"Ảnh đại diện"} />;
      },
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
          </div>
        );
      },
    },
  ];
  // const optionStatus: IOption[] = statusEnumArray.map((e) => ({
  //   label: mappingStatust[e],
  //   value: e,
  // }));

  const search: ISearchTypeTable[] = [
    {
      id: "title",
      placeholder: "Nhập tiêu đề bài viết...",
      label: "Tiêu đề bài viết",
      type: "text",
    },
    {
      id: "catalog",
      placeholder: "Chọn tên danh mục...",
      label: "Tên danh mục",
      type: "select",
      options: convertDataOptions(stateCatalog.postCatalogs || []),
    },
    {
      id: "author",
      placeholder: "Chọn người đăng bài...",
      label: "Người đăng bài",
      type: "select",
      options: convertDataOptions(stateStaff.getListStaff || []),
    },
    // {
    //   id: "status",
    //   placeholder: "Chọn trạng thái...",
    //   label: "Tên trạng thái",
    //   type: "select",
    //   options: optionStatus,
    // },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.posts && state.posts.length > 0
        ? state.posts.map(({ id, author, catalog, short_title, title, thumbnail, status }, index) => ({
          index: index + 1,
          key: id,
          id: id,
          author,
          catalog,
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
    dispatchCatalog(getAllPostCatalogs({ query: state.filter }));
    dispatchStaff(getListStaff());
  }, [])
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
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_POST,
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
