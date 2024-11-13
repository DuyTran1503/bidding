import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/employee/employee.slice";
import { deleteEmployee, getAllEmployee } from "@/services/store/employee/employee.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IReputationInitialState } from "@/services/store/reputation/reputation.slice";
import { getAllReputations } from "@/services/store/reputation/reputation.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const Reputation = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IReputationInitialState>("reputation");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const enterpriseName = (value: number) => {
    if (stateEnterprise?.listEnterprise!.length > 0 && !!value) {
      return stateEnterprise?.listEnterprise!.find((item) => item.id === value)?.name;
    }
  };

  const enterpriseOption: IOption[] =
    stateEnterprise?.listEnterprise! && stateEnterprise.listEnterprise.length > 0
      ? stateEnterprise.listEnterprise.map((e) => ({
          value: e.id,
          label: e.name,
        }))
      : [];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[50px]"
    },
    {
      dataIndex: "enterprise",
      title: "Doan nghiệp",
      className: "w-[250px]",
    },
    {
      dataIndex: "prestige_score",
      title: "Điểm uy tín",
      className: "w-[50px]",
    },
    {   
      dataIndex: "number_of_blacklist",
      title: "Số danh sách đen",
      className: "w-[50px]",
    },
    {
      dataIndex: "number_of_ban",
      title: "Số lệnh cấm",
      className: "w-[50px]",
    },
  ];
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/reputation/detail/${record?.key}`);
      },
      // permission: EPermissions.DETAIL_REPUTATION,
    },
  ];
  const search: ISearchTypeTable[] = [
    {
    
            id: "enterprise_id",
            placeholder: "Chọn tên doanh nghiệp...",
            label: "Tên doanh nghiệp",
            type: "select",
            options: enterpriseOption as { value: string; label: string }[],
        
    },

  ];
  const data: ITableData[] = useMemo(() => {
    return Array.isArray(state.reputations)
      ? state.reputations.map((reputation, index) => ({
          index: index + 1,
          key: reputation.id, // Use employee.id as the unique key
          enterprise_id: reputation.enterprise_id,
          number_of_blacklist: reputation.number_of_blacklist,
          number_of_ban: reputation.number_of_ban,
          prestige_score: reputation.prestige_score,
          enterprise: enterpriseName(+reputation?.enterprise?.id!),
        }))
      : [];
  }, [JSON.stringify(state.reputations), JSON.stringify(stateEnterprise.listEnterprise) ]);

  useFetchStatus({
    module: "reputation",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    dispatch(getAllReputations({ query: state.filter }));
    dispatchEnterprise(getListEnterprise());
  }, [JSON.stringify(state.filter), JSON.stringify(state.status)]);

  return (
    <>
      <Heading
        title="Danh tiếng"
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
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
          total: state.totalRecords,
        }}
        setFilter={setFilter}
        filter={state.filter}
      />
    </>
  );
};

export default Reputation;
