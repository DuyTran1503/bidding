import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getStatisticalReportById } from "@/services/store/statisticalReport/statisticalReport.thunk";
import { IStatisticalReportInitialState, resetStatus } from "@/services/store/statisticalReport/statisticalReport.slice";
import StatisticalReportForm, { IStatisticalReportFormInitialValues } from "../StatisticalReportForm";

const UpdateStatisticalReport = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IStatisticalReportFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IStatisticalReportInitialState>("statistical_report");
  const [data, setData] = useState<IStatisticalReportFormInitialValues>();
  const { id } = useParams();

  useFetchStatus({
    module: "statistical_report",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/statistical-reports",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getStatisticalReportById(id));
    }
  }, [id]);

  useEffect(() => {
    if (!!state.activeStatisticalReport) {
      setData(state.activeStatisticalReport);
    }
  }, [JSON.stringify(state.statisticalReport)]);

  useEffect(() => {
    if (data) {
      if (formikRef.current) {
        formikRef.current.setValues({
          name: data.name,
          description: data.description,
          is_active: data.is_active,
        });
      }
    }
  }, [data]);

  return (
    <>
      <Heading
        title="Cập nhật báo cáo thống kê"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/statistical-reports");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Cập nhật",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => formikRef.current?.handleSubmit(),
          },
        ]}
      />
      {state.activeStatisticalReport ? (
        <StatisticalReportForm type={EPageTypes.UPDATE} formikRef={formikRef} statisticalReport={state.activeStatisticalReport} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UpdateStatisticalReport;
