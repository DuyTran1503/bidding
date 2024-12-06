import Button from "@/components/common/Button";
import Logo from "@/components/common/Logo";
import FormInput from "@/components/form/FormInput";
import { useArchive } from "@/hooks/useArchive";
import useFetchStatus from "@/hooks/useFetchStatus";
import { IAuthInitialState, resetStatus } from "@/services/store/auth/auth.slice";
import { sendMailForgotPassword } from "@/services/store/auth/auth.thunk";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import { Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import { mixed, object } from "yup";

interface ILoginFormData {
    identifier: string; // Nhận email hoặc tax code
    email?: string;
    taxcode?: string;
}
// Interface cho payload gửi lên server
interface ILoginPayload {
    email?: string;
    taxcode?: string;
}

const EnterEmail: React.FC = () => {
    const { state, dispatch } = useArchive<IAuthInitialState>("auth");

    // Xử lý login với phân biệt email/taxcode
    const handleLogin = (data: ILoginFormData) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const payload: ILoginPayload = {
            email: data.email,
            taxcode: data.taxcode,
          };

        // Kiểm tra và gán giá trị tương ứng cho payload
        if (emailRegex.test(data.identifier)) {
            payload.email = data.identifier;
        }

        dispatch(
            sendMailForgotPassword({ body: payload }),
        );
    };

    // Hook xử lý trạng thái fetch và điều hướng
    useFetchStatus({
        module: "auth",
        reset: resetStatus,
        actions: {
            success: {
                message: 'Gửi email thành công',
                navigate: "/auth/success",
            },
            error: {
                message: state.message,
            },
        },
    });

    // Giá trị khởi tạo cho form
    const loginFormInitialValues = {
        identifier: "",
        // taxcode: "",
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
                                    <p className="p-2 border rounded-md text-sm shadow text-gray-300">
                                        Nếu còn nhớ bí danh hoặc email mà bạn đã tự khai báo khi đăng ký tài khoản người dùng,
                                        hãy nhập chúng vào ô trống dưới đây. Sau khi kiểm tra tính hợp lệ, chúng tôi sẽ giúp bạn tạo mật khẩu mới.
                                    </p>
                                    <FormInput
                                        type="text"
                                        autoFocus
                                        value={values.identifier}
                                        error={touched.identifier ? errors.identifier : ""}
                                        isDisabled={state.status === EFetchStatus.PENDING}
                                        name="identifier"
                                        onChange={(value) => {
                                            setFieldValue("identifier", value);
                                        }}
                                        onBlur={handleBlur}
                                        placeholder="Nhập email hoặc mã số thuế..."
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

export default EnterEmail;