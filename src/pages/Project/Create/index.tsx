import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { INewProject } from "@/services/store/project/project.model";
import { IProjectInitialState, resetStatus } from "@/services/store/project/project.slice";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ActionModule from "../ActionModule";
import { EPageTypes } from "@/shared/enums/page";
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
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import BidBondForm from "@/pages/BidBond/components/BidBondForm";
import { EButtonTypes } from "@/shared/enums/button";
import { convertDataOptions } from "../helper";
import { optionType } from "@/pages/BidBond/ActionModule";
import lodash from "lodash";
import { createBidBond } from "@/services/store/bid_bond/bidBond.thunk";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { Tabs } from "antd";
import BiddingResultForm from "@/pages/BiddingResults/BiddingResultForm";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { resetStatus as resetStatusBidResult } from "@/services/store/biddingResult/biddingResult.slice";
const CreateProject = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<INewProject>>(null);
  const formikBidBondRef = useRef<FormikProps<IBidBond>>(null);
  const { state, dispatch } = useArchive<IProjectInitialState>("project");
  const { state: stateIndustry, dispatch: dispatchIndustry } = useArchive<IIndustryInitialState>("industry");
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSourceInitialState>("funding_source");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateMethod, dispatch: dispatchMethod } = useArchive<ISelectionMethodInitialState>("selection_method");
  const { state: stateStaff, dispatch: dispatchStaff } = useArchive<IAccountInitialState>("account");
  const { state: stateProcurement, dispatch: dispatchProcurement } = useArchive<IProcurementInitialState>("procurement");
  const [selectedChild, setSelectedChild] = useState<INewProject | null>(null);
  const { dispatch: dispatchBidBond } = useArchive<IBidBondInitialState>("bid_bond");
  const [activeTabKey, setActiveTabKey] = useState<string>("1");
  const formikRefBidDoc = useRef<FormikProps<IBiddingResult>>(null);
  useFetchStatus({
    module: "project",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        // navigate: "/project",
      },
      error: {
        message: state.message,
      },
    },
  });
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
    project_id: state.project?.id || undefined,
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
  useEffect(() => {
    return () => {
      dispatch(resetStatus());
    };
  }, []);

  const tabItems = [
    {
      key: "1",
      label: "Tạo mới dự án",
      children: (
        <div>
          <Heading
            title="Tạo mới "
            hasBreadcrumb
            buttons={[
              {
                type: "secondary",
                text: "Hủy",
                icon: <IoClose className="text-[18px]" />,
                onClick: () => {
                  navigate("/project");
                },
              },
              {
                isLoading: state.status === EFetchStatus.PENDING,
                text: "Tạo mới",
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
            type={EPageTypes.CREATE}
            formikRef={formikRef}
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
      label: "Tạo gói thầu cho dự án",
      // disabled: !state.dataCreateProject?.id,
      children: (
        <div>
          <Heading
            title="Tạo mới thầu cho dự án"
            hasBreadcrumb
            buttons={[
              {
                type: "secondary",
                text: "Hủy",
                icon: <IoClose className="text-[18px]" />,
                onClick: () => {
                  navigate("/project");
                },
              },
              {
                isLoading: state.status === EFetchStatus.PENDING,
                text: "Tạo mới",
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
            project={state.dataCreateProject}
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
      // disabled: !state.project?.id,
      children: (
        <div>
          <Heading
            title="Tạo mới "
            hasBreadcrumb
            buttons={[
              {
                type: "secondary",
                text: "Hủy",
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
        </div>
      ),
    },
    {
      key: "4",
      label: "Hồ sơ dự thầu",
      // disabled: !state.project?.id,
      children: <CreateBidDocument project_id={state.project?.id} isCreateFromProject />,
    },
    {
      key: "5",
      label: "Kết quả đấu thầu",
      // disabled: !state.project?.id,
      children: (
        <>
          <Heading
            title="Tạo mới "
            hasBreadcrumb
            buttons={[
              {
                type: "secondary",
                text: "Hủy",
                icon: <IoClose className="text-[18px]" />,
              },
              {
                isLoading: state.status === EFetchStatus.PENDING,
                text: "Tạo mới",
                icon: <FaPlus className="text-[18px]" />,
                onClick: () => {
                  if (formikRefBidDoc.current) {
                    formikRefBidDoc.current.handleSubmit();
                  }
                },
              },
            ]}
          />
          <BiddingResultForm formikRef={formikRefBidDoc} type={EButtonTypes.CREATE} isOutSide listEnterprises={stateEnterprise.listEnterprise!} />
        </>
      ),
    },
  ];

  return <Tabs items={tabItems} activeKey={activeTabKey} onChange={(key) => setActiveTabKey(key)} />;
};

export default CreateProject;
