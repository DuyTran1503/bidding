import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/evaluation/evaluation.slice";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { IQuestionsAnswersInitialState } from "@/services/store/questions_answers/questions_answers.slice";
import { changeStatusQuestionAnswer, deleteQuestionAnswer, getAllQuestionsAnswers } from "@/services/store/questions_answers/questions_answers.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionModule from "./ActionModule";
import { IFeedbackComplaintInitialState } from "@/services/store/feedback_complaint/feedback_complaint.slice";
import { getAllFeedbackComplaints } from "@/services/store/feedback_complaint/feedback_complaint.thunk";

const FeedbackComplaints = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IFeedbackComplaintInitialState>("feedback_complaint");
  const { state: stateProject } = useArchive<IProjectInitialState>("project");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const projectName = (value: number) => {
    if (stateProject?.listProjects!.length > 0 && !!value) {
      return stateProject?.listProjects!.find((item) => item.id === value)?.name;
    }
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
        dispatch(deleteQuestionAnswer(record?.key));
      },
      permission: EPermissions.DESTROY_EVALUATION,
    },
  ];

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusQuestionAnswer(String(confirmItem.key)));
    }
  };
  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
    },
    {
      dataIndex: "project_id",
      title: "Dự án",
      className: "w-[250px]",
    },
    {
      dataIndex: "user_id",
      title: "Người khiếu nại",
      className: "w-[250px]",
    },
    {
      dataIndex: "content",
      title: "Nội dung khiếu nại",
      className: "w-[200px]",
    },
    {
      dataIndex: "responese_content",
      title: "Phản hồi khiếu nại",
      className: "w-[250px]",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.responese_content || "" }} className="text-compact-2"></div>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render(_, record) {
        return (
          <CommonSwitch
            onChange={() => handleChangeStatus(record)}
            checked={!!+record.is_active}
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
      state.feedback_complaints && state.feedback_complaints.length > 0
        ? state.feedback_complaints.map(({ id, project_id, user_id, content, response_content, is_active }, index) => ({
            index: index + 1,
            key: id,
            id,
            project_id,
            user_id,
            project_name: projectName(+project_id!),
            content,
            response_content,
            is_active,
          }))
        : [],
    [JSON.stringify(state.feedback_complaints), JSON.stringify(stateProject.listProjects)],
  );

  useEffect(() => {
    dispatch(getAllFeedbackComplaints({ query: state.filter }));
    dispatch(getListProject());
  }, [JSON.stringify(state.filter)]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllFeedbackComplaints({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "feedback_complaint",
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
  //   const projectOptions: IOption[] =
  //     stateProject?.listProjects && stateProject.listProjects.length > 0
  //       ? stateProject.listProjects.map((e) => ({
  //           value: e.id,
  //           label: e.name,
  //         }))
  //       : [];
  const search: ISearchTypeTable[] = [];

  return (
    <>
      <Heading
        title="Phản hồi khiếu nại"
        ModalContent={(props) => <ActionModule {...(props as any)} />}
        hasBreadcrumb
        // buttons={[
        //   {
        //     text: "Export",
        //     type: "ghost",
        //     icon: <GoDownload className="text-[18px]" />,
        //   },
        //   {
        //     icon: <FaPlus className="text-[18px]" />,
        //     permission: EPermissions.CREATE_EVALUATION,
        //     text: "Thêm mới",
        //   },
        // ]}
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

export default FeedbackComplaints;
