import Heading from "@/components/layout/Heading";
import { GoDownload } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import ManagementGrid from "@/components/grid/ManagementGrid";
import { ColumnsType } from "antd/es/table";
import { ITableData } from "@/components/table/PrimaryTable";
import { useNavigate } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { EButtonTypes } from "@/shared/enums/button";
import { Fragment, useEffect, useMemo, useState } from "react";
import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import useFetchStatus from "@/hooks/useFetchStatus";
import { ISearchTypeTable } from "@/components/table/SearchComponent";

import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IEnterpriseInitialState, resetStatus, setFilter } from "@/services/store/enterprise/enterprise.slice";
import { changeStatusEnterprise, deleteEnterprise, getAllEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { mappingTypeEnterprise, typeEnterpriseEnumArray } from "@/shared/enums/typeEnterprise";
import { EPermissions } from "@/shared/enums/permissions";

const Enterprise = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IEnterpriseInitialState>("enterprise");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[100px]",
    },
    {
      dataIndex: "name",
      title: "Tên doanh nghiệp",
      className: "w-[250px]",
    },
    {
      dataIndex: "representative",
      title: "Tên người đại diện",
      className: "w-[250px]",
    },
    {
      dataIndex: "organization_type",
      title: "Loại hình doanh nghiệp",
      className: "w-[250px]",
      render(_, record, index) {
        const typeOptions: IOption[] = typeEnterpriseEnumArray.map((e) => ({
          value: e,
          label: mappingTypeEnterprise[e],
        }));
        const organization_type = typeOptions.find((e) => +e.value === +record?.organization_type)?.label;
        return <Fragment key={index}>{organization_type}</Fragment>;
      },
    },
    {
      dataIndex: "phone",
      title: "Điện thoại",
      className: "w-[250px]",
    },
    {
      dataIndex: "email",
      title: "Email",
      className: "w-[250px]",
    },
    {
      dataIndex: "address",
      title: "Địa chỉ",
      className: "w-[250px]",
    },
    {
      dataIndex: "industries",
      title: "Lĩnh vực hoạt động",
      render(_, record: { industries: { id: string; name: string }[] }) {
        return (
          <div className="flex flex-col">
            {record.industries.map((item, index) => (
              <div key={index}>{item?.name}</div>
            ))}
          </div>
        );
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "is_active",
      className: "w-[150px]",
      render(_, record, index) {
        return (
          <div key={index} className="flex flex-col gap-2">
            <CommonSwitch
              onChange={() => handleChangeStatus(record)}
              checked={!!record.is_active}
              title={`Bạn có chắc chắn muốn ${record.is_active ? "bỏ khóa hoạt động" : "khóa hoạt động"} doanh nghiệp này?`}
            />
            <CommonSwitch
              onChange={() => handleChangeStatus(record)}
              checked={!!record.is_blacklist}
              title={`Bạn có chắc chắn muốn ${record.is_blacklist ? "bỏ danh sách đen" : "thêm vào danh sách đen"} doanh nghiệp này?`}
            />
            <CommonSwitch
              onChange={() => handleChangeStatus(record)}
              checked={!!record.account_ban_at}
              title={`Bạn có chắc chắn muốn ${record.account_ban_at ? "bỏ cấm" : "cấm"} doanh nghiệp này?`}
            />
          </div>
        );
      },
    },
    // {
    //   title: "Trạng thái blacklist",
    //   dataIndex: "is_blacklist",
    //   render(_, record) {
    //     return (
    //       <CommonSwitch
    //         onChange={() => handleChangeStatus(record)}
    //         checked={!!record.is_blacklist}
    //         title={`Bạn có chắc chắn muốn ${record.is_blacklist ? "bỏ cấm" : "cấm"} tài khoản này?`}
    //       />
    //     );
    //   },
    // },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/enterprise/detail/${record?.key}`);
      },
      permission: EPermissions.CREATE_ENTERPRISE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        // console.log(record);

        navigate(`/enterprise/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_ENTERPRISE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteEnterprise(record?.key));
      },
      permission: EPermissions.DESTROY_ENTERPRISE,
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
      ? state.enterprises.map(
          ({ id, name, organization_type, industries, representative, phone, email, address, is_active, is_blacklist }, index) => ({
            index: index + 1,
            key: id,
            name,
            representative,
            industries,
            organization_type,
            phone,
            email,
            address,
            is_active,
            is_blacklist,
          }),
        )
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
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "enterprise",
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
        scroll={{ x: 2200 }}
      />
    </>
  );
};

export default Enterprise;
