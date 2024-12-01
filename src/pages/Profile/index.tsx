/* eslint-disable max-len */
import { useArchive } from "@/hooks/useArchive";
import { IEditProfileInitialState } from "@/services/store/profile/profile.slice";
import { getEditProfile } from "@/services/store/profile/profile.thunk";
import { Card, Descriptions } from "antd";
import { useEffect } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";

const Profile = () => {
  const { state, dispatch } = useArchive<IEditProfileInitialState>("edit_profile");

  useEffect(() => {
    dispatch(getEditProfile({}));
  }, []);

  const renderDescriptionItem = (label: string, value: React.ReactNode, span: number = 1) => (
    <Descriptions.Item className="!px-2 !py-3"
      label={<span className="!w-32 block font-bold">{label}</span>}
      span={span}
    >
      <div className="break-words">{value}</div>
    </Descriptions.Item>
  );
  const fullImageSrc = state.editProfiles?.profile?.avatar.startsWith("http://") || state.editProfiles?.profile?.avatar.startsWith("https://") ? state.editProfiles?.profile?.avatar : `${import.meta.env.VITE_API_URL}/${state.editProfiles?.profile?.avatar}`;
  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return "Không có"; // Trả về khi không có dữ liệu
    }

    try {
      const fixedDate = dateString.includes("T") ? dateString : dateString.replace(" ", "T") + "Z";
      const date = new Date(fixedDate);

      if (isNaN(date.getTime())) {
        return "Không có"; // Trả về khi giá trị không hợp lệ
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return "Không có"; // Trả về khi xảy ra lỗi không mong muốn
    }
  };
  const created = formatDate(state.editProfiles?.profile?.created_at);;
  const update = formatDate(state.editProfiles?.profile?.updated_at);

  return (
    <Card title={"Thông Tin Doanh Nghiệp " + state.editProfiles?.name} className="shadow-lg">
      <div className="flex items-end pb-6">
        <div className="w-32 h-32 mx-6 bg-gray-200 rounded-md overflow-hidden shadow-md">
          <img
            src={fullImageSrc}
            alt="Ảnh đại diện"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <Link to={`update`} className="flex items-center">
            <AiOutlineRight className="mr-2" />
            Sửa thông tin
          </Link>
          <div className="flex items-center">
            <AiOutlineRight className="mr-2" />
            Đăng nhập vào trang vào ngày: {created}

          </div>
          <div className="flex items-center">
            <AiOutlineRight className="mr-2" />
            Ngày cập nhập gần nhất: {update}

          </div>
        </div>
      </div>
      <Descriptions
        bordered
        className="table-fixed w-full"
        column={{ xs: 1, sm: 2, md: 3 }}
      >
        {renderDescriptionItem("Tên doanh nghiệp", state.editProfiles?.name, 3)}
        {renderDescriptionItem("Chức vụ", state.editProfiles?.account_type, 3)}
        {renderDescriptionItem("Mã số thuế", state.editProfiles?.taxcode, 3)}
        {renderDescriptionItem("Email", state.editProfiles?.email, 3)}
        {renderDescriptionItem("Số điện thoại", state.editProfiles?.profile?.phone, 3)}
        {renderDescriptionItem("Ngày sinh", state.editProfiles?.profile?.birthday, 3)}
        {renderDescriptionItem("Giới tính", state.editProfiles?.profile?.gender === 1 ? "Nam" : state.editProfiles?.profile?.gender === 2 ? "Nữ" : "Không xác định", 3)}

      </Descriptions>
    </Card>
  );
};

export default Profile;
