import { useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { getBiddingResultById } from "@/services/store/biddingResult/biddingResult.thunk";
import { IBiddingResultInitialState, resetStatus } from "@/services/store/biddingResult/biddingResult.slice";
import BiddingResultForm, { IBiddingResultFormInitialValues } from "../BiddingResultForm";

const UpdateBiddingResult = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingResultFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IBiddingResultInitialState>("bidding_result");
//   const [data, setData] = useState<IBiddingResultFormInitialValues>();
  const { id } = useParams();

  useFetchStatus({
    module: "bidding_result",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/bidding-results",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getBiddingResultById(id));
    }
  }, [id]);

//   useEffect(() => {
//     if (!!state.activeBiddingResult) {
//       setData(state.activeBiddingResult);
//     }
//   }, [JSON.stringify(state.biddingResult)]);

//   useEffect(() => {
//     if (data) {
//       if (formikRef.current) {
//         formikRef.current.setValues({
//             name: data.name,
//             description: data.description,
//             is_active: data.is_active,
//             name: data.name,
//             description: data.description,
//             is_active: data.is_active,
//         });
//       }
//     }
//   }, [data]);

  return (
    <>
      <Heading
        title="Cập nhật lịch sử đấu thầu"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/bidding-results");
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
      {state.activeBiddingResult ? (
        <BiddingResultForm type={EPageTypes.UPDATE} formikRef={formikRef} biddingResult={state.activeBiddingResult} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UpdateBiddingResult;
