import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IFundingSourceInitialState, resetStatus, setFilter } from "@/services/store/funding_source/funding_source.slice";
import { deleteFundingSources, getAllFundingSources } from "@/services/store/funding_source/funding_source.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FundingSources = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IFundingSourceInitialState>("fundingsource");
  useFetchStatus({
    module: "fundingsource",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    dispatch(getAllFundingSources({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  const columns: ColumnsType = [
    {
      dataIndex: "name",
      title: "Name",
    },
    {
      dataIndex: "description",
      title: "Description",
    },
    {
      dataIndex: "code",
      title: "Code",
    },
    {
      dataIndex: "type",
      title: "Type",
    },
    {
      dataIndex: "is_active",
      title: "Active",
    },
  ];
  const data: ITableData[] = useMemo(() => {
    if (state.funfingsources && state.funfingsources.length > 0) {
      return state.funfingsources.map((fundingsource) => ({
        key: fundingsource.id,
        name: fundingsource.name,
        description: fundingsource.description,
        code: fundingsource.code,
        type: fundingsource.type,
        is_active: fundingsource.is_active,
      }));
    }
    return [];
  }, [JSON.stringify(state.funfingsources)]);

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/funding_sources/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_FUNDING_SOURCE,
    },
    {
      type: EButtonTypes.DELETE,
      onClick(record) {
        dispatch(deleteFundingSources(record?.key));
      },
      permission: EPermissions.UPDATE_FUNDING_SOURCE,
    },
  ];
  return (
    <>
      <Heading
        title="Funding Sources"
        hasBreadcrumb
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_FUNDING_SOURCE,
            text: "Create Funding Source",
            onClick: () => navigate("/funding_sources/create"),
          },
        ]}
      />
      <ManagementGrid columns={columns} data={data} setFilter={setFilter} search={{ status: [] }} buttons={buttons} />
    </>
  );
};

export default FundingSources;
