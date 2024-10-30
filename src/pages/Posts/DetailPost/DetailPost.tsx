import Heading from "@/components/layout/Heading";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useArchive } from "@/hooks/useArchive";
import { useEffect } from "react";
import { IPostInitialState } from "@/services/store/post/post.slice";
import { getPostById } from "@/services/store/post/post.thunk";
import PostForm from "../PostForm";
import { EPageTypes } from "@/shared/enums/page";

const DetailPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useArchive<IPostInitialState>("post");

  useEffect(() => {
    if (id) dispatch(getPostById(id));
  }, [id]);

  return (
    <>
      <Heading
        title="Chi tiết "
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
        ]}
      />

      {state.activePost && (
        <PostForm
          type={EPageTypes.VIEW}
          post={{
            ...state.activePost,
          }} />
      )}
    </>
  );
};

export default DetailPost;
