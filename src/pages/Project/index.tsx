import ConfirmModal from "@/components/common/CommonModal";
import CommonSwitch from "@/components/common/CommonSwitch";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IBiddingFieldInitialState } from "@/services/store/biddingField/biddingField.slice";
import { getBiddingFieldAllIds } from "@/services/store/biddingField/biddingField.thunk";
import { IProjectInitialState, resetStatus, setFilter } from "@/services/store/project/project.slice";
import { changeStatusProject, deleteProject, getAllProject } from "@/services/store/project/project.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { STATUS_PROJECT, STATUS_PROJECT_ARRAY } from "@/shared/enums/statusProject";
import { IGridButton, IOption } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const ProjectPage = () => {
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateBiddingField, dispatch: dispatchBiddingField } = useArchive<IBiddingFieldInitialState>("bidding_field");
  const navigate = useNavigate();
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const [isModal, setIsModal] = useState(false);

  const columns: ColumnsType = [
    {
      dataIndex: "index",
      title: "STT",
      className: "w-[65px]",
    },
    {
      dataIndex: "name",
      title: "Tên dự án",
      className: "w-[250px]",
    },
    {
      dataIndex: "investor",
      title: "Chủ đầu tư",
      className: "w-[250px]",
    },
    {
      dataIndex: "total_amount",
      title: "Tổng giá gói thầu",
      className: "w-[250px]",
      // render(_, record, index) {
      //   const organization_type = bidingFieldOptions.find((e) => +e.value === +record?.organization_type)?.label;
      //   return <Fragment key={index}>{organization_type}</Fragment>;
      // },
    },
    {
      dataIndex: "upload_time",
      title: "Ngày đăng tải",
      className: "w-[250px]",
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      className: "w-[65px]",
      render(_, record, index) {
        return (
          <div key={index} className="flex flex-col gap-2">
            <CommonSwitch onChange={() => handleChangeStatus(record)} checked={+record.status === STATUS_PROJECT.AWAITING} title={""} />
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
      // permission: EPermissions.DETAIL_PROJECT,
    },
    {
      type: EButtonTypes.UPDATE,
      onClick(record) {
        navigate(`/project/update/${record?.key}`);
      },
      // permission: EPermissions.UPDATE_PROJECT,
    },
    {
      type: EButtonTypes.APPROVE,
      onClick(record) {
        navigate(`/project/approve/${record?.key}`);
      },
      // permission: EPermissions.UPDATE_PROJECT,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatchProject(deleteProject(record?.key));
      },
      // permission: EPermissions.DESTROY_PROJECT,
    },
  ];
  const bidingFieldOptions = stateBiddingField?.listBidingField?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const search: ISearchTypeTable[] = [
    {
      id: "name",
      placeholder: "Nhập tên...",
      label: "Tên doanh nghiệp ",
      type: "text",
    },
    {
      id: "organization_type",
      placeholder: "Chọn tên doanh nghiệp ...",
      label: "Loại hình doanh nghiệp ",
      type: "select",
      // options: bidingFieldOptions as { value: string; label: string }[],
    },
    {
      id: "bidding_field_id",
      placeholder: "Chọn lĩnh vực đấu thầu ...",
      label: "Lĩnh vực đấu thầu ",
      type: "select",
      isMultiple: true,
      options: bidingFieldOptions,
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

  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };
  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatchProject(changeStatusProject(String(confirmItem.key)));
    }
  };

  useEffect(() => {
    dispatchProject(getAllProject({ query: stateProject.filter }));
    dispatchBiddingField(getBiddingFieldAllIds());
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
  return (
    <>
      <Heading
        title="Dự án"
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
        onConfirm={onConfirmStatus}
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
          // showSideChanger:true
        }}
        setFilter={setFilter}
        filter={stateProject.filter}
        scroll={{ x: 2200 }}
      />
    </>
  );
};
export default ProjectPage;
