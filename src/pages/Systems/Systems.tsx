import Heading from "@/components/layout/Heading";
import { useArchive } from "@/hooks/useArchive";
import { ISystemInitialState } from "@/services/store/system/system.slice";
import { getSystems } from "@/services/store/system/system.thunk";
import { useEffect } from "react";
import SystemForm from "./SystemForm";
import { FaPlus } from "react-icons/fa";
import { EPermissions } from "@/shared/enums/permissions";

const Systems = () => {
    const { state, dispatch } = useArchive<ISystemInitialState>("system");

    useEffect(() => {
        dispatch(getSystems({}));
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Heading
                title="Quản lý hệ thống"
                hasBreadcrumb
                ModalContent={(props) => <SystemForm {...(props as any)} systems={state.systems} />}
                buttons={[
                    {
                        icon: <FaPlus className="text-[18px]" />,
                        permission: EPermissions.UPDATE_SYSTEM,
                        text: "Cập nhật",
                    },
                ]}
            />

            {state.systems ? (
                <div className="p-6 space-y-4 mt-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Logo */}
                    {state.systems?.logo && (
                        <img
                            src={state.systems.logo}
                            alt={state.systems.name}
                            className="mx-auto h-40 object-cover "
                        />
                    )}
                    <h3 className="text-2xl font-bold text-gray-800">
                        {state.systems?.name || "Không có tên"}
                    </h3>

                    {/* Thông tin liên hệ */}
                    <div className="space-y-2 text-gray-600">
                        <p>
                            <span className="font-medium text-gray-700">Điện thoại:</span>{" "}
                            {state.systems?.phone || "Không có"}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">Email:</span>{" "}
                            {state.systems?.email || "Không có"}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">Địa chỉ:</span>{" "}
                            {state.systems?.address || "Không có"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-6">
                    Không có dữ liệu hệ thống.
                </div>
            )}
        </div>
    );
};

export default Systems;
