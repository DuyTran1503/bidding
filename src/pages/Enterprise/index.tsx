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
import { changeStatusActiveEnterprise, deleteEnterprise, getAllEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { mappingTypeEnterprise, typeEnterpriseEnumArray } from "@/shared/enums/typeEnterprise";
import { EPermissions } from "@/shared/enums/permissions";
import { IIndustryInitialState } from "@/services/store/industry/industry.slice";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import { mappingStatus, STATUS, statusEnumArray } from "@/shared/enums/statusActive";
import GenericChart from "@/components/chart/GenericChart";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import {
  industryHasTheMostEnterprise,
  projectsStatusPreMonth,
  topEnterprisesHaveCompletedProjectsByFundingSource,
  topEnterprisesHaveCompletedProjectsByIndustry
} from "@/services/store/chart/chart.thunk";
import { message, Select } from "antd";
import SelectChart from "@/components/chart/SelectChart";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import { getListFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import AreaChart from "@/components/chart/AreaChart";

const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(String);
const Enterprise = () => {
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSourceInitialState>("funding_source");
  const navigate = useNavigate();
  const { state: enterpriseState, dispatch: enterpriseDispatch } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: industryState, dispatch: industryDispatch } = useArchive<IIndustryInitialState>("industry");
  const { state, dispatch } = useArchive<IChartInitialState>("chart");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const [selectedYearProjectStatus, setSelectedYearProjectStatus] = useState<string>(yearOptions[0]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>();
  const [selectedFundingSource, setSelectedFundingSource] = useState<string>();

  const industry = (value: number[]) => {
    if (industryState?.listIndustry!.length > 0 && value.length) {
      return industryState.listIndustry!.filter((item) => value.includes(+item.id)).map((item) => item.name);
    }
  };

  useEffect(() => {
    if (stateFundingSource.listFundingSources.length > 0 && !selectedFundingSource) {
      setSelectedFundingSource(String(stateFundingSource.listFundingSources[0].id));
    }
  }, [stateFundingSource, selectedFundingSource]);

  useEffect(() => {
    if (industryState.listIndustry.length > 0 && !selectedIndustry) {
      setSelectedIndustry(String(industryState.listIndustry[0].id));
    }
  }, [industryState, selectedIndustry]);

  useEffect(() => {
    if (selectedFundingSource) {
      dispatch(
        topEnterprisesHaveCompletedProjectsByFundingSource({
          body: { id: +selectedFundingSource },
        }),
      );
    }
  }, [selectedFundingSource, dispatch]);

  useEffect(() => {
    if (selectedIndustry) {
      dispatch(
        topEnterprisesHaveCompletedProjectsByIndustry({
          body: { id: +selectedIndustry },
        }),
      );
    }
  }, [selectedIndustry, dispatch]);

  const handleFundingSourceChange = (value: string) => {
    message.loading("Đang tải dữ liệu");
    setSelectedFundingSource(value);
  }
  const handleIndustryChange = (value: string) => {
    message.loading("Đang tải dữ liệu");
    setSelectedIndustry(value);
  }
  useEffect(() => {
    if (selectedYearProjectStatus) {
      dispatch(projectsStatusPreMonth({ body: { year: selectedYearProjectStatus } }));
    }
    message.loading("Đang tải dữ liệu");
  }, [selectedYearProjectStatus, dispatch]);

  const typeOptions: IOption[] = typeEnterpriseEnumArray.map((e) => ({
    value: e,
    label: mappingTypeEnterprise[e],
  }));
  const statusOptions: IOption[] = statusEnumArray.map((e) => ({
    value: e,
    label: mappingStatus[e],
  }));
  // Hoặc sử dụng toán tử nullish coalescing
  const industryOptions: IOption[] = industryState?.listIndustry?.length
    ? industryState.listIndustry.map((item) => ({
      value: item.id,
      label: item.name,
    }))
    : [];
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
      dataIndex: "industry_id",
      title: "Lĩnh vực hoạt động",
      className: "w-[200px]",
      render(_, record) {
        return (
          <div className="flex flex-col">{record?.enterprises?.map((item: string, index: number) => <div key={index}>{item ? item : ""}</div>)}</div>
        );
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "is_active",
      className: "w-[105px]",
      render(_, record, index) {
        return (
          <div key={index} className="flex flex-col gap-2">
            <CommonSwitch
              onChange={() => handleChangeStatus(record)}
              checked={+record.is_active === STATUS.ACTIVE}
              title={`Bạn có chắc chắn muốn ${record.is_active === STATUS.ACTIVE ? "bỏ khóa hoạt động" : "khóa hoạt động"} doanh nghiệp này?`}
            />
          </div>
        );
      },
    },
  ];

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`detail/${record?.key}`);
      },
      permission: EPermissions.CREATE_ENTERPRISE,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/enterprise/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_ENTERPRISE,
    },
    {
      type: EButtonTypes.STATISTICAL,
      onClick(record) {
        navigate(`/enterprise/statistical/${record?.key}`);
      },
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        enterpriseDispatch(deleteEnterprise(record?.key));
      },
      permission: EPermissions.DESTROY_ENTERPRISE,
    },
  ];
  const names = state.projectsStatusPreMonth?.completed?.map((item: string) => Object.keys(item)[0]) || [];
  const completedValues = state.projectsStatusPreMonth?.completed?.map((item: number) => Object.values(item)[0]);
  const approvedValues = state.projectsStatusPreMonth?.approved?.map((item: number) => Object.values(item)[0]);
  const openedBiddingValues = state.projectsStatusPreMonth?.opened_bidding?.map((item: number) => Object.values(item)[0]);
  const additionalTabs = [
    {
      key: "2",
      label: "Doanh nghiệp theo ngành nghề",
      content: (
        <GenericChart
          name={state.industryHasTheMostEnterprise.map(({ industry }) => industry)}
          value={state.industryHasTheMostEnterprise.map(({ total_enterprise }) => total_enterprise)}
          chartType="bar"
          title="Biểu đồ số lượng dự án phân bổ theo ngành nghề"
        />
      ),
    },
    {
      key: "3",
      label: "Dự án theo ngành",
      content: (
        <SelectChart
          title="Top 10 doanh nghiệp đã hoàn thành dự án theo ngành"
          data={state.topEnterprisesHaveCompletedProjectsByIndustry}
          selectedValue={selectedIndustry}
          options={industryState.listIndustry.map((ind: any) => ({ label: ind.name, value: String(ind.id) }))}
          onChange={handleIndustryChange}
          placeholder="Chọn ngành..."
        />
      ),
    },
    {
      key: "4",
      label: "Dự án theo nguồn tài trợ",
      content: (
        <SelectChart
          title="Top 10 doanh nghiệp đã hoàn thành dự án theo nguồn tài trợ"
          data={state.topEnterprisesHaveCompletedProjectsByFundingSource}
          selectedValue={selectedFundingSource}
          options={stateFundingSource.listFundingSources.map((fs: any) => ({ label: fs.name, value: String(fs.id) }))}
          onChange={handleFundingSourceChange}
          placeholder="Chọn nguồn tài trợ..."
        />
      ),
    },
    {
      key: "5",
      label: "Biểu đồ thể hiện số lượng dự án hoàn thành, số lượng dự án được phê duyệt , số lượng dự án mở thầu",
      content: (
        <div className="flex w-full flex-col rounded-xl bg-white p-4 shadow-[0px_4px_30px_0px_rgba(46,45,116,0.05)]">
          <Select
            placeholder="Chọn năm..."
            value={selectedYearProjectStatus}
            onChange={setSelectedYearProjectStatus}
            options={yearOptions.map((year) => ({ label: year, value: year }))}
            style={{ width: 150, marginBottom: 16 }}
          />
          <AreaChart
            categories={names}
            title="Biểu đồ thể hiện số lượng dự án hoàn thành, số lượng dự án được phê duyệt , số lượng dự án mở thầu theo từng tháng"
            series={[
              { name: "Hoàn thành", data: completedValues },
              { name: "Phê duyệt", data: approvedValues },
              { name: "Mở thầu", data: openedBiddingValues },
            ]}
          />
        </div>
      ),
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên  ...",
      label: "Tên doanh nghiệp ",
      type: "text",
    },
    {
      id: "organization_type",
      placeholder: "Chọn tên doanh nghiệp ...",
      label: "Loại hình doanh nghiệp ",
      type: "select",
      options: typeOptions as { value: string; label: string }[],
    },
    {
      id: "industry_ids",
      placeholder: "Chọn lĩnh vực hoạt dộng ...",
      label: "Lĩnh vực hoạt dộng ",
      type: "select",
      isMultiple: true,
      options: industryOptions as { value: string; label: string }[],
    },
    {
      id: "is_active",
      placeholder: "Chọn trạng thái ...",
      label: "Trạng thái",
      type: "select",

      options: statusOptions as { value: string; label: string }[],
    },
  ];
  const data: ITableData[] = useMemo(() => {
    return Array.isArray(enterpriseState.enterprises)
      ? enterpriseState.enterprises.map(
        ({ id, name, organization_type, industry_id, representative, phone, email, address, is_active, is_blacklist, account_ban_at }, index) => ({
          index: index + 1,
          key: id,
          name,
          representative,
          enterprises: (industry_id?.length && industry(industry_id)) || [],
          organization_type,
          phone,
          email,
          address,
          is_active,
          is_blacklist,
          account_ban_at,
        }),
      )
      : [];
  }, [JSON.stringify(enterpriseState.enterprises)]);
  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      enterpriseDispatch(changeStatusActiveEnterprise(String(confirmItem.key)));
    }
  };
  useEffect(() => {
    enterpriseDispatch(getAllEnterprise({ query: enterpriseState.filter }));
    dispatchFundingSource(getListFundingSource());
    industryDispatch(getIndustries());
    dispatch(industryHasTheMostEnterprise({}))
  }, [JSON.stringify(enterpriseState.filter)]);
  useEffect(() => {
    if (enterpriseState.status === EFetchStatus.FULFILLED) {
      enterpriseDispatch(getAllEnterprise({ query: enterpriseState.filter }));
    }
  }, [JSON.stringify(enterpriseState.status)]);

  useFetchStatus({
    module: "enterprise",
    reset: resetStatus,
    actions: {
      success: { message: enterpriseState.message },
      error: { message: enterpriseState.message },
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
          current: enterpriseState.filter.page ?? 1,
          pageSize: enterpriseState.filter.size ?? 10,
          total: enterpriseState.totalRecords,
          number_of_elements: enterpriseState.number_of_elements && enterpriseState.number_of_elements,
          // showSideChanger:true
        }}
        setFilter={setFilter}
        filter={enterpriseState.filter}
        scroll={{ x: 3200 }}
        tabLabel="Tổng quan"
        additionalTabs={additionalTabs}
      />
    </>
  );
};

export default Enterprise;
