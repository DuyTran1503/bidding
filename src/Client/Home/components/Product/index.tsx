import { ConfigProvider, Tabs } from "antd";
import FirstTab from "./FirstTab";
import SecondTab from "./SecondTab";
import Greeting from "./Greeting";
import News from "./News";
import AIBanner from "@/assets/images/ai-banner.png";
import footBanner from "@/assets/images/foot-banner.png";
import { Link } from "react-router-dom";
import End from "@/components/common/End";
import Title from "@/components/common/Title";

const Content = () => {
  return (
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
            <Tabs
              items={[
                { key: "1", label: "Thông báo mời thầu", children: <FirstTab /> },
                { key: "2", label: "Kế hoạch lựa chọn nhà thầu", children: <SecondTab /> },
              ]}
            />
            <End />
            <News />
            <figure className="flex justify-center mt-7">
              <img src={footBanner} alt="" className="w-[90%] object-cover" />
            </figure>
          </div>
          <div className="w-1/4">
            <Title children="Lời chào" className="mt-5" />
            <Greeting className="mt-4" />
            <figure className="mt-3 p-5">
              <img src={AIBanner} alt="" className="h-full w-full object-cover" />
            </figure>
            <Title children="Chuyên viên tư vấn đang hỗ trợ bạn" />
            <p className="rounded-md border border-blue-200 bg-blue-100 px-5 py-6 mt-4 leading-7">
              Bạn chưa đăng nhập.
              <br /> Để xem thông tin mời bạn{" "}
              <Link children="Đăng nhập" to="/login" className="font-bold text-blue-500 hover:text-blue-600" /> hoặc{" "}
              <Link children="Đăng ký" to="/register" className="font-bold text-blue-500 hover:text-blue-600" /> nếu chưa có tài khoản. Việc đăng
              ký rất đơn giản và hoàn toàn miễn phí.
            </p>
            <End />
          </div>
        </section>
      </ConfigProvider>
  );
};

export default Content;
