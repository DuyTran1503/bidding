import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { IStatisticalReportInitialState, resetStatus } from "@/services/store/statisticalReport/statisticalReport.slice";
import StatisticalReportForm, { IStatisticalReportFormInitialValues } from "../StatisticalReportForm";

const CreateStatisticalReport = () => {
    const navigate = useNavigate();
    const formikRef = useRef<FormikProps<IStatisticalReportFormInitialValues>>(null);
    const { state } = useArchive<IStatisticalReportInitialState>("statistical_report");

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

    return (
        <>
            <Heading
                title="Tạo mới báo cáo thống kê"
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
                        text: "Thêm mới",
                        icon: <FaPlus className="text-[18px]" />,
                        onClick: () => {
                            if (formikRef.current) {
                                formikRef.current.handleSubmit();
                            }
                        },
                    },
                ]}
            />
            <StatisticalReportForm type={EPageTypes.CREATE} formikRef={formikRef} />
        </>
    );
};

export default CreateStatisticalReport;
