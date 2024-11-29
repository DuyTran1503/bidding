import AIBanner from "@/assets/images/ai-banner.png";
import End from "@/components/common/End";
import Title from "@/components/common/Title";
import { ConfigProvider } from "antd";
import { AiOutlineCheck } from "react-icons/ai";
import Banner from "../Home/components/Banner";
import NewNews from "../Home/components/NewNews";
import Newnews from "./News";

const News = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <Banner />
      <NewNews />
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              fontSize: 20,
            },
          },
        }}
      >
        <section className="container mt-5 flex gap-5">
          <div className="w-3/4">
            <Newnews />
          </div>
          <div className="w-1/4">
            <Title children="Thống kê" className="mt-6" />
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2">
                <AiOutlineCheck className="mt-1" /> <p><b className="mr-1">11148</b>dự án đang đợi nhà thầu</p>
              </div>
              <div className="flex items-start gap-2">
                <AiOutlineCheck className="mt-1" /><p><b className="mr-1">1418</b>TBMT được đăng trong 24 giờ qua</p>
              </div>
              <div className="flex items-start gap-2">
                <AiOutlineCheck className="mt-1" /><p><b className="mr-1">2208</b>KHLCNT được đăng trong 24 giờ qua</p>
              </div>
              <div className="flex items-start gap-2">
                <AiOutlineCheck className="mt-1" /><p><b className="mr-1">32487</b>TBMT được đăng trong tháng qua</p>
              </div>
              <div className="flex items-start gap-2">
                <AiOutlineCheck className="mt-1" /><p><b className="mr-1">49948</b>KHLCNT được đăng trong tháng qua</p>
              </div>
              <End />
            </div>
            <figure className="mt-3 p-5">
              <img src={AIBanner} alt="" className="h-full w-full object-cover" />
            </figure>
          </div>
        </section>
      </ConfigProvider>
    </div>
  );
};

export default News;
