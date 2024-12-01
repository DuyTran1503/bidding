import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { INewProject } from "@/services/store/project/project.model";
import { IProjectInitialState, resetStatus as resetStatusProject } from "@/services/store/project/project.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ActionModule from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
import { getProjectById } from "@/services/store/project/project.thunk";
import { Tabs } from "antd";
import { IIndustryInitialState } from "@/services/store/industry/industry.slice";
import { IFundingSourceInitialState } from "@/services/store/funding_source/funding_source.slice";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { ISelectionMethodInitialState } from "@/services/store/selectionMethod/selectionMethod.slice";
import { IAccountInitialState } from "@/services/store/account/account.slice";
import { IProcurementInitialState } from "@/services/store/procurement/procurement.slice";
import { getListSelectionMethods } from "@/services/store/selectionMethod/selectionMethod.thunk";
import { getListFundingSource } from "@/services/store/funding_source/funding_source.thunk";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { getIndustries } from "@/services/store/industry/industry.thunk";
import { getListStaff } from "@/services/store/account/account.thunk";
import { getListProcurement } from "@/services/store/procurement/procurement.thunk";
import CreateBidDocument from "@/pages/BidDocument/Create";
import { optionType } from "@/pages/BidBond/ActionModule";
import BidBondForm from "@/pages/BidBond/components/BidBondForm";
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import { createBidBond } from "@/services/store/bid_bond/bidBond.thunk";
import lodash from "lodash";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { EButtonTypes } from "@/shared/enums/button";
import { convertDataOptions } from "../helper";
import { resetStatus as resetStatusBidBond } from "@/services/store/bid_bond/bidBond.slice";
const UpdateProject = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<INewProject>>(null);
  const formikBidBondRef = useRef<FormikProps<IBidBond>>(null);
  const { state, dispatch } = useArchive<IProjectInitialState>("project");
  const [data, setData] = useState<INewProject>();
  const { id } = useParams();
  const [activeTabKey, setActiveTabKey] = useState<string>("1");
  const [selectedChild, setSelectedChild] = useState<INewProject | null>(null);
  const { state: stateIndustry, dispatch: dispatchIndustry } = useArchive<IIndustryInitialState>("industry");
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSourceInitialState>("funding_source");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateMethod, dispatch: dispatchMethod } = useArchive<ISelectionMethodInitialState>("selection_method");
  const { state: stateStaff, dispatch: dispatchStaff } = useArchive<IAccountInitialState>("account");
  const { state: stateProcurement, dispatch: dispatchProcurement } = useArchive<IProcurementInitialState>("procurement");
  const { state: stateBidBond, dispatch: dispatchBidBond } = useArchive<IBidBondInitialState>("bid_bond");
  useFetchStatus({
    module: "project",
    reset: resetStatusProject,
    actions: {
      success: {
        message: state.message,
        navigate: "/project",
      },
      error: {
        message: state.message,
      },
    },
  });
  useFetchStatus({
    module: "bid_bond",
    reset: resetStatusBidBond,
    actions: {
      success: {
        message: stateBidBond.message,
      },
      error: {
        message: stateBidBond.message,
      },
    },
  });
  useEffect(() => {
    if (id) {
      dispatch(getProjectById(id));
    }
  }, [id]);
  useEffect(() => {
    if (!!state.project) {
      setData(state.project);
    }
  }, [JSON.stringify(state.project)]);
  useEffect(() => {
    dispatchMethod(getListSelectionMethods());
    dispatchFundingSource(getListFundingSource());
    dispatchEnterprise(getListEnterprise());
    dispatchIndustry(getIndustries());
    dispatchStaff(getListStaff());
    dispatchProcurement(getListProcurement());
  }, []);

  const initialValues: IBidBond = {
    id: "",
    project_id: state.project?.id,
    enterprise_id: undefined,
    bond_amount: undefined,
    bond_type: undefined,
    bond_number: "",
    issue_date: "",
    expiry_date: "",
    description: "",
    bond_amount_in_words: "",
  };
  const handleSubmit = (data: IBidBond) => {
    const body = {
      ...lodash.omit(data, "id"),
    };
    dispatchBidBond(createBidBond({ body: body }));
  };
  const tabItems = [
    {
      key: "1",
      label: "Cập nhật dự án",
      children: (
        <div>
          <Heading
            title="Cập nhật dự án"
            hasBreadcrumb
            buttons={[
              {
                type: "secondary",
                text: "Quay lại",
                icon: <IoClose className="text-[18px]" />,
                onClick: () => {
                  navigate("/project");
                },
              },
              {
                isLoading: state.status === EFetchStatus.PENDING,
                text: "Cập nhật",
                icon: <FaPlus className="text-[18px]" />,
                onClick: () => {
                  if (formikRef.current) {
                    formikRef.current.handleSubmit();
                  }
                },
              },
            ]}
          />
          <ActionModule
            type={EPageTypes.UPDATE}
            formikRef={formikRef}
            project={data}
            setActiveTabKey={setActiveTabKey}
            onChildSelect={setSelectedChild}
            listIndustry={stateIndustry.listIndustry}
            listSelectionMethods={stateMethod.listSelectionMethods}
            listFundingSources={stateFundingSource.listFundingSources}
            getListStaff={stateStaff.getListStaff}
            listEnterprise={stateEnterprise.listEnterprise!}
            listProcurement={stateProcurement.listProcurement}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Cập nhật gói thầu dự án",
      disabled: !state.project?.id,
      children: (
        <div>
          <Heading
            title="Cập nhật dự án"
            hasBreadcrumb
            buttons={[
              {
                type: "secondary",
                text: "Quay lại",
                icon: <IoClose className="text-[18px]" />,
                onClick: () => {
                  navigate("/project");
                },
              },
              {
                isLoading: state.status === EFetchStatus.PENDING,
                text: "Cập nhật",
                icon: <FaPlus className="text-[18px]" />,
                onClick: () => {
                  if (formikRef.current) {
                    formikRef.current.handleSubmit();
                  }
                },
              },
            ]}
          />
          <ActionModule
            type={EPageTypes.UPDATE}
            isChildren
            item={selectedChild!}
            project={state.project}
            formikRef={formikRef}
            parent_id={state.project?.id}
            listIndustry={stateIndustry.listIndustry}
            listSelectionMethods={stateMethod.listSelectionMethods}
            listFundingSources={stateFundingSource.listFundingSources}
            getListStaff={stateStaff.getListStaff}
            listEnterprise={stateEnterprise.listEnterprise!}
            listProcurement={stateProcurement.listProcurement}
          />
        </div>
      ),
    },

    {
      key: "3",
      label: "Bão lãnh dự thầu",
      disabled: !state.project?.id,
      children: (
        <>
          <Heading
            title="Tạo mới "
            hasBreadcrumb
            buttons={[
              {
                type: "secondary",
                text: "Quay lại",
                icon: <IoClose className="text-[18px]" />,
                onClick: () => {
                  navigate("/bid-document");
                },
              },
              {
                isLoading: state.status === EFetchStatus.PENDING,
                text: "Tạo mới",
                icon: <FaPlus className="text-[18px]" />,
                onClick: () => {
                  if (formikBidBondRef.current) {
                    formikBidBondRef.current.handleSubmit();
                  }
                },
              },
            ]}
          />
          <BidBondForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            project_id={state.project?.id}
            type={EButtonTypes.CREATE}
            formik={formikBidBondRef as any}
            optionType={optionType}
            projectOptions={convertDataOptions(state.listProjects || [])}
            enterpriseOptions={convertDataOptions(stateEnterprise.listEnterprise || [])}
          />
        </>
      ),
    },
    {
      key: "4",
      label: "Hồ sơ dự thầu",
      disabled: !state.project?.id,
      children: <CreateBidDocument project_id={state.project?.id} />,
    },
    {
      key: "5",
      label: "Kết quả đấu thầu",
      // disabled: !state.project?.id,
      children: <>hdsfd</>,
    },
  ];
  useEffect(() => {
    return () => {
      dispatch(resetStatusProject());
    };
  }, []);
  return <Tabs items={tabItems} activeKey={activeTabKey} onChange={(key) => setActiveTabKey(key)} />;
};

export default UpdateProject;
