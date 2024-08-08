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
import { getBiddingTypeById } from "@/services/store/biddingtype/biddingType.thunk";
import { IBiddingTypeInitialState, resetStatus } from "@/services/store/biddingtype/biddingType.slice";
import BiddingTypeForm, { IBiddingTypeFormInitialValues } from "../BiddingTypeForm";

const UpdateBiddingType = () => {
    const navigate = useNavigate();
    const formikRef = useRef<FormikProps<IBiddingTypeFormInitialValues>>(null);
    const { state, dispatch } = useArchive<IBiddingTypeInitialState>("biddingtype");
    const [data, setData] = useState<IBiddingTypeFormInitialValues>();
    const { id } = useParams();

    useFetchStatus({
        module: "biddingtype",
        reset: resetStatus,
        actions: {
            success: {
                message: state.message,
                navigate: "/bidding-types",
            },
            error: {
                message: state.message,
            },
        },
    });

    useEffect(() => {
        if (id) {
            dispatch(getBiddingTypeById(id));
        }
    }, [id]);

    useEffect(() => {
        if (!!state.activeBiddingType) {
            setData(state.activeBiddingType);
        }
    }, [JSON.stringify(state.biddingType)]);

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
                title="Cập nhật loại đấu thầu"
                hasBreadcrumb
                buttons={[
                    {
                        type: "secondary",
                        text: "Hủy",
                        icon: <IoClose className="text-[18px]" />,
                        onClick: () => {
                            navigate("/bidding-types");
                        },
                    },
                    {
                        isLoading: state.status === EFetchStatus.PENDING,
                        text: "Cập nhật",
                        icon: <FaPlus className="text-[18px]" />,
                        onClick: () => formikRef.current?.handleSubmit()
                    },
                ]}
            />
            {state.activeBiddingType ? (
                <BiddingTypeForm
                    type={EPageTypes.UPDATE}
                    formikRef={formikRef}
                    biddingType={state.activeBiddingType}
                />
            ) : (<div>Loading...</div>)}
        </>
    );
};

export default UpdateBiddingType;
