import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { IPostInitialState } from "@/services/store/post/post.slice";
import { Col, RadioChangeEvent, Row } from "antd";
import { createPost, updatePost } from "@/services/store/post/post.thunk";
import { EPageTypes } from "@/shared/enums/page";
import FormCkEditor from "@/components/form/FormCkEditor";
import { FormikRefType } from "@/shared/utils/shared-types";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import FormRadio from "@/components/form/FormRadio";
import { IOption } from "@/shared/utils/shared-interfaces";
import { mappingPost, statusEnumArray } from "@/shared/enums/post";

interface IPostFormProps {
    formikRef?: FormikRefType<IPostFormInitialValues>;
    type: EPageTypes.CREATE | EPageTypes.UPDATE | EPageTypes.VIEW;
    post?: IPostFormInitialValues;
}

export interface IPostFormInitialValues {
    id: string;
    author_id: string;
    short_title: string;
    title: string;
    content: string;
    thumbnail?: File;
    document?: File;
    is_active: string;
}

const PostForm = ({ formikRef, type, post }: IPostFormProps) => {
    const { dispatch } = useArchive<IPostInitialState>("post");

    const initialValues: IPostFormInitialValues = {
        id: "",
        short_title: "",
        author_id: "",
        title: "",
        content: "",
        thumbnail: post?.thumbnail ?? undefined,
        document: post?.thumbnail ?? undefined,
        is_active: "",
    };

    // useEffect(() => {
    //     dispatch(getProfile());
    // }, [dispatch])

    const activeOptions: IOption[] = statusEnumArray.map((key) => ({
        value: key,
        label: mappingPost[key],
    }));

    return (
        <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={(data) => {
                const body = {
                    ...lodash.omit(data, "id"),
                };
                if (type === EPageTypes.CREATE) {
                    dispatch(createPost(body as Omit<IPostFormInitialValues, "id">))

                } else if (type === EPageTypes.UPDATE) {
                    const newData = {
                        id: data.id,
                        short_title: data.short_title,
                        author_id: data.author_id,
                        title: data.title,
                        content: data.content,
                        thumbnail: data.thumbnail,
                        document: data.document,
                        is_active: data.is_active,
                    }
                    const payload = post?.thumbnail === newData.thumbnail && post?.document === newData.document ? (({ ...rest }) => rest)(newData) : newData;
                    dispatch(updatePost({ body: payload, param: post?.id }));

                }
            }}
        >
            {({ values, errors, touched, handleBlur, setFieldValue }) => (
                <div>
                    <Form className="flex flex-col gap-6">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Tiêu đề">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.title}
                                        name="title"
                                        error={touched.title ? errors.title : ""}
                                        placeholder="Nhập tiêu đề..."
                                        onChange={(value) => setFieldValue("title", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Tiêu đề ngắn">
                                    <FormInput
                                        type="text"
                                        isDisabled={type === "view"}
                                        value={values.title}
                                        name="short_title"
                                        error={touched.short_title ? errors.short_title : ""}
                                        placeholder="Nhập tiêu đề ngắn..."
                                        onChange={(value) => setFieldValue("short_title", value)}
                                        onBlur={handleBlur}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Hình ảnh">
                                    <FormUploadFile
                                        isMultiple={false}
                                        value={values.thumbnail}
                                        onChange={(e: any) => {
                                            setFieldValue("thumbnail", e);
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Tài liệu">
                                    <FormUploadFile
                                        isMultiple={false}
                                        value={values.document}
                                        onChange={(e: any) => {
                                            setFieldValue("thumbnail", e);
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Trạng thái">
                                    <FormRadio
                                        options={activeOptions}
                                        value={values.is_active && (activeOptions.find((item) => +item.value === +values.is_active)?.value as string)}
                                        onChange={(e: RadioChangeEvent) => setFieldValue("active", e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={24} sm={24} md={24} xl={24}>
                                <FormGroup title="Nội dung">
                                    <FormCkEditor
                                        id="content"
                                        direction="vertical"
                                        value={values.content}
                                        setFieldValue={setFieldValue}
                                        disabled={type === EPageTypes.VIEW}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )}
        </Formik>
    );
};

export default PostForm;
