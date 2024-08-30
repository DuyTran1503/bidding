import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { IActivityLogInitialState } from "@/services/store/activityLogs/activityLog.slice";
import { resetMessageError } from "@/services/store/business-activity/business-activity.slice";
import { EPageTypes } from "@/shared/enums/page";
import { FormikRefType } from "@/shared/utils/shared-types";
import { Col, Row } from "antd";
import { Formik } from "formik";
import { useEffect } from "react";
import { Form } from "react-router-dom";

export interface IActivityLogInitialValues {
    id: number | string;
    user_id: string;
    action: string;
    details: string;
    address_ip: string;
    user_agent?: string;
  }

interface IActivityLogFormProps {
    formikRef?: FormikRefType<IActivityLogInitialValues>;
    type: EPageTypes.VIEW;
    activityLog?: IActivityLogInitialValues;
  }

const ActivityForm = ({formikRef, type, activityLog}: IActivityLogFormProps) => {
    const {dispatch} = useArchive<IActivityLogInitialState>("activity_log");
    const initialValues: IActivityLogInitialValues = {
      id: activityLog?.id ?? "",
      user_id: activityLog?.user_id ?? "",
      action: activityLog?.action ?? "",
      details: activityLog?.details ?? "",
      user_agent: activityLog?.user_agent ?? "",
      address_ip: ""
    };

    useEffect(() => {
        return () => {
          dispatch(resetMessageError());
        };
      }, []);

      return (
        <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={(data) => {
          if (type === EPageTypes.CREATE) {
            dispatch(createFundingSource({ body: lodash.omit(data, "id") }));
          } else if (type === EPageTypes.UPDATE && fundingSource?.id) {
            dispatch(updateFundingSource({ body: lodash.omit(data, "id"), param: fundingSource.id }));
          }
        }}
      >
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title=" Dự án">
                  <FormInput
                    label=" Dự án"
                    placeholder="Nhập  dự án..."
                    name="id_project"
                    value={values.id_project}
                    error={touched.id_project ? errors.id_project : ""}
                    onChange={(e) => setFieldValue("id_project", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
                <FormGroup title=" Tài liệu đấu thầu">
                  <FormInput
                    label=" Tài liệu đấu thầu"
                    placeholder="Nhập  tài liệu đấu thầu..."
                    name="id_enterprise"
                    value={values.id_enterprise}
                    error={touched.id_enterprise ? errors.id_enterprise : ""}
                    onChange={(e) => setFieldValue("id_enterprise", e)}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      )
}

export default ActivityForm