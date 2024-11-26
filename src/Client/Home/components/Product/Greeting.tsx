import End from "@/components/common/End";
import { Link } from "react-router-dom";

export interface IGreetingProps {
  className?: string;
}

const Greeting = ({ className }: IGreetingProps) => {
  return (
    <div {...{ className }}>
      <p>
        Chào <b>Bạn</b>,
      </p>
      <p>
        Bạn chưa đăng nhập, vui lòng <Link children="đăng nhập" to="/login" className="font-bold text-blue-500 hover:text-blue-600" /> để sử dụng
        hết các chức năng dành cho thành viên.
      </p>
      <div className="border-l-4 p-5">Bạn có thể sử dụng tài khoản ở DauThau.info để đăng nhập trên DauThau.Net và ngược lại!</div>
      <p className="mt-5">
        Nếu Bạn chưa có tài khoản thành viên, hãy{" "}
        <Link children="đăng ký" to="/register" className="font-bold text-blue-500 hover:text-blue-600" />.
      </p>
      <div className="border-l-4 p-5">
        Việc này chỉ mất 5 phút và hoàn toàn miễn phí! Tài khoản này của bạn có thể sử dụng chung ở tất cả hệ thống của chúng tôi, bao gồm
        DauThau.info và DauThau.Net
      </div>
      <End />
    </div>
  );
};

export default Greeting;
