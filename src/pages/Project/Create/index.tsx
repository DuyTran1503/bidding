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
import ChildrenProject from "../ChildrenProject";
import Button from "@/components/common/Button";
import toast from "react-hot-toast";
import { clearChildrenState } from "@/shared/utils/localStorage";
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

const { TabPane } = Tabs;

const CreateProject = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<INewProject>>(null);
  const { state } = useArchive<IProjectInitialState>("project");
  const { state: stateIndustry, dispatch: dispatchIndustry } = useArchive<IIndustryInitialState>("industry");
  const { state: stateFundingSource, dispatch: dispatchFundingSource } = useArchive<IFundingSourceInitialState>("funding_source");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { state: stateMethod, dispatch: dispatchMethod } = useArchive<ISelectionMethodInitialState>("selection_method");
  const { state: stateStaff, dispatch: dispatchStaff } = useArchive<IAccountInitialState>("account");
  const { state: stateProcurement, dispatch: dispatchProcurement } = useArchive<IProcurementInitialState>("procurement");

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
      disabled: !state.dataCreateProject?.id,
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
            type={EPageTypes.CREATE}
            project={state.dataCreateProject}
            isChildren
            formikRef={formikRef}
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
      label: "Hồ sơ đấu thầu",
      disabled: !state.dataCreateProject?.id,
      children: <CreateBidDocument />,
    },
    {
      key: "4",
      label: "Bão lãnh dự thầu",
      disabled: !state.dataCreateProject?.id,
      children: <div>Outgoing email settings content goes here</div>,
    },
  ];

  return <Tabs items={tabItems} />;
};

export default CreateProject;
