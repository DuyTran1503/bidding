import bidIcon from "@/assets/images/bid-icon.svg";

const End = () => {
  return (
      <div className="mt-10 flex items-center justify-center gap-3">
        <div className="w-20 border-t border-gray-400"></div>
        <img src={bidIcon} alt="" className="h-8 w-8" />
        <div className="w-20 border-t border-gray-400"></div>
      </div>
  );
};

export default End;
