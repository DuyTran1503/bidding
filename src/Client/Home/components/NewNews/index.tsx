import { useArchive } from "@/hooks/useArchive";
import { IPostInitialState } from "@/services/store/post/post.slice";
import { getPosts } from "@/services/store/post/post.thunk";
import { Carousel } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NewNews = () => {
  const { state, dispatch } = useArchive<IPostInitialState>("post");
  useEffect(() => {
    dispatch(getPosts({}))
  }, [])
  return (
    <section className="relative mt-0.5 overflow-hidden">
      <div className="absolute z-10 flex h-10 w-full justify-between pointer-events-none">
        <div
          className="flex h-10 w-24 items-center bg-red-500 pl-3 font-bold text-white"
          style={{ clipPath: "polygon(80% 0, 100% 50%, 80% 100%, 0 100%, 0 0)" }}
        >
          Tin mới
        </div>
        <div className="h-10 w-6 bg-red-500" style={{ clipPath: "polygon(100% 0, 100% 100%, 0% 100%, 70% 50%, 0 0)" }}></div>
      </div>
      <Carousel className="h-10 bg-gray-100 pl-[100px]" autoplay dots={false}>
        <div className="!flex h-10 items-center cursor-pointer">
          <Link to="/">Chính sách ưu đãi đối với đấu thầu trong nước</Link>
        </div>
        <div className="!flex h-10 items-center cursor-pointer">
          <Link to="/">Lựa chọn thầu trong trường hợp khẩn cấp do thiên tai, bão lũ</Link>
        </div>
        <div className="!flex h-10 items-center cursor-pointer">
          <Link to="/news">Lồn què</Link>
        </div>
        {state.posts.map((state, index) => (
        <div key={index} className="!flex h-10 items-center cursor-pointer">
          <Link to={`/news/` + state.id}>{state.short_title}</Link>
        </div>
        ))}
      </Carousel>
    </section>
  );
};

export default NewNews;
