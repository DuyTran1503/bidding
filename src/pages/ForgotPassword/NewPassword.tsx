import React from "react";
import Button from "@/components/common/Button";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { IAuthInitialState, resetStatus } from "@/services/store/auth/auth.slice";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { object, mixed } from "yup";
import { login } from "@/services/store/auth/auth.thunk";
import useFetchStatus from "@/hooks/useFetchStatus";
import Logo from "@/components/common/Logo";

// Interface cho form data
interface ILoginFormData {
    identifier: string; // Nhận email hoặc tax code
    password: string;
}

// Interface cho payload gửi lên server
interface ILoginPayload {
    email?: string;
    taxcode?: string;
    password: string;
}

const NewPassword: React.FC = () => {
    const { state, dispatch } = useArchive<IAuthInitialState>("auth");

    // Xử lý login với phân biệt email/taxcode
    const handleLogin = (data: ILoginFormData) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const payload: ILoginPayload = {
            password: data.password
        };

        // Kiểm tra và gán giá trị tương ứng cho payload
        if (emailRegex.test(data.identifier)) {
            payload.email = data.identifier;
        }

        dispatch(
            login({
                body: payload,
            }),
        );
    };

    // Hook xử lý trạng thái fetch và điều hướng
    useFetchStatus({
        module: "auth",
        reset: resetStatus,
        actions: {
            success: {
                message: 'Lấy lại mật khẩu thành công',
                navigate: "/auth/login",
            },
            error: {
                message: state.message,
            },
        },
    });

    // Giá trị khởi tạo cho form
    const loginFormInitialValues: ILoginFormData = {
        identifier: "",
        password: ""
    };

    // Schema validation
    const validateSchema = object().shape({
        identifier: mixed()
            .required("Vui lòng nhập email hoặc mã số thuế!")
            .test('is-email-or-tax-id', 'Vui lòng nhập đúng định dạng email hoặc mã số thuế!', value => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const taxIdRegex = /^[0-9]{10,12}$/;
                return emailRegex.test(value as string) || taxIdRegex.test(value as string);
            }),
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
                            Tạo lại mật khẩu người dùng
                        </h1>
                        <Formik
                            validationSchema={validateSchema}
                            initialValues={loginFormInitialValues}
                            validateOnBlur
                            onSubmit={handleLogin}
                        >
                            {({ handleSubmit, values, setFieldValue, errors, touched, handleBlur }) => (
                                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                                    <p className="text-cyan-600 font-medium text-center">Hãy tạo mật khẩu mới!</p>

                                    <FormInput
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        error={touched.password ? errors.password : ""}
                                        isDisabled={state.status === EFetchStatus.PENDING}
                                        onBlur={handleBlur}
                                        onChange={(value) => {
                                            setFieldValue("password", value);
                                        }}
                                        placeholder="Nhập mật khẩu..."
                                    />
                                    <FormInput
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        error={touched.password ? errors.password : ""}
                                        isDisabled={state.status === EFetchStatus.PENDING}
                                        onBlur={handleBlur}
                                        onChange={(value) => {
                                            setFieldValue("password", value);
                                        }}
                                        placeholder="Nhập lại mật khẩu..."
                                    />
                                    <Button
                                        text="Gửi yêu cầu"
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