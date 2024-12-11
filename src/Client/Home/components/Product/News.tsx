/* eslint-disable max-len */
import newsImg1 from "@/assets/images/news-img-1.jpg";
import newsImg2 from "@/assets/images/news-img-2.jpg";
import newsImg3 from "@/assets/images/news-img-3.jpg";
import End from "@/components/common/End";
import NewsCard from "@/components/common/NewsCard";
import Title from "@/components/common/Title";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";

const News = () => {
  return (
    <>
      <Title children="Tin Tức" className="mt-6" />
      <div className="mt-4 flex gap-3">
        <div className="flex w-3/5 flex-col">
          <NewsCard
            className="border-b border-dashed"
            image={newsImg1}
            title="Chính sách ưu đãi đối với đấu thầu trong nước"
            desc="Đối với gói thầu mua sắm hàng hóa, gói thầu xây lắp có giá gói thầu không quá 05 tỷ đồng, dịch vụ công nghệ thông tin… nhà thầu đều được hưởng ưu đãi khi tham gia đấu thầu. Quy định cụ thể về vấn đề này như thế nào? Mời các bạn cùng tham khảo bài viết dưới đây của DauThau.info!"
          />
          <NewsCard
            className="border-b border-dashed"
            image={newsImg2}
            title="Lựa chọn thầu trong trường hợp khẩn cấp do thiên tai, bão lũ"
            desc="Những ngày đầu tháng 9.2024 vừa qua, miền Bắc nước ta đã chịu ảnh hưởng nặng nề do cơ bão số 3 để lại, vậy pháp luật có quy định lựa chọn thầu trong trường hợp khẩn cấp do thiên tai, bão lũ hay không và thực hiện như thế nào? Hãy cùng DauThau.info phân tích với bài viết dưới đây!"
          />
          <NewsCard
            image={newsImg3}
            title="Chính sách ưu đãi đối với đấu thầu trong nước"
            desc="Đối với gói thầu mua sắm hàng hóa, gói thầu xây lắp có giá gói thầu không quá 05 tỷ đồng, dịch vụ công nghệ thông tin… nhà thầu đều được hưởng ưu đãi khi tham gia đấu thầu. Quy định cụ thể về vấn đề này như thế nào? Mời các bạn cùng tham khảo bài viết dưới đây của DauThau.info!"
          />
        </div>
        <div className="divide border-r"></div>
        <div className="flex w-2/5 flex-col gap-3">
          {[...Array(10)].map((_) => (
            <Link key={_} to="/" className="flex gap-1 hover:text-blue-500 cursor-pointer">
              <GoDotFill className="mt-px text-2xl text-blue-500" />
              10 câu hỏi đầu tiên liên quan đến gói thầu mua sắm hàng hóa được nhiều nhà thầu quan tâm
            </Link>
          ))}
        </div>
      </div>
      <End />
    </>
  );
};

export default News;
