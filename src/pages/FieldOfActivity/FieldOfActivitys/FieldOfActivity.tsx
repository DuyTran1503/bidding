import ManagementGrid from "@/components/grid/ManagementGrid";
import Heading from "@/components/layout/Heading";
import { ITableData } from "@/components/table/PrimaryTable";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { resetStatus } from "@/services/store/auth/auth.slice";
import { IFieldOfActivityInitialState } from "@/services/store/field_of_activity/field_of_activity.slice";
import { EButtonTypes } from "@/shared/enums/button";
import { EPermissions } from "@/shared/enums/permissions";
import { IGridButton } from "@/shared/utils/shared-interfaces";
import { ColumnsType } from "antd/es/table";
import { useEffect, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FieldOfActivity = () => {
    const navigate = useNavigate();
    const {state, dispatch} = useArchive<IFieldOfActivityInitialState>("fieldofactivity");
    useFetchStatus({
        module: "fieldofactivity",
        reset: resetStatus,
        actions: {
        success: { message: state.message },
        error: { message: state.message },
        },
    });

    useEffect(() => {
        dispatch(getAllFundingSources({ query: state.filter }));
      }, [JSON.stringify(state.filter)]);
    
      const columns: ColumnsType = [
        {
          dataIndex: "name",
          title: "Tên nguồn tài trợ",
        },
        {
          dataIndex: "type",
          title: "Loại nguồn tài trợ",
        },
         ]
}
