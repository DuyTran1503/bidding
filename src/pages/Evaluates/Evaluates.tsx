import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IEvaluateInitialState, resetStatus, setFilter } from "@/services/store/evaluate/evaluate.slice";
import { deleteEvaluate, getAllEvaluates } from "@/services/store/evaluate/evaluate.thunk";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { convertDataOptions } from "../Project/helper";
import EvaluateForm from "./EvaluateForm";

const Evaluates = () => {
  const { state, dispatch } = useArchive<IEvaluateInitialState>("evaluate");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");

  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.DETAIL_EVALUATE,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_EVALUATE,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteEvaluate(record?.key));
      },
      permission: EPermissions.DESTROY_EVALUATE,
    },
  ];

  useEffect(() => {
    dispatchEnterprise(getListEnterprise());
    dispatchProject(getListProject());
  }, []);

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-4",
    },
    {
      dataIndex: "project",
      title: "Tên dự án",
      render: (_, record) => {
        return <span>{record.project?.name || "Không có tên dự án"}</span>;
      },
    },
    {
      dataIndex: "enterprise",
      title: "Tên doanh nghiệp",
      render: (_, record) => {
        return <span>{record.enterprise?.user?.name || "Không có tên doanh nghiệp"}</span>;
      },
    },
    {
      dataIndex: "score",
      title: "Điểm",
    },
    {
      dataIndex: "evaluate",
      title: "Nội dung",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.evaluate || "" }} className="text-compact-3"></div>;
      },
    },
  ];
  const search: ISearchTypeTable[] = [
    {
      id: "project",
      placeholder: "Chọn tên dự án...",
      label: "Tên dự án",
      type: "select",
      options: convertDataOptions(stateProject.listProjects || []),
    },
    {
      id: "enterprise",
      placeholder: "Chọn tên doanh nghiệp...",
      label: "Tên doanh nghiệp",
      type: "select",
      options: convertDataOptions(stateEnterprise.listEnterprise || []),
    },
    {
      id: "evaluate",
      placeholder: "Nhập nội dung đánh giá...",
      label: "Nội dung đánh giá",
      type: "text",
    },
    {
      id: "score_from",
      type: "numberRange",
      rangeFields: { minField: "score_from", maxField: "score_to" },
    }
  ];

  const data: ITableData[] = useMemo(
    () =>
      state.evaluates && state.evaluates.length > 0
        ? state.evaluates.map(({ id, title, score, evaluate, project, enterprise }, index) => ({
          index: index + 1,
          key: id,
          id: id,
          title,
          score,
          evaluate,
          project,
          enterprise,
        }))
        : [],
    [JSON.stringify(state.evaluates)],
  );

  useFetchStatus({
    module: "evaluate",
    reset: resetStatus,
    actions: {
      success: { message: state.message },
      error: { message: state.message },
    },
  });

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllEvaluates({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useEffect(() => {
    dispatch(getAllEvaluates({ query: state.filter }));
  }, [JSON.stringify(state.filter)]);

  return (
    <>
      <Heading
        title="Đánh giá kết quả dự án"
        hasBreadcrumb
        ModalContent={(props) =>
          <EvaluateForm
            {...(props as any)}
            listEnterprise={stateEnterprise.listEnterprise}
            listProjects={stateProject.listProjects}
          />
        }
        buttons={[
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_EVALUATE,
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
          total: state.totalRecords!,
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) =>
          <EvaluateForm
            {...(props as any)}
            listEnterprise={stateEnterprise.listEnterprise}
            listProjects={stateProject.listProjects}
          />
        }
      />
    </>
  );
};

export default Evaluates;
