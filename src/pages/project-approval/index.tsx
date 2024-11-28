import ManagementGrid from '@/components/grid/ManagementGrid'
import Heading from '@/components/layout/Heading'
import { ITableData } from '@/components/table/PrimaryTable';
import { ISearchTypeTable } from '@/components/table/SearchComponent';
import { useArchive } from '@/hooks/useArchive';
import { IprojectApprovalsState, setFilter } from '@/services/store/project-approval/project-approval.slice';
import { getProjectApprovalByStaff } from '@/services/store/project-approval/project-approval.thunk';
import { EButtonTypes } from '@/shared/enums/button';
import { EPermissions } from '@/shared/enums/permissions';
import { STATUS_PROJECT, STATUS_PROJECT_ARRAY, STATUS_PROJECT_LABELS } from '@/shared/enums/statusProject';
import { convertMoney } from '@/shared/utils/common/convertMoney';
import { convertTimestamp } from '@/shared/utils/common/convertTimestamp';
import { IGridButton, IOption } from '@/shared/utils/shared-interfaces';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { convertDataOptions } from '../Project/helper';
import { getListEnterprise } from '@/services/store/enterprise/enterprise.thunk';
import { IEnterpriseInitialState } from '@/services/store/enterprise/enterprise.slice';

const ProjectApproval = () => {
    const { state: state, dispatch: dispatch } = useArchive<IprojectApprovalsState>("project_approval");
    const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
    const navigate = useNavigate();
    const data: ITableData[] = useMemo(() => {
        return Array.isArray(state.projectApprovals)
            ? state.projectApprovals.map(({ id, name, investor, total_amount, upload_time, status }, index) => ({
                index: index + 1,
                key: id,
                name,
                investor,
                total_amount,
                upload_time,
                status,
            }))
            : [];
    }, [JSON.stringify(state.projectApprovals)]);
    console.log(data);

    const columns: ColumnsType = [
        {
            dataIndex: "index",
            title: "STT",
            className: "w-[40px]",
        },
        {
            dataIndex: "name",
            title: "Tên dự án",
            className: "w-[150px]",
        },
        {
            dataIndex: "investor",
            title: "Chủ đầu tư",
            className: "w-[150px]",
        },
        {
            dataIndex: "total_amount",
            title: "Tổng giá gói thầu",
            className: "w-[150px]",
            render(_, record) {
                return convertMoney(record?.total_amount);
            },
        },
        {
            dataIndex: "upload_time",
            title: "Ngày đăng tải",
            className: "w-[100px]",
            render(_, record) {
                return convertTimestamp(record?.upload_time);
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            align: "center",
            className: "w-[65px]",
            render(_, record) {
                let statusColor;

                switch (record.status) {
                    case STATUS_PROJECT.AWAITING:
                        statusColor = "#2db7f5"; // Màu cho trạng thái chờ phê duyệt
                        break;
                    case STATUS_PROJECT.REJECT:
                        statusColor = "red"; // Màu cho trạng thái bị từ chối
                        break;
                    case STATUS_PROJECT.APPROVED:
                        statusColor = "green"; // Màu cho trạng thái đã phê duyệt
                        break;
                    default:
                        statusColor = "gray"; // Màu mặc định
                }

                // Lấy văn bản từ STATUS_PROJECT_LABELS
                const statusText = STATUS_PROJECT_LABELS[record.status as STATUS_PROJECT] || "Không xác định";

                return (
                    <Tag className="inline-block px-2 py-1 text-white" style={{ backgroundColor: statusColor }}>
                        {statusText}
                    </Tag>
                );
            },
        }
    ];
    const buttons: IGridButton[] = [
        {
            type: EButtonTypes.VIEW,
            onClick(record) {
                navigate(`/project/detail/${record?.key}`);
            },
            permission: EPermissions.DETAIL_PROJECT,
        },
        {
            type: EButtonTypes.APPROVE,
            onClick(record) {
                navigate(`/project-approval/approve/${record?.key}`);
            },
            permission: EPermissions.UPDATE_PROJECT,
        },

    ];
    const search: ISearchTypeTable[] = [
        {
            id: "name",
            placeholder: "Nhập tên...",
            label: "Tên dự án ",
            type: "text",
        },
        {
            id: "investor",
            placeholder: "Chọn chủ đầu tư...",
            label: "Chủ đầu tư ",
            type: "select",
            options: convertDataOptions(stateEnterprise.listEnterprise || [])
        },
        {
            id: "tenderer",
            placeholder: "Chọn bên mời thầu...",
            label: "Bên mời thầu ",
            type: "select",
            options: convertDataOptions(stateEnterprise.listEnterprise || [])
        },
        {
            id: "upload_time_start",
            placeholder: "Chọn thời gian ...",
            title: "Thời gian bắt đầu đăng tải dự án",
            type: "datetime",
          },
          {
            id: "upload_time_end",
            placeholder: "Chọn thời gian...",
            title: "Thời gian bắt đầu đăng tải dự án",
            type: "datetime",
          },
        {
            id: "is_active",
            placeholder: "Chọn trạng thái ...",
            label: "Trạng thái",
            type: "select",

            options: STATUS_PROJECT_ARRAY as unknown as IOption[],
        },
    ];
    useEffect(() => {
        dispatch(getProjectApprovalByStaff({ query: state.filter }))
        dispatchEnterprise(getListEnterprise());
    }, [state.filter])
    return (
        <>
            <Heading
                title="Bài viết"
                hasBreadcrumb
            />
            <ManagementGrid
                columns={columns}
                data={data}
                search={search}
                buttons={buttons}
                pagination={{
                    current: state.filter.page ?? 1,
                    pageSize: state.filter.size ?? 10,
                    total: state.totalRecords!,
                }}
                setFilter={setFilter}
                filter={state.filter}
            />
        </>
    )
}

export default ProjectApproval