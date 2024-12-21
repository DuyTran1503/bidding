import AreaChart from "@/components/chart/AreaChart";
import GenericChart from "@/components/chart/GenericChart";
import ConfirmModal from "@/components/common/CommonModal";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IAccountInitialState } from "@/services/store/account/account.slice";
import { getListStaff } from "@/services/store/account/account.thunk";
import { IChartInitialState } from "@/services/store/chart/chart.slice";
import { projectByIndustry, projectsStatusPreMonth } from "@/services/store/chart/chart.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import { IProjectInitialState, resetStatus, setFilter } from "@/services/store/project/project.slice";
import { deleteProject, getAllProject, getListProject } from "@/services/store/project/project.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { STATUS_PROJECT_ARRAY } from "@/shared/enums/statusProject";
import { convertMoney } from "@/shared/utils/common/convertMoney";
import { convertTimestamp } from "@/shared/utils/common/convertTimestamp";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { convertDataOptions } from "./helper";
import { formatTreeSelect } from "@/shared/enums/formatTreeSelect";
import { unwrapResult } from "@reduxjs/toolkit";
import Loading from "../Loading/Loading";

const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(String);

const ProjectPage = () => {
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateIndustry, dispatch: dispatchIndustry } = useArchive<IChartInitialState>("chart");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");

  const { state: stateStaff, dispatch: dispatchStaff } = useArchive<IAccountInitialState>("account");
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [selectedYearProjectStatus, setSelectedYearProjectStatus] = useState<string>(yearOptions[0]);
  const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[40px]",
    },
    {
      dataIndex: "name",
      title: "Tên dự án",
      className: "w-[150px]",
    },
    {
      dataIndex: "investor",
      title: "Chủ đầu tư",
      className: "w-[150px]",
    },
    {
      dataIndex: "total_amount",
      title: "Tổng giá gói thầu",
      className: "w-[150px]",
      render(_, record) {
        return convertMoney(record?.total_amount);
      },
    },
    {
      dataIndex: "upload_time",
      title: "Ngày đăng tải",
      className: "w-[100px]",
      render(_, record) {
        return convertTimestamp(record?.upload_time);
      },
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   className: "w-[65px]",
    //   render(_, record, index) {
    //     return (
    //       <div key={index} className="flex flex-col gap-2">
    //         <CommonSwitch onChange={() => handleChangeStatus(record)} checked={+record.status === STATUS_PROJECT.AWAITING} title={""} />
    //       </div>
    //     );
    //   },
    // },
  ];

  const names = stateIndustry.projectsStatusPreMonth?.completed?.map((item: string) => Object.keys(item)[0]) || [];
  const completedValues = stateIndustry.projectsStatusPreMonth?.completed?.map((item: number) => Object.values(item)[0]);
  const approvedValues = stateIndustry.projectsStatusPreMonth?.approved?.map((item: number) => Object.values(item)[0]);
  const openedBiddingValues = stateIndustry.projectsStatusPreMonth?.opened_bidding?.map((item: number) => Object.values(item)[0]);

  const additionalTabs = [
    {
      key: "2",
      label: "Biểu đồ số lượng dự án theo ngành",
      content: (
        <GenericChart
          chartType="bar"
          title="Biểu đồ số lượng dự án theo ngành"
          name={stateIndustry?.industryData?.map(({ name }) => name)}
          value={stateIndustry?.industryData?.map(({ value }) => value)}
          seriesName="Dữ liệu Biểu đồ"
        />
      ),
      color: "green",
    },
    {
      key: "3",
      label: "Biểu đồ thống kê số dự án hoàn thành, phê duyệt và mở thầu theo tháng",
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
            title="Biểu đồ thống kê số dự án hoàn thành, phê duyệt và mở thầu theo tháng"
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
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      onClick(record) {
        navigate(`/project/detail/${record?.key}`);
      },
      permission: EPermissions.DETAIL_PROJECT,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/project/update/${record?.key}`);
      },
      permission: EPermissions.UPDATE_PROJECT,
    },
    {
      type: EButtonTypes.APPROVE,
      onClick(record) {
        navigate(`/project/approve/${record?.key}`);
      },
      permission: EPermissions.UPDATE_PROJECT,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatchProject(deleteProject(record?.key));
      },
      permission: EPermissions.DESTROY_PROJECT,
    },
    {
      type: EButtonTypes.STATISTICAL,
      onClick(record) {
        navigate(`/project/statistical/${record?.key}`);
      },
    },
  ];

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập dự án ...",
      label: "Tên dự án ",
      type: "text",
    },
    {
      id: "staff",
      placeholder: "Chọn nhân viên phê duyêt...",
      label: "Nhân viên phê duyệt ",
      type: "select",
      options: convertDataOptions(stateStaff.getListStaff || []),
    },
    {
      id: "investor",
      placeholder: "Chọn chủ đầu tư...",
      label: "Chủ đầu tư ",
      type: "select",
      options: convertDataOptions(stateEnterprise.listEnterprise || []),
    },
    {
      id: "tenderer",
      placeholder: "Chọn bên mời thầu...",
      label: "Bên mời thầu ",
      type: "select",
      options: convertDataOptions(stateEnterprise.listEnterprise || []),
    },
    {
      id: "upload_time_start",
      placeholder: "Chọn thời gian ...",
      title: "Thời gian bắt đầu đăng tải dự án",
      type: "datetime",
    },
    {
      id: "upload_time_end",
      placeholder: "Chọn thời gian...",
      title: "Thời gian kết thúc đăng tải dự án",
      type: "datetime",
    },
    {
      id: "is_active",
      placeholder: "Chọn trạng thái ...",
      label: "Trạng thái",
      type: "select",

      options: STATUS_PROJECT_ARRAY as unknown as IOption[],
    },
  ];

  const data: ITableData[] = useMemo(() => {
    return Array.isArray(stateProject.projects)
      ? stateProject.projects.map(({ id, name, investor, total_amount, upload_time, bid_submission_start, bid_opening_date, status }, index) => ({
          index: index + 1,
          key: id,
          name,
          investor,
          total_amount,
          upload_time,
          bid_submission_start,
          bid_opening_date,
          status,
        }))
      : [];
  }, [JSON.stringify(stateProject.projects)]);

  useEffect(() => {
    if (selectedYearProjectStatus) {
      dispatchIndustry(projectsStatusPreMonth({ body: { year: selectedYearProjectStatus } }));
    }
  }, [selectedYearProjectStatus, dispatchIndustry]);

  useEffect(() => {
    dispatchProject(getAllProject({ query: stateProject.filter }));
    dispatchIndustry(getIndustries());
    dispatchIndustry(projectByIndustry({}));
    dispatchEnterprise(getListEnterprise());
    dispatchStaff(getListStaff());
    dispatchProject(getListProject())
      .then(unwrapResult)
      .then((result) => {
        const data = result.data;
        const formattedData = formatTreeSelect(data);
        setTreeData(formattedData);
      });
  }, [JSON.stringify(stateProject.filter)]);
  useEffect(() => {
    if (stateProject.status === EFetchStatus.FULFILLED) {
      dispatchProject(getAllProject({ query: stateProject.filter }));
    }
  }, [JSON.stringify(stateProject.status)]);
  useEffect(() => {
    return () => {
      setFilter({ page: 1, size: 10 });
    };
  }, []);
  useFetchStatus({
    module: "project",
    reset: resetStatus,
    actions: {
      success: { message: stateProject.message },
      error: { message: stateProject.message },
    },
  });
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);
  // if (data.length <= 0) {
  //   return <Loading />;
  // }
  return (
    <>
      <Heading
        title="Dự án"
        hasBreadcrumb
        buttons={[
          {
            text: "Thêm mới",
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_PROJECT,
            onClick: () => {
              navigate("/project/create");
            },
          },
        ]}
      />
      <ConfirmModal
        title={"Xác nhận"}
        content={"Bạn chắc chắn muốn thay đổi trạng thái không"}
        visible={isModal}
        setVisible={setIsModal}
        // onConfirm={onConfirmStatus}
      />

      <ManagementGrid
        columns={columns}
        data={data}
        search={search}
        buttons={buttons}
        pagination={{
          current: stateProject.filter.page ?? 1,
          pageSize: stateProject.filter.size ?? 10,
          total: stateProject.totalRecords,
          number_of_elements: stateProject.number_of_elements && stateProject.number_of_elements,
        }}
        setFilter={setFilter}
        filter={stateProject.filter}
        scroll={{ x: 1500 }}
        tabLabel="Danh sách"
        additionalTabs={additionalTabs}
      />
    </>
  );
};
export default ProjectPage;
