import Heading from "@/components/layout/Heading";
import { GoDownload } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ColumnsType } from "antd/es/table";
import { ITableData } from "@/components/table/PrimaryTable";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { useEffect, useMemo, useState } from "react";
import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import {
  changeStatusBusinessActivity,
  deleteBusinessActivity,
  getAllBusinessActivity,
} from "@/services/store/business-activity/business-activity.thunk";
import { IBusinessActivityInitialState, resetStatus, setFilter } from "@/services/store/business-activity/business-activity.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";

const BusinessActivities = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBusinessActivityInitialState>("business");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const [isDelete, setIsDelete] = useState(false);

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên loại hình doanh nghiệp",
    },
    {
      dataIndex: "description",
      title: "Mô tả",
    },
    {
      title: "Trạng thái tài khoản",
      dataIndex: "is_active",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_active}
            title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ cấm" : "cấm"} tài khoản này?`}
          />
        );
      },
    },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/business_activity/detail/${record?.key}`);
      },
      permission: EPermissions.CREATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/business_activity/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBusinessActivity(record?.key));
        setIsDelete(true);
      },
      permission: EPermissions.DESTROY_BUSINESS_ACTIVITY_TYPE,
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập ...",
      label: "Loại hình doanh nghiệp",
      type: "text",
    },
  ];
  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.businessActivities)
      ? state.businessActivities.map(({ id, name, description, is_active }, index) => ({
          index: index + 1,
          key: id,
          name,
          description,
          is_active,
        }))
      : [];
  }, [JSON.stringify(state.businessActivities)]);
  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };
  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusBusinessActivity(String(confirmItem.key)));
      dispatch(getAllBusinessActivity({ query: state.filter }));
    }
  };
  useEffect(() => {
    dispatch(getAllBusinessActivity({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBusinessActivity({ query: state.filter }));
      setIsDelete(false);
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "business",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Heading
        title="Loại hình hoạt động"
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            text: "Thêm mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              navigate("/business_activity/create");
            },
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
          total: state.totalRecords,
          number_of_elements: state.number_of_elements && state.number_of_elements,
          // showSideChanger:true
        }}
        setFilter={setFilter}
        filter={state.filter}
      />
    </>
  );
};

export default BusinessActivities;
