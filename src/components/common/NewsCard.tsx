import clsx from "clsx";

export interface INewsCardProps {
  image: string;
  title: string;
  desc: string;
  className?: string;
}

const NewsCard = ({ desc, image, title, className }: INewsCardProps) => {
  return (
    <div className={clsx("group cursor-pointer py-4", className)}>
      <figure className="float-left mr-3 h-[140px] w-[200px] shrink-0 overflow-hidden rounded-md bg-gray-100">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </figure>
      <h3 className="mt-1 font-bold text-blue-500 group-hover:text-blue-600 group-hover:underline">{title}</h3>
      <p className="mt-4">{desc}</p>
    </div>
  );
};

export default NewsCard;
