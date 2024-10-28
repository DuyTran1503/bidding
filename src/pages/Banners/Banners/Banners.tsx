import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { IBannerInitialState, resetStatus, setFilter } from "@/services/store/banner/banner.slice";
import { changeStatusBanner, deleteBanner, getAllBanners } from "@/services/store/banner/banner.thunk";
import { GoDownload } from "react-icons/go";
import BannerForm from "../BannerForm";
import { EPermissions } from "@/shared/enums/permissions";
import Image from "@/components/table/Image";

const Banners = () => {
  const { state, dispatch } = useArchive<IBannerInitialState>("banner");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>(null);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_BANNER,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_BANNER,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBanner(record?.key));
      },
      permission: EPermissions.DESTROY_BANNER,
    },
  ];

  const columns: ColumnsType<ITableData> = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên Banner",
      className: "w-[300px]",
    },
    {
      dataIndex: "path",
      title: "Link",
      render(_, record) {
        return <Image src={record.path as unknown as string} alt={"Ảnh đại diện"} />;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_active}
            title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ hoạt động" : "khóa hoạt động"} ?`}
          />
        );
      },
    },
  ];

  const handleChangeStatus = (item: ITableData) => {
    setConfirmItem(item);
  };

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusBanner(String(confirmItem.key)));
    }
  };

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên Banner...",
      label: "Tên Banner",
      type: "text",
    },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.banners && state.banners.length > 0
        ? state.banners.map(({ id, name, path, is_active }, index) => ({
          index: index + 1,
          key: id,
          id: id,
          name,
          path,
          is_active,
        }))
        : [],
    [JSON.stringify(state.banners)],
  );

  useFetchStatus({
    module: "banner",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBanners({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useEffect(() => {
    dispatch(getAllBanners({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  return (
    <>
      <Heading
        title="Banner"
        hasBreadcrumb
        ModalContent={(props) => <BannerForm {...(props as any)} />}
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_BANNER,
            text: "Thêm mới",
          },
        ]}
      />
      <ConfirmModal
        title={"Xác nhận"}
        content={"Bạn chắc chắn muốn thay đổi trạng thái không"}
        visible={isModal}
        setVisible={setIsModal}
        onConfirm={onConfirmStatus}
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
        ModalContent={(props) => <BannerForm {...(props as any)} />}
      />
    </>
  );
};

export default Banners;
