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

const QuestionsAnswers = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IQuestionsAnswersInitialState>("questions_answers");
  const {state: stateProject} = useArchive<IProjectInitialState>("project")   
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const projectName = (value: number) => {
    if(stateProject?.listProjects!.length > 0 && !!value) {
      return stateProject?.listProjects!.find((item) => item.id === value)?.name
    }
  }

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
      dataIndex: "asked_by",
      title: "Người hỏi",
      className: "w-[200px]",
    },
    {
        dataIndex: "question_content",
        title: "Nội dung câu hỏi",
        className: "w-[250px]",
        render(_, record) {
          return <div dangerouslySetInnerHTML={{ __html: record?.question_content || "" }} className="text-compact-2"></div>;
        },
      },
    {
      dataIndex: "answered_by",
      title: "Câu trả lời",
      className: "w-[150px]",
    },
    {
      dataIndex: "answer_content",
      title: "Nội dung câu trả lời",
      className: "w-[250px]",
      render(_, record) {
        return <div dangerouslySetInnerHTML={{ __html: record?.answer_content || "" }} className="text-compact-2"></div>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render(_, record) {
        // console.log(!!+record.is_active);

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
      state.questions_answers && state.questions_answers.length > 0
        ? state.questions_answers.map(({ id, project_id, question_content, answer_content, asked_by, answer_by, is_active }, index) => ({
            index: index + 1,
            key: id,
            id,
            project_id,
            project_name: projectName(+project_id!),
            question_content,
            answer_content,
            asked_by,
            answer_by,
            is_active,
          }))
        : [],
    [JSON.stringify(state.questions_answers), JSON.stringify(stateProject.listProjects)],
  );

  useEffect(() => {
    dispatch(getAllQuestionsAnswers({ query: state.filter }));
    dispatch(getListProject());
  }, [JSON.stringify(state.filter)]);

  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      dispatch(getAllQuestionsAnswers({ query: state.filter }));
    }
  }, [JSON.stringify(state.status)]);

  useFetchStatus({
    module: "questions_answers",
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
  const projectOptions: IOption[] =
    stateProject?.listProjects && stateProject.listProjects.length > 0
      ? stateProject.listProjects.map((e) => ({
          value: e.id,
          label: e.name,
        }))
      : [];
  const search: ISearchTypeTable[] = [
   
  ];

  return (
    <>
      <Heading
        title="Câu hỏi / Câu trả lời"
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

export default QuestionsAnswers;
