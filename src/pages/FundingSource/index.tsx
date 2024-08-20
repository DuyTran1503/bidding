import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IFundingSourceInitialState, resetStatus, setFilter } from "@/services/store/funding_source/funding_source.slice";
import { changeStatusFundingSource, deleteFundingSources, getAllFundingSources } from "@/services/store/funding_source/funding_source.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { GoDownload } from "react-icons/go";
import ConfirmModal from "@/components/common/CommonModal";

const FundingSources = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IFundingSourceInitialState>("funding_source");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "name",
      title: "Tên nguồn tài trợ",
      className: "w-[250px]",
    },
    {
      dataIndex: "type",
      title: "Loại nguồn tài trợ",
    },
    {
      dataIndex: "code",
      title: "Mã",
    },
    {
      dataIndex: "desciption",
      title: "Mô tả",
      className: " text-compact-3 h-[90px]",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }}></div>;
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
        navigate(`/funding-sources/detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_FUNDING_SOURCE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/funding-sources/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_FUNDING_SOURCE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteFundingSources(record?.key));
      },
      permission: EPermissions.DESTROY_FUNDING_SOURCE,
    },
  ];

  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.fundingSources)
      ? state.fundingSources.map(({ id, name, code, type, description, is_active }, index) => ({
          index: index + 1,
          key: id,
          name,
          code,
          type,
          description,
          is_active,
        }))
      : [];
  }, [JSON.stringify(state.fundingSources)]);

  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusFundingSource(String(confirmItem.key)));
      dispatch(getAllFundingSources({ query: state.filter }));
    }
  };

  useEffect(() => {
    dispatch(getAllFundingSources({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllFundingSources({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "funding_source",
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
        title="Nguồn Tài Trợ"
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
              navigate("create");
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
        // search={search}
        buttons={buttons}
        pagination={{
          current: state.filter.page ?? 1,
          pageSize: state.filter.size ?? 10,
          total: state.totalRecords,
          number_of_elements: state.number_of_elements && state.number_of_elements,
        }}
        setFilter={setFilter}
        filter={state.filter}
      />
    </>
  );
};

export default FundingSources;
