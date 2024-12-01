import { useArchive } from "@/hooks/useArchive";
import { IEditProfileInitialState } from "@/services/store/profile/profile.slice";
import { getEditProfile } from "@/services/store/profile/profile.thunk";
import { Card, Descriptions, Button } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { state, dispatch } = useArchive<IEditProfileInitialState>("edit_profile");

  useEffect(() => {
    dispatch(getEditProfile({}));
  }, []);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Không có";

    try {
      const fixedDate = dateString.includes("T") ? dateString : `${dateString.replace(" ", "T")}Z`;
      const date = new Date(fixedDate);
      if (isNaN(date.getTime())) return "Không có";

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return "Không có";
    }
  };

  const avatarSrc =
    state.editProfiles?.profile?.avatar?.startsWith("http")
      ? state.editProfiles?.profile?.avatar
      : `${import.meta.env.VITE_API_URL}/${state.editProfiles?.profile?.avatar}`;

  const createdDate = formatDate(state.editProfiles?.profile?.created_at);
  const updatedDate = formatDate(state.editProfiles?.profile?.updated_at);

  return (
    <Card className="shadow-lg rounded-lg p-6">
      <div className="flex items-center space-x-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 shadow-sm">
          <img
            src={avatarSrc || "/default-avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{state.editProfiles?.name || "Tên doanh nghiệp"}</h2>
          <p className="text-gray-600">
            Chức vụ: {state.editProfiles?.account_type === "staff"
              ? "Nhân viên"
              : state.editProfiles?.account_type === "enterprise"
                ? "Doanh nghiệp"
                : "Không xác định"}
          </p>
          <p className="text-gray-600">
            Ngày tạo: {createdDate}
          </p>
          <p className="text-gray-600">
            Cập nhật gần nhất: {updatedDate}
          </p>
          <Link to="update">
            <Button type="primary" className="mt-2">
              Sửa thông tin
            </Button>
          </Link>
        </div>
      </div>

      <Descriptions bordered className="mt-6" column={{ xs: 1, sm: 2, lg: 3 }}>
        <Descriptions.Item label="Tên doanh nghiệp" span={3}>
          {state.editProfiles?.name || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Chức vụ" span={3}>
          {state.editProfiles?.account_type === "staff"
            ? "Nhân viên"
            : state.editProfiles?.account_type === "enterprise"
              ? "Doanh nghiệp"
              : "Không xác định"}
        </Descriptions.Item>
        <Descriptions.Item label="Mã số thuế" span={3}>
          {state.editProfiles?.taxcode || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={3}>
          {state.editProfiles?.email || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại" span={3}>
          {state.editProfiles?.profile?.phone || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh" span={3}>
          {state.editProfiles?.profile?.birthday || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính" span={3}>
          {state.editProfiles?.profile?.gender === 1
            ? "Nam"
            : state.editProfiles?.profile?.gender === 2
              ? "Nữ"
              : "Không xác định"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Profile;
