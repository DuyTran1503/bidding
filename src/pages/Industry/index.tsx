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

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IIndustryInitialState, resetStatus, setFilter } from "@/services/store/industry/industry.slice";
import { changeStatusIndustry, deleteIndustry, getAllIndustry } from "@/services/store/industry/industry.thunk";
import { IBusinessActivityInitialState } from "@/services/store/business-activity/business-activity.slice";
import { convertDataOption } from "@/shared/utils/common/function";

const Industry = () => {
  const navigate = useNavigate();
  const { state: industryState, dispatch } = useArchive<IIndustryInitialState>("industry");
  const { state: businessState } = useArchive<IBusinessActivityInitialState>("business");

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
      title: "Ngành kinh doanh",
    },
    {
      dataIndex: "business_activity_type_id",
      title: "Tên loại hình doanh nghiệp",
    },
    {
      dataIndex: "description",
      title: "Mô tả",
    },
    {
      title: "Trạng thái ",
      dataIndex: "is_active",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_active}
            title={`Bạn có chắc chắn muốn thay đổi trạng thái không?`}
          />
        );
      },
    },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/business-activity/detail/${record?.key}`);
      },
      permission: EPermissions.CREATE_INDUSTRY,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/business-activity/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_INDUSTRY,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteIndustry(record?.key));
        setIsDelete(true);
      },
      permission: EPermissions.DESTROY_INDUSTRY,
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập ...",
      label: "Ngành kinh doanh",
      type: "text",
    },
    {
      id: "business_activity_type_id",
      placeholder: "Nhập ...",
      label: "Loại hình kinh doanh",
      type: "select",
      options: convertDataOption(businessState.businessActivities),
    },
  ];
  const data: ITableData[] = useMemo(() => {
    return Array.isArray(industryState.businessActivities)
      ? industryState.businessActivities.map(({ id, name, business_activity_type_id, description, is_active }, index) => ({
          index: index + 1,
          key: id,
          name,
          business_activity_type_id,
          description,
          is_active,
        }))
      : [];
  }, [JSON.stringify(industryState.businessActivities)]);
  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };
  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusIndustry(String(confirmItem.key)));
      dispatch(getAllIndustry({ query: industryState.filter }));
    }
  };
  useEffect(() => {
    dispatch(getAllIndustry({ query: industryState.filter }));
  }, [JSON.stringify(industryState.filter)]);
  useEffect(() => {
    if (industryState.status === EFetchStatus.FULFILLED) {
      dispatch(getAllIndustry({ query: industryState.filter }));
      setIsDelete(false);
    }
  }, [JSON.stringify(industryState.status)]);

  useFetchStatus({
    module: "business",
    reset: resetStatus,
    actions: {
      success: { message: industryState.message },
      error: { message: industryState.message },
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
              navigate("/industry/create");
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
          current: industryState.filter.page ?? 1,
          pageSize: industryState.filter.size ?? 10,
          total: industryState.totalRecords,
          number_of_elements: industryState.number_of_elements && industryState.number_of_elements,
          // showSideChanger:true
        }}
        setFilter={setFilter}
        filter={industryState.filter}
      />
    </>
  );
};

export default Industry;
