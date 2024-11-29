import clsx from "clsx";
import {  IoTimeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export interface INewsCardProps {
  id: string;
  image: string;
  title: string;
  desc: string;
  time?: string;
  view?: number;
  className?: string;
}

const NewsCard = ({ id, desc, image, title, time, className }: INewsCardProps) => {
  const formattedTime = time
  ? new Date(time).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  : "Không rõ thời gian";

  return (
    <div className={clsx("group py-4", className)}>
      <figure className="float-left mr-3 h-[140px] w-[200px] shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </figure>
      <Link to={`/news/` + id}>
        <h3 className="mt-1 text-xl font-bold text-blue-500 group-hover:text-blue-600 group-hover:underline">{title}</h3>
      </Link>
      <div className="flex gap-2 text-gray-400 mt-2">
        <div className="flex items-center">
          <IoTimeOutline className="mr-2" /> {formattedTime}
        </div>
        {/* <div className="flex items-center">
          <IoEyeOutline className="mr-2" /> Đã xem: {view}
        </div> */}
      </div>
      <p className="mt-2 line-clamp-3"><div dangerouslySetInnerHTML={{ __html: desc }} /></p>
    </div>
  );
};

export default NewsCard;
