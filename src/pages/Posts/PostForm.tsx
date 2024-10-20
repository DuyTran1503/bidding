import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import { Form, Formik } from "formik";
import lodash from "lodash";
import { IPostInitialState } from "@/services/store/post/post.slice";
import { Col, RadioChangeEvent, Row } from "antd";
import { createPost, updatePost } from "@/services/store/post/post.thunk";
import FormCkEditor from "@/components/form/FormCkEditor";
import { FormikRefType } from "@/shared/utils/shared-types";
import FormUploadFile from "@/components/form/FormUpload/FormUploadFile";
import FormRadio from "@/components/form/FormRadio";
import { IOption } from "@/shared/utils/shared-interfaces";
import { mappingPost, POST, statusEnumArray } from "@/shared/enums/post";
import { getAllPostCatalogs } from "@/services/store/postCatalog/postCatalog.thunk";
import { useEffect, useState } from "react";
import FormSelect from "@/components/form/FormSelect";
import { RootStateType } from "@/services/reducers";
import { useSelector } from "react-redux";
import { EPageTypes } from "@/shared/enums/page";

interface IPostFormProps {
    formikRef?: FormikRefType<IPostFormInitialValues>;
    type: EPageTypes;
    post?: IPostFormInitialValues;
}

export interface IPostFormInitialValues {
    id: string;
    post_catalog_id: number[];
    post_catalog_name: string[];
    short_title: string;
    title: string;
    content: string;
    thumbnail?: File | string;
    status: number;
}

const PostForm = ({ formikRef, type, post }: IPostFormProps) => {
    const [loading, setLoading] = useState(false);
    const { dispatch, state } = useArchive<IPostInitialState>("post");
    const postCatalogs = useSelector((state: RootStateType) => state.post_catalog.postCatalogs);

    const initialValues: IPostFormInitialValues = {
        id: post?.id || "",
        post_catalog_id: post?.post_catalog_id || [],
        post_catalog_name: post?.post_catalog_name || [],
        short_title: post?.short_title || "",
        title: post?.title || "",
        content: post?.content || "",
        thumbnail: post?.thumbnail || undefined,
        status: post?.status || POST.SHOW,
    };

    const statusOptions: IOption[] = statusEnumArray.map((key) => ({
        value: key.toString(),
        label: mappingPost[key],
    }));

    return (
        <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={(data, { setErrors }) => {
                const body = {
                    ...lodash.omit(data, "id"),
                    post_catalog_id: data.post_catalog_id,
                };
                if (type === EPageTypes.CREATE) {
                    dispatch(createPost(body as Omit<IPostFormInitialValues, "id">))
                        .unwrap()
                        .catch((error) => {
                            const apiErrors = error?.errors || {};
                            setErrors(apiErrors);
                        });
                } else if (type === EPageTypes.UPDATE) {
                    const newData = {
                        id: data.id,
                        short_title: data.short_title,
                        post_catalog_id: data.post_catalog_id,
                        title: data.title,
                        content: data.content,
                        thumbnail: data.thumbnail,
                        status: data.status,
                    };
                    dispatch(updatePost({ body: newData, param: post?.id }));
                }
            }}
        >
            {({ values, errors, touched, handleBlur, setFieldValue }) => {
                useEffect(() => {
                    if (!loading) {
                        dispatch(getAllPostCatalogs({ query: state.filter }));
                        setLoading(true);
                    }
                }, [loading, state.filter, setFieldValue, dispatch]);

                return (
                    <Form className="flex flex-col gap-6">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Trạng thái" className="h-full">
                                    <FormRadio
                                        options={statusOptions}
                                        value={values.status.toString()}
                                        onChange={(e: RadioChangeEvent) => setFieldValue("status", +e.target.value)}
                                    />
                                </FormGroup>
                            </Col>

                            <Col xs={24} sm={24} md={12} xl={12}>
                                <FormGroup title="Danh mục bài viết">
                                    <FormSelect
                                        isMultiple={true}
                                        // isDisabled={type === "view"}
                                        onChange={(value) => {
                                            setFieldValue("post_catalog_id", value);
                                        }}
                                        options={postCatalogs.map((post_catalog) => ({
                                            label: post_catalog.name,
                                            value: post_catalog.id,
                                        }))}
                                        defaultValue={!!values.post_catalog_name && values.post_catalog_name}
                                        placeholder="Chọn danh mục"
                                    />

                                </FormGroup>
                            </Col>

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
                                        value={values.short_title}
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
                                        onChange={(e: any) => setFieldValue("thumbnail", e)}
                                    />
                                </FormGroup>
                            </Col>

                            <Col xs={24} sm={24} md={12} xl={12}>
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
                );
            }}
        </Formik>
    );
};

export default PostForm;
