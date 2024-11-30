import { useArchive } from "@/hooks/useArchive";
import Heading from "@/components/layout/Heading";
import {useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { FormikProps } from "formik";
import useFetchStatus from "@/hooks/useFetchStatus";
import { EPageTypes } from "@/shared/enums/page";
import {  resetStatus } from "@/services/store/employee/employee.slice";
import { IInstruct } from "@/services/store/instruct/instruct.mode";
import { getInstructById } from "@/services/store/instruct/instruct.thunk";
import InstructForm, {IInstructInitialValues} from "@/pages/Instructs/ActionModule.tsx";
import {IInstructInitialState} from "@/services/store/instruct/instruct.slice.ts";

const UpdateInstruct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const formikRef = useRef<FormikProps<IInstruct>>(null);
    const { state, dispatch } = useArchive<IInstructInitialState>("instruct");
    const [data, setData] = useState<IInstructInitialValues>()
    useFetchStatus({
        module: "instruct",
        reset: resetStatus,
        actions: {
            success: {
                message: state.message,
                navigate: "/instructs",
            },
            error: {
                message: state.message,
            },
        },
    });

    useEffect(() => {
        if (!!state.instruct) {
            setData(state.instruct);
        }
    }, [JSON.stringify(state.instruct)]);

    useEffect(() => {
        if (data) {
            if (formikRef.current) {
                formikRef.current.setValues({
                    instruct: data.instruct,
                    is_use: data.is_use,
                });
            }
        }
    }, [data]);

    useEffect(() => {
        if (id) dispatch(getInstructById(id));
    }, [id]);
    return (
        <>
            <Heading
                title="Cập nhật hướng dẫn "
                hasBreadcrumb
                buttons={[
                    {
                        type: "secondary",
                        text: "Hủy",
                        icon: <IoClose className="text-[18px]" />,
                        onClick: () => {
                            navigate("/instructs");
                        },
                    },
                    {
                        isLoading: state.status === EFetchStatus.PENDING,
                        text: "Lưu",
                        icon: <IoSaveOutline className="text-[18px]" />,
                        onClick: () => {
                            formikRef && formikRef.current && formikRef.current.handleSubmit();
                        },
                    },
                ]}
            />
            <InstructForm type={EPageTypes.VIEW} formikRef={formikRef} instruct={data} />
        </>
    );
};

export default UpdateInstruct;
