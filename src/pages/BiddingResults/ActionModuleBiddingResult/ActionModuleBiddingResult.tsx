import { useArchive } from "@/hooks/useArchive";
import { FormikProps } from "formik";
import Dialog from "@/components/dialog/Dialog";
import { Dispatch, SetStateAction, useRef } from "react";
import { EButtonTypes } from "@/shared/enums/button";
import Button from "@/components/common/Button";
import { useViewport } from "@/hooks/useViewport";
import { IBiddingResult } from "@/services/store/biddingResult/biddingResult.model";
import { IBiddingResultInitialState } from "@/services/store/biddingResult/biddingResult.slice";
import BiddingResultForm from "../BiddingResultForm";
import { EFetchStatus } from "@/shared/enums/fetchStatus";

interface IBiddingResultFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IBiddingResult;
}

const ActionModuleBiddingResult = ({ visible, type, setVisible, item }: IBiddingResultFormProps) => {
  const formikRef = useRef<FormikProps<IBiddingResult>>(null);
  const { state } = useArchive<IBiddingResultInitialState>("bidding_result");
  const { screenSize } = useViewport();

  const handleFormSubmitSuccess = () => {
    setVisible(false);
  };
  return (
    <Dialog
      screenSize={screenSize}
      handleSubmit={() => {
        formikRef.current && formikRef.current.handleSubmit();
      }}
      visible={visible}
      setVisible={setVisible}
      title={
        type === EButtonTypes.CREATE
          ? "Tạo mới kết quả đấu thầu"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật kết quả đấu thầu"
            : "Chi tiết kết quả đấu thầu"
      }
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <Button key="cancel" text={"Hủy"} type="secondary" onClick={() => setVisible(false)} />
          {type !== EButtonTypes.VIEW && (
            <Button
              key="submit"
              kind="submit"
              text={"Lưu"}
              isLoading={state.status === EFetchStatus.PENDING}
              onClick={() => {
                formikRef.current && formikRef.current.handleSubmit();
              }}
            />
          )}
        </div>
      }
    >
      <BiddingResultForm formikRef={formikRef} isDialog type={type} biddingResult={item} setVisible={handleFormSubmitSuccess} />
    </Dialog>
  );
};

export default ActionModuleBiddingResult;
