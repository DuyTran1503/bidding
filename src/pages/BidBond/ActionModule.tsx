import Button from "@/components/common/Button";
import Dialog from "@/components/dialog/Dialog";
import { useArchive } from "@/hooks/useArchive";
import { useViewport } from "@/hooks/useViewport";
import { IBidBond } from "@/services/store/bid_bond/bidBond.model";
import { IBidBondInitialState } from "@/services/store/bid_bond/bidBond.slice";
import { createBidBond, updateBidBond } from "@/services/store/bid_bond/bidBond.thunk";
import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
import { getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
import { IProjectInitialState } from "@/services/store/project/project.slice";
import { getListProject } from "@/services/store/project/project.thunk";
import { EButtonTypes } from "@/shared/enums/button";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { bidBondEnumArray, mappingBidBond } from "@/shared/enums/types";
import { IOption } from "@/shared/utils/shared-interfaces";
import { FormikProps } from "formik";
import lodash from "lodash";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { convertDataOptions } from "../Project/helper";
import BidBondForm from "./components/BidBondForm";

interface IBidBondFormProps {
  type?: EButtonTypes;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  item?: IBidBond;
}

export interface IBidBondValues {
  id: string;
  name: string;
  path?: File;
  is_active: string;
}
export const optionType: IOption[] = bidBondEnumArray.map((e) => ({
  label: mappingBidBond[e],
  value: e,
}));
const ActionModuleBidBod = ({ visible, type, setVisible, item }: IBidBondFormProps) => {
  const formikRef = useRef<FormikProps<IBidBond>>(null);
  const { state, dispatch } = useArchive<IBidBondInitialState>("bid_bond");
  const { state: stateProject, dispatch: dispatchProject } = useArchive<IProjectInitialState>("project");
  const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
  const { screenSize } = useViewport();
  const initialValues: IBidBond = {
    id: item?.id || "",
    project_id: item?.project_id || undefined,
    enterprise_id: item?.enterprise_id ?? undefined,
    bond_amount: item?.bond_amount ?? undefined,
    bond_type: item?.bond_type ?? undefined,
    bond_number: item?.bond_number ?? "",
    issue_date: item?.issue_date ?? "",
    expiry_date: item?.expiry_date ?? "",
    description: item?.description ?? "",
    bond_amount_in_words: item?.bond_amount_in_words ?? "",
  };

  const handleSubmit = (data: IBidBond) => {
    const body = {
      ...lodash.omit(data, "id"),
    };
    if (type === EButtonTypes.CREATE) {
      dispatch(createBidBond({ body: body }));
    } else if (type === EButtonTypes.UPDATE && item?.id) {
      dispatch(updateBidBond({ body: body, param: item?.id }));
    }
  };
  useEffect(() => {
    if (state.status === EFetchStatus.FULFILLED) {
      setVisible(false);
    }
  }, [state.status]);

  useEffect(() => {
    if (!!visible) {
      dispatchEnterprise(getListEnterprise());
      dispatchProject(getListProject());
    }
  }, [visible]);
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
          ? "Thêm mới bảo lãnh dự thầu"
          : type === EButtonTypes.UPDATE
            ? "Cập nhật bảo lãnh dự thầu"
            : "Chi tiết bảo lãnh dự thầu"
      }
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <Button key="cancel" text={"Hủy"} type="secondary" onClick={() => setVisible(false)} />
          {type !== EButtonTypes.VIEW && (
            <Button
              key="submit"
              kind="submit"
              text={"Lưu"}
              onClick={() => {
                formikRef.current && formikRef.current.handleSubmit();
              }}
            />
          )}
        </div>
      }
    >
      <BidBondForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        type={type!}
        formik={formikRef as any}
        optionType={optionType}
        projectOptions={convertDataOptions(stateProject.listProjects || [])}
        enterpriseOptions={convertDataOptions(stateEnterprise.listEnterprise || [])}
      />
    </Dialog>
  );
};

export default ActionModuleBidBod;
