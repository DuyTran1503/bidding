import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import ActionModule from "./ActionModule";
import { IEvaluationCriteriaInitialState, resetStatus, setFilter } from "@/services/store/evaluation/evaluation.slice";
import { changeStatusEvaluation, deleteEvaluation, getAllEvaluations } from "@/services/store/evaluation/evaluation.thunk";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";

const EvaluationCriteria = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IEvaluationCriteriaInitialState>("evaluation");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");

  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const projectName = (value: number) => {
    if (stateProject?.listProjects!.length > 0 && !!value) return stateProject?.listProjects!.find((item) => item.id === value)?.name;
  };
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      permission: EPermissions.LIST_EVALUATION,
    },
    {
      type: EButtonTypes.UPDATE,
      permission: EPermissions.UPDATE_EVALUATION,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteEvaluation(record?.key));
      },
      permission: EPermissions.DESTROY_EVALUATION,
    },
  ];

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusEvaluation(String(confirmItem.key)));
    }
  };
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "project_name",
      title: "Dự án",
      className: "w-[250px]",
    },
    {
      dataIndex: "name",
      title: "Tên tiêu chí",
      className: "w-[200px]",
    },
    {
      dataIndex: "weight",
      title: "Trọng số",
      className: "w-[150px]",
    },
    {
      dataIndex: "decription",
      title: "Mô tả",
      className: "w-[250px]",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.description || "" }} className="text-compact-2"></div>;
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

  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };

  const data: ITableData[] = useMemo(
    () =>
      state.evaluations && state.evaluations.length > 0
        ? state.evaluations.map(({ id, project_id, project_name, name, weight, description, is_active }, index) => ({
            index: index + 1,
            key: id,
            id,
            project_id,
            project_name: projectName(+project_id!),
            name,
            weight,
            description,
            is_active,
          }))
        : [],
    [JSON.stringify(state.evaluations), JSON.stringify(stateProject.listProjects)],
  );

  useEffect(() => {
    dispatch(getAllEvaluations({ query: state.filter }));
    dispatchProject(getListProject());
  }, [JSON.stringify(state.filter)]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllEvaluations({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "evaluation",
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

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên tiêu chí đánh giá...",
      label: "Tên tiêu chí đánh giá",
      type: "text",
    },
  ];

  return (
    <>
      <Heading
        title="Tiêu chí đánh giá"
        ModalContent={(props) => <ActionModule {...(props as any)} />}
        hasBreadcrumb
        buttons={[
          {
            text: "Export",
            type: "ghost",
            icon: <GoDownload className="text-[18px]" />,
          },
          {
            icon: <FaPlus className="text-[18px]" />,
            permission: EPermissions.CREATE_EVALUATION,
            text: "Thêm mới",
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
          // showSideChanger: true,
        }}
        setFilter={setFilter}
        filter={state.filter}
        ModalContent={(props) => <ActionModule {...(props as any)} />}
      />
    </>
  );
};

export default EvaluationCriteria;
