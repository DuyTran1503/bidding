import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getStatisticalReportById } from "@/services/store/statisticalReport/statisticalReport.thunk";
import { IStatisticalReportInitialState, resetStatus } from "@/services/store/statisticalReport/statisticalReport.slice";
import StatisticalReportForm, { IStatisticalReportFormInitialValues } from "../StatisticalReportForm";

const DetailStatisticalReport = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IStatisticalReportFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IStatisticalReportInitialState>("statistical_report");
  const { id } = useParams();

  useFetchStatus({
    module: "statistical_report",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/statistical_reports",
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

  return (
    <>
      <Heading
        title="Chi tiết báo cáo thống kê"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/statistical_reports");
            },
          },
        ]}
      />
      {state.activeStatisticalReport ? (
        <StatisticalReportForm type={EPageTypes.VIEW} formikRef={formikRef} statisticalReport={state.activeStatisticalReport} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default DetailStatisticalReport;
