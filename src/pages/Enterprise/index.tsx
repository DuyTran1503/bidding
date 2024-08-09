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
import { IEnterpriseInitialState, resetStatus, setFilter } from "@/services/store/enterprise/enterprise.slice";
import { changeStatusEnterprise, deleteEnterprise, getAllEnterprise } from "@/services/store/enterprise/enterprise.thunk";

const Enterprise = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IEnterpriseInitialState>("enterprise");
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
      title: "Tên doanh nghiệp",
    },
    {
      dataIndex: "representative",
      title: "Tên người đại diện",
    },
    {
      dataIndex: "contact_phone",
      title: "Điện thoại",
    },
    {
      dataIndex: "email",
      title: "Email",
    },
    {
      dataIndex: "address",
      title: "Địa chỉ",
    },
    {
      dataIndex: "id_field_of_activity",
      title: "Lĩnh vực hoạt động",
    },

    {
      title: "Trạng thái",
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
    {
      title: "Trạng thái blacklist",
      dataIndex: "is_blacklisted",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!record.is_blacklisted}
            title={`Bạn có chắc chắn muốn ${record.is_blacklisted ? "bỏ cấm" : "cấm"} tài khoản này?`}
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
      // permission: EPermissions.CREATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/business_activity/update/${record?.key}`);
      },
      // permission: EPermissions.UPDATE_BUSINESS_ACTIVITY_TYPE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteEnterprise(record?.key));
        setIsDelete(true);
      },
      // permission: EPermissions.DESTROY_BUSINESS_ACTIVITY_TYPE,
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
    return Array.isArray(state.enterprises)
      ? state.enterprises.map(({ id, name, representative, contact_phone, email, address, is_active, is_blacklisted }, index) => ({
          index: index + 1,
          key: id,
          name,
          representative,
          contact_phone,
          email,
          address,
          is_active,
          is_blacklisted,
        }))
      : [];
  }, [JSON.stringify(state.enterprises)]);
  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };
  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusEnterprise(String(confirmItem.key)));
      dispatch(getAllEnterprise({ query: state.filter }));
    }
  };
  useEffect(() => {
    dispatch(getAllEnterprise({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllEnterprise({ query: state.filter }));
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
        title="Doanh nghiệp"
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
              navigate("/enterprise/create");
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
        scroll={{ x: 1600 }}
      />
    </>
  );
};

export default Enterprise;
