import Button from "@/components/common/Button";
import Logo from "@/components/common/Logo";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IAuthInitialState, resetStatus } from "@/services/store/auth/auth.slice";
import { changePassword } from "@/services/store/auth/auth.thunk";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Formik } from "formik";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as Yup from "yup";

interface INewPasswordFormData {
    password: string;
    password_confirmation: string;
}

const NewPassword: React.FC = () => {
    const { state, dispatch } = useArchive<IAuthInitialState>("auth");
    const location = useLocation();

    // Trích xuất token từ URL
    const token = new URLSearchParams(location.search).get("token") || "";
    const email = new URLSearchParams(location.search).get("email") || "";

    // Gửi yêu cầu đổi mật khẩu
    const handleNewPassword = (data: INewPasswordFormData) => {
        dispatch(
            changePassword({
                body: {
                    token,
                    email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                },
            })
        );
    };

    // Hook xử lý trạng thái fetch và điều hướng
    useFetchStatus({
        module: "auth",
        reset: resetStatus,
        actions: {
            success: {
                message: "Đổi mật khẩu thành công!",
                navigate: "/auth/login",
            },
            error: {
                message: state.message,
            },
        },
    });

    // Giá trị khởi tạo cho form
    const NewPasswordInitialValues: INewPasswordFormData = {
        password: "",
        password_confirmation: "",
    };

    // Schema validation
    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required("Vui lòng nhập mật khẩu!")
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự!"),
        password_confirmation: Yup.string()
            .required("Vui lòng xác nhận mật khẩu!")
            .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp!"),
    });

    return (
        <section className="bg-gradient-to-tl from-blue-500 to-cyan-300">
            <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
                <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
                    <div className="flex flex-col gap-5 p-8">
                        <a href="/" className="flex justify-center">
                            <Logo />
                        </a>
                        <h1 className="text-gray-900 display-m-bold md:text-xl-semibold text-center">
                            Nhập mật khẩu mới
                        </h1>
                        <Formik
                            validationSchema={validationSchema}
                            initialValues={NewPasswordInitialValues}
                            validateOnBlur
                            onSubmit={handleNewPassword}
                        >
                            {({ handleSubmit, values, setFieldValue, errors, touched, handleBlur }) => (
                                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                                    <FormInput
                                        type="password"
                                        value={values.password}
                                        error={touched.password ? errors.password : ""}
                                        name="password"
                                        onChange={(value) => setFieldValue("password", value)}
                                        onBlur={handleBlur}
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <FormInput
                                        type="password"
                                        value={values.password_confirmation}
                                        error={touched.password_confirmation ? errors.password_confirmation : ""}
                                        name="password_confirmation"
                                        onChange={(value) => setFieldValue("password_confirmation", value)}
                                        onBlur={handleBlur}
                                        placeholder="Xác nhận mật khẩu mới"
                                    />
                                    <Button
                                        text="Đặt lại mật khẩu"
                                        isLoading={state.status === EFetchStatus.PENDING}
                                        className="mt-3"
                                    />
                                    <Link
                                        to="/auth/login"
                                        className="cursor-pointer text-end font-normal text-cyan-600 transition-colors hover:text-cyan-500"
                                    >
                                        Đăng nhập
                                    </Link>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewPassword;
