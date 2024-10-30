import { useEffect, useRef } from "react";
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProps } from "formik";
import Heading from "@/components/layout/Heading";
import { EFetchStatus } from "@/shared/enums/fetchStatus";
import useFetchStatus from "@/hooks/useFetchStatus";
import { useArchive } from "@/hooks/useArchive";
import { getPostById } from "@/services/store/post/post.thunk";
import { IPostInitialState, resetStatus } from "@/services/store/post/post.slice";
import PostForm, { IPostFormInitialValues } from "../PostForm";
import { EPageTypes } from "@/shared/enums/page";

const UpdatePost = () => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<IPostFormInitialValues>>(null);
  const { state, dispatch } = useArchive<IPostInitialState>("post");
  const { id } = useParams();

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

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [id]);

  return (
    <>
      <Heading
        title="Cập nhật bài viết"
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
            text: "Cập nhật",
            icon: <IoSaveOutline className="text-[18px]" />,
            onClick: () => formikRef.current?.handleSubmit(),
          },
        ]}
      />
      {state.activePost && (
        <PostForm
          type={EPageTypes.UPDATE}
          formikRef={formikRef}
          post={{
            ...state.activePost,
          }} />
      )}
    </>
  );
};

export default UpdatePost;
