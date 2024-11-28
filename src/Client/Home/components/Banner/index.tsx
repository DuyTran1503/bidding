import { Carousel } from "antd";
import { useEffect } from "react";
import { useArchive } from "@/hooks/useArchive";
import { IBannerInitialState } from "@/services/store/banner/banner.slice";
import { getBanners } from "@/services/store/banner/banner.thunk";

const Banner = () => {
  const { state, dispatch } = useArchive<IBannerInitialState>("banner");
  useEffect(() => {
    dispatch(getBanners({}))
  }, [])
  return (
    <Carousel autoplay touchMove draggable className="w-full h-96 bg-red-50 select-none cursor-grab active:cursor-grabbing">
      {state.banners.map((state, index) => (
        <img key={index} src={`${import.meta.env.VITE_API_URL}/${state.path}`} alt="" className="w-full h-96 object-cover" />
      ))}
    </Carousel>
  );
};

export default Banner;
