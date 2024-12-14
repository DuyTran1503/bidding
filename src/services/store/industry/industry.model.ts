import { IBusinessActivity } from "../business-activity/business-activity.model";

export interface IIndustry {
  id: string;
  business_activity_type_id: string | number;
  business_activity_type?: IBusinessActivity;
  name: string;
  description: string;
  is_active: string;
}
