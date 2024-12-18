import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/bid_bond/bidBond.slice";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { deleteBidBond, getAllBidBonds } from "@/services/store/bid_bond/bidBond.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { bidBondEnumArray, mappingBidBond, TypeBidBond } from "@/shared/enums/types";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

import ActionModuleBidBod from "./ActionModule";
import { convertDataOptions } from "../Project/helper";
import { unwrapResult } from "@reduxjs/toolkit";
import { formatTreeSelect } from "@/shared/enums/formatTreeSelect";
import { convertMoney } from "@/shared/utils/common/convertMoney";

const BidBonds = () => {
  const { state, dispatch } = useArchive<IBidBondInitialState>("bid_bond");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const [ treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  const enterpriseName = (value: number) => {
    if (stateEnterprise.listEnterprise!.length > 0 && !!value) {
      return stateEnterprise.listEnterprise!.find((item) => item.id === value)?.name;
    }
  };
  const projectName = (value: number) => {
    if (stateProject.listProjects!.length > 0 && !!value) {
      return stateProject.listProjects!.find((item) => item.id === value)?.name;
    }
  };
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_BID_BOND,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_BID_BOND,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBidBond(record?.key));
      },
      permission: EPermissions.DESTROY_BID_BOND,
    },
  ];

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "bond_number",
      title: "Mã bảo lãnh",
    },
    {
      dataIndex: "enterprise",
      title: "Nguời/Tổ chức bảo lãnh",
      className: "w-[250px]",
    },
    {
      dataIndex: "bond_type",
      title: "Loại nguồn tài trợ",
      render(_, record) {
        return <div className="flex flex-col">{mappingBidBond[record?.bond_type as TypeBidBond]}</div>;
      },
    },
    {
      dataIndex: "project",
      title: "Dự án",
    },
    {
      dataIndex: "bond_amount",
      title: "Số tiền bảo lãnh",
       render: (_, record) => {
              return convertMoney(record.bond_amount);
            },
    },
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.bidBonds && state.bidBonds.length > 0
        ? state.bidBonds.map(
          (
            { id, project_id, bond_amount, bond_type, project, enterprise, bond_number, enterprise_id, issue_date, expiry_date, description, bond_amount_in_words },
            index,
          ) => ({
            index: index + 1,
            key: id,
            id,
            project_id,
            project:projectName(project_id as number),
            bond_amount,
            bond_type,
            bond_number,
            enterprise_id,
            enterprise:enterpriseName(enterprise_id as number),
            issue_date,
            expiry_date,
            description,
            bond_amount_in_words,
          }),
        )
        : [],
    [JSON.stringify(state.bidBonds), JSON.stringify(stateEnterprise?.listEnterprise)],
  );

  useEffect(() => {
    dispatch(getAllBidBonds({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllBidBonds({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);
 
  useEffect(() => {
    dispatchEnterprise(getListEnterprise());
    dispatchProject(getListProject())
      .then(unwrapResult)
      .then((result) => {
        const data = result.data;
        const formattedData = formatTreeSelect(data);
        setTreeData(formattedData);
      });
  }, []);

  useFetchStatus({
    module: "bid_bond",
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
  const optionType: IOption[] = bidBondEnumArray.map((e) => ({
    label: mappingBidBond[e],
    value: e,
  }));
  const search: ISearchTypeTable[] = [
    {
      id: "bond_number",
      placeholder: "Nhập mã bảo lãnh...",
      label: "Mã bảo lãnh dự thầu",
      type: "text",
    },
    {
      id: "bond_type",
      placeholder: "Nhập loại bảo lãnh...",
      label: "Loại bảo lãnh",
      type: "select",
      options: optionType,
    },
    {
      id: "enterprise_id",
      placeholder: "Nhập tên Người/Tổ chức...",
      label: "Tên Người/Tổ chức bảo lãnh dự thầu",
      type: "select",
      options: convertDataOptions(stateEnterprise.listEnterprise || []),
    },
    {
      id: "project_id",
      placeholder: "Nhập tên dự án...",
      label: "Tên dự án",
      type: "treeSelect",
      treeData: treeData,
    },
  ];

  return (
    <>
      <Heading
        title="Bảo lãnh dự thầu"
        ModalContent={(props) =>
          <ActionModuleBidBod
            {...(props as any)}
            listEnterprise={stateEnterprise.listEnterprise}
            listProjects={stateProject.listProjects}
          />}
        hasBreadcrumb
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_BANNER,
            text: "Thêm mới",
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
          number_of_elements: state.number_of_elements && state.number_of_elements,
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) =>
          <ActionModuleBidBod
            {...(props as any)}
            listEnterprise={stateEnterprise.listEnterprise}
            listProjects={stateProject.listProjects}
          />}
      />
    </>
  );
};

export default BidBonds;
