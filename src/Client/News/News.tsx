/* eslint-disable max-len */
import NewsCard from "@/components/common/NewsCard";
import Title from "@/components/common/Title";
import { useArchive } from "@/hooks/useArchive";
import { IPostInitialState } from "@/services/store/post/post.slice";
import { getPosts } from "@/services/store/post/post.thunk";
import { useEffect } from "react";

const Newnews = () => {
  const { state, dispatch } = useArchive<IPostInitialState>("post");
  useEffect(() => {
    dispatch(getPosts({}))
  }, [])
  return (
    <>
      <Title children="Tin Tức" className="mt-6" />
      <div className="mt-4">
        {state.posts.slice(0, 5).map((state, index) => (
          <NewsCard key={index}
            className="border-b border-dashed"
            id={state.id}
            image={`${import.meta.env.VITE_API_URL}/${state.thumbnail}`}
            title={state.title}
            desc={state.content}
            time={state.created_at}
            // view={state.view}
          />
        ))}
      </div>
    </>
  );
};

export default Newnews;
