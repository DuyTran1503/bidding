import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { EPageTypes } from "@/shared/enums/page";
import { IPostInitialState, resetStatus } from "@/services/store/post/post.slice";
import PostForm, { IPostFormInitialValues } from "../PostForm";

const CreatePost = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IPostFormInitialValues>>(null);
  const { state } = useArchive<IPostInitialState>("post");

  useFetchStatus({
    module: "post",
    reset: resetStatus,
    actions: {
      success: {
        message: state.message,
        navigate: "/posts",
      },
      error: {
        message: state.message,
      },
    },
  });

  return (
    <>
      <Heading
        title="Thêm mới bài viết"
        hasBreadcrumb
        buttons={[
          {
            type: "secondary",
            text: "Hủy",
            icon: <IoClose className="text-[18px]" />,
            onClick: () => {
              navigate("/posts");
            },
          },
          {
            isLoading: state.status === EFetchStatus.PENDING,
            text: "Thêm mới",
            icon: <FaPlus className="text-[18px]" />,
            onClick: () => {
              if (formikRef.current) {
                formikRef.current.handleSubmit();
              }
            },
          },
        ]}
      />
      <PostForm type={EPageTypes.CREATE} formikRef={formikRef} />
    </>
  );
};

export default CreatePost;
