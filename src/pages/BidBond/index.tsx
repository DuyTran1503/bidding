import ConfirmModal from "@/components/common/CommonModal";
import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { ISearchTypeTable } from "@/components/table/SearchComponent";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus, setFilter } from "@/services/store/account/account.slice";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { changeStatusBidBond, deleteBidBond, getAllBidBonds } from "@/services/store/bid_bond/bidBond.thunk";
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
import { GoDownload } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import ActionModule from "./ActionModule";
import { projectOptions } from "./component/searchBidbond";

const BidBonds = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IBidBondInitialState>("bid_bond");
  const [isModal, setIsModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<ITableData | null>();
  const {state: stateProject} = useArchive<IProjectInitialState>("project")
  const {state: stateEnterprise} = useArchive<IEnterpriseInitialState>("enterprise")
  const projectName = (value: number) => {
    if(stateProject?.listProjects!.length > 0 && !!value) {
      return stateProject?.listProjects!.find((item) => item.id === value)?.name
    }
  }
  const enterpriseName = ((value: number) => {
    if(stateEnterprise?.listEnterprise!.length > 0 && !! value) {
      return stateEnterprise?.listEnterprise!.find((item) => item.id === value)?.name
    }
  }) 
  const buttons: IGridButton[] = [
    {
      type: EButtonTypes.VIEW,
      // permission: EPermissions.DETAIL_BID_BOND,
    },
    {
      type: EButtonTypes.UPDATE,
      // permission: EPermissions.UPDATE_BID_BOND,
    },
    {
      type: EButtonTypes.DESTROY,
      onClick(record) {
        dispatch(deleteBidBond(record?.key));
      },
      // permission: EPermissions.DESTROY_BID_BOND,
    },
  ];

  const onConfirmStatus = () => {
    if (confirmItem && confirmItem.key) {
      dispatch(changeStatusBidBond(String(confirmItem.key)));
    }
  };
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
      dataIndex: "enterprise_id",
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
      dataIndex: "project_id",
      title: "Dự án",
      // render(_, record) {
      //   return <div className="flex flex-col">{}</div>
      // }
    },
    {
      dataIndex: "bond_amount",
      title: "Số tiền bảo lãnh",
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "is_active",
    //   render(_, record) {
    //     return (
    //       <CommonSwitch
    //         onChange={() => handleChangeStatus(record)}
    //         checked={!!record.is_active}
    //         title={`Bạn có chắc chắn muốn thay đổi trạng thái không?`}
    //       />
    //     );
    //   },
    // },
  ];

  const handleChangeStatus = (item: ITableData) => {
    setIsModal(true);
    setConfirmItem(item);
  };

  const data: ITableData[] = useMemo(
    () =>
      state.bidBonds && state.bidBonds.length > 0
        ? state.bidBonds.map(
            (
              { id, project_id, bond_amount, bond_type, bond_number, enterprise_id, issue_date, expiry_date, description, bond_amount_in_words },
              index,
            ) => ({
              index: index + 1,
              key: id,
              project_id: projectName(+project_id!),
              bond_amount,
              bond_type,
              bond_number,
              enterprise_id: enterpriseName(+enterprise_id!),
              issue_date,
              expiry_date,
              description,
              bond_amount_in_words,
            }),
          )
        : [],
    [JSON.stringify(state.bidBonds),JSON.stringify(stateEnterprise?.listEnterprise)],
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
    dispatch(getListProject());
  }, [dispatch])
  useEffect(() => {
    dispatch(getListEnterprise())
  },[dispatch])

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

  const projectOptions: IOption[] =
    stateProject?.listProjects && stateProject.listProjects.length > 0
      ? stateProject.listProjects.map((e) => ({
          value: e.id,
          label: e.name,
        }))
      : [];
  const enterprisrOption: IOption[] = 
  stateEnterprise?.listEnterprise! && stateEnterprise.listEnterprise.length > 0
  ? stateEnterprise.listEnterprise.map((e) => ({
        value: e.id,
        label: e.name,
  })): []
  const optionType: IOption[] = bidBondEnumArray.map((e) => ({
    label: mappingBidBond[e],
    value: e,
  }));
  const search: ISearchTypeTable[] = [
    {
      id: "bidbond_number",
      placeholder: "Nhập mã bão lãnh...",
      label: "Mã bão lãnh dự thầu",
      type: "text",
    },
    {
      id: "enterprise_id",
      placeholder: "Nhập tên Người/Tổ chức...",
      label: "Tên Người/Tổ chức bão lãnh dự thầu",
      type: "select",
      options: enterprisrOption as {value: string; label: string}[],
    },
    {
      id: "bond_type",
      placeholder: "Nhập loại bão lãnh...",
      label: "Loại bão lãnh ",
      type: "select",
      options: optionType

    },
    {
      id: "project_id",
      placeholder: "Nhập tên dự án...",
      label: "Tên dự án",
      type: "select",
      options: projectOptions as { value: string; label: string }[],
    },
  ];

  return (
    <>
      <Heading
        title="Bão lãnh dự thầu"
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
            permission: EPermissions.CREATE_BANNER,
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

export default BidBonds;
