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
import { getBiddingHistoryById } from "@/services/store/biddingHistory/biddingHistory.thunk";
import { IBiddingHistoryInitialState, resetStatus } from "@/services/store/biddingHistory/biddingHistory.slice";
import BiddingHistoryForm, { IBiddingHistoryFormInitialValues } from "../BiddingHistoryForm";

const UpdateBiddingHistory = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IBiddingHistoryFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IBiddingHistoryInitialState>("bidding_history");
//   const [data, setData] = useState<IBiddingHistoryFormInitialValues>();
  const { id } = useParams();

  useFetchStatus({
    module: "bidding_history",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/bidding-historys",
      },
      error: {
        message: state.message,
      },
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(getBiddingHistoryById(id));
    }
  }, [id]);

//   useEffect(() => {
//     if (!!state.activeBiddingHistory) {
//       setData(state.activeBiddingHistory);
//     }
//   }, [JSON.stringify(state.biddingHistory)]);

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
              navigate("/bidding-historys");
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
      {state.activeBiddingHistory ? (
        <BiddingHistoryForm type={EPageTypes.UPDATE} formikRef={formikRef} biddingHistory={state.activeBiddingHistory} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UpdateBiddingHistory;
