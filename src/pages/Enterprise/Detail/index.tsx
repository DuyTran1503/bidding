import Heading from "@/components/layout/Heading";
import CustomTabs from "@/components/table/CustomTabs";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IEmployeeInitialState } from "@/services/store/employee/employee.slice";
import { getAllEmployee } from "@/services/store/employee/employee.thunk";
import { IEnterprise } from "@/services/store/enterprise/enterprise.model";
import { IEnterpriseInitialState, resetStatus } from "@/services/store/enterprise/enterprise.slice";
import { getEnterpriseById } from "@/services/store/enterprise/enterprise.thunk";
import { Card, Descriptions } from "antd";
import { useEffect, useState } from "react";
import { IoClose, IoImage } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import Employee from "./Details/Employee";
import Investor from "./Details/Investor";
import Tenderer from "./Details/Tenderer";
const DetailEnterprise = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IEnterpriseInitialState>("enterprise");
  // const { state: wontState, dispatch: wontDispatch } = useArchive<IProjectInitialState>("project");
  const { state: employeeState, dispatch: employeeDispatch } = useArchive<IEmployeeInitialState>("employee");
  const [data, setData] = useState<IEnterprise>();
  const { id } = useParams();

  useFetchStatus({
    module: "enterprise",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/enterprise",
      },
      error: {
        message: state.message,
      },
    },
  });
  useEffect(() => {
    if (!!state.enterprise) {
      setData(state.enterprise);
    }
  }, [JSON.stringify(state.enterprise)]);
  useEffect(() => {
    if (id) {
      dispatch(getEnterpriseById(id));
    }
  }, [id]);
   useEffect(() => {
    employeeDispatch(getAllEmployee({
      query: {
        ...employeeState.employees,
        page: employeeState.filter.page,
        size: employeeState.filter.size,
        enterprise: id
      },
    }))
  }, [employeeDispatch, employeeState.filter.page, employeeState.filter.size, id]);
  const renderDescriptionItem = (label: string, value: React.ReactNode, span: number = 1) => (
    <Descriptions.Item className="!px-2 !py-3"
      label={<span className="!w-32 block font-bold">{label}</span>}
      span={span}
    >
      <div className="break-words">{value}</div>
    </Descriptions.Item>
  );
const fullImageSrc = 
  typeof data?.avatar === 'string' && 
  (data?.avatar.startsWith("http://") || data?.avatar.startsWith("https://"))
  ? data?.avatar
  : data?.avatar instanceof File 
  ? URL.createObjectURL(data.avatar)
  : `${import.meta.env.VITE_API_URL}/${data?.avatar}`;

  const tabItems = [
    {
      key: "1",
      label: "Thông tin của doanh nghiệp",
      content: (
        <Card title={"Thông Tin Doanh Nghiệp " + state.enterprise?.name} className="shadow-lg relative">
          <div className="w-36 h-[188px] mx-6 bg-gray-100 border border-gray-100 rounded-md flex justify-center items-center absolute right-0">
            {data?.avatar ? (
              <img
                src={fullImageSrc}
                alt="Lỗi ảnh"
                className="w-36 h-[188px]"
              />
            ) : (
              <span className="text-gray-500 w-36 h-[188px] flex items-center justify-center"><IoImage className="text-9xl" /></span>
            )}
          </div>
          <Descriptions
            bordered
            className="table-fixed w-full"
            column={{ xs: 1, sm: 2, md: 3 }}
          >
            {renderDescriptionItem("Tên doanh nghiệp", data?.name, 3)}
            {renderDescriptionItem("Người đại diện", data?.representative, 3)}
            {renderDescriptionItem("Số điện thoại", data?.phone, 3)}
            {renderDescriptionItem("Email", data?.email, 3)}
            {renderDescriptionItem("Địa chỉ", data?.address, 3)}
            {renderDescriptionItem("Ngày gia nhập", data?.establish_date, 3)}
            {renderDescriptionItem("Ngày đăng ký kinh doanh", data?.registration_date, 3)}
            {renderDescriptionItem("Mã số thuế", data?.taxcode, 3)}
            {renderDescriptionItem(
              "Loại hình tổ chức",
              data?.organization_type == 1 ? "Doanh nghiệp nhà nước" :
                data?.organization_type == 2 ? "Ngoài nhà nước" :
                  "Thông tin không có", 3
            )}
            {renderDescriptionItem("Số đăng ký kinh doanh", data?.registration_number, 3)}
            {renderDescriptionItem("Địa chỉ Website", <Link to={data?.website as string}>{data?.website}</Link>, 3)}
            {renderDescriptionItem("Trạng thái cấm",
              data?.account_ban_at == "0" ? "" :
                data?.account_ban_at == "1" ? "Bị cấm" :
                  "", 3
            )}
            {renderDescriptionItem(
              "Trạng thái hoạt động",
              data?.is_active == 0 ? "Hoạt động" :
                data?.is_active == 1 ? "Không hoạt động" :
                  "Thông tin không có",
              3
            )}
            {renderDescriptionItem("Danh sách đen",
              data?.is_active == 0 ? "" :
                data?.is_active == 1 ? "Bị thêm vào danh sách đen" :
                  "", 3
            )}
            {renderDescriptionItem("Mô tả về doanh nghiệp", <div dangerouslySetInnerHTML={{ __html: (data && data?.description) || "" }}></div>, 3)}
          </Descriptions>

          <Investor/>
          <Tenderer/>
        </Card>
      ),
    },
    {
      key: "2",
      label: "Thông tin nhân viên",
      content: (
        <Card title={"Nhân viên của doanh nghiệp " + state.enterprise?.name} className="shadow-lg relative">
         <Employee/>
        </Card>)
    }
  ]

  return (
    <>
      <Heading
        title="Chi tiết Doanh nghiệp"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Quay lại",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/enterprise");
            },
          },
        ]}
      />

      <CustomTabs items={tabItems} />
    </>
  );
};

export default DetailEnterprise;
