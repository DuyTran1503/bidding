import React from "react";

const Introduce: React.FC = () => {
  interface Subsection {
    subtitle: string;
    text: string[] | string; // Đây là kiểu cho 'text' trong mỗi 'subsection'
  }

  interface Section {
    title: string;
    subsections: Subsection[];
  }
  const sections: Section[] = [
    {
      title: "Giúp các doanh nghiệp trong và ngoài nước có cái nhìn đa chiều và chuyên sâu về thị trường đấu thầu ở Việt Nam.",
      subsections: [
        {
          subtitle: "Khám Phá Thị Trường Đấu Thầu Việt Nam: Cơ Hội và Thách Thức",
          text: "Chúng tôi là cầu nối giữa doanh nghiệp và thị trường đấu thầu ở Việt Nam, cung cấp thông tin chi tiết và đa chiều về cơ hội kinh doanh. Tận dụng sức mạnh của Big Data và Machine Learning, chúng tôi không chỉ đưa ra thông tin tổng quan mà còn phân tích sâu rộng, giúp doanh nghiệp hiểu rõ động lực và xu hướng của thị trường.",
        },
        {
          subtitle: "Thông Tin Tài Nguyên Đấu Thầu: Công Cụ Quyết Định Thông Minh",
          text: "Với dịch vụ của chúng tôi, doanh nghiệp có thể tiếp cận thông tin tài nguyên đấu thầu một cách hiệu quả. Chúng tôi tạo ra môi trường phân tích chuyên sâu, giúp doanh nghiệp xác định chiến lược đấu thầu thông minh, từ việc định giá đến xây dựng hồ sơ thầu một cách chi tiết.",
        },
        {
          subtitle: "Hiểu Rõ Đối Thủ, Chiến Thắng Đấu Thầu",
          text: "Chúng tôi cung cấp cái nhìn đa chiều về đối thủ cạnh tranh, giúp doanh nghiệp phát hiện và tận dụng điểm yếu của đối thủ. Bằng cách này, doanh nghiệp có lợi thế trong quá trình đấu thầu và tối ưu hóa khả năng chiến thắng.",
        },
      ],
    },
    {
      title: "Giúp các doanh nghiệp làm thầu săn thầu hiệu quả, nâng cao năng lực làm thầu cũng như tăng khả năng thắng thầu ở Việt Nam.",
      subsections: [
        {
          subtitle: "Săn Thầu Hiệu Quả: Hành Trình Tối Ưu Hóa Năng Lực Làm Thầu",
          text: "Chúng tôi không chỉ giúp doanh nghiệp săn thầu một cách hiệu quả mà còn tăng cường năng lực làm thầu của họ. Bằng cách áp dụng công nghệ Big Data, chúng tôi đưa ra các phân tích chiến lược, hỗ trợ doanh nghiệp xây dựng kế hoạch thầu chi tiết và chiến thắng ổn định trên thị trường đầy cạm bẫy này.",
        },
        {
          subtitle: "Bí Quyết Thắng Thầu: Đối Phó với Cạm Bẫy Đánh Giá Thầu",
          text: "Chúng tôi cung cấp các chiến lược đánh giá thầu độc đáo, giúp doanh nghiệp vượt qua cạm bẫy thị trường. Tận dụng sức mạnh của Machine Learning, chúng tôi phân tích dữ liệu lịch sử thầu để đưa ra những đề xuất chiến lược độc đáo, tăng cơ hội thắng thầu.",
        },
        {
          subtitle: "Nâng Cao Hiệu Quả Làm Thầu: Công Nghệ Làm Nên Sự Khác Biệt",
          text: "Chúng tôi hướng dẫn doanh nghiệp sử dụng công nghệ để nâng cao hiệu quả làm thầu. Từ việc tự động hóa quy trình đấu thầu đến việc sử dụng dữ liệu để dự đoán xu hướng thị trường, chúng tôi giúp doanh nghiệp tạo ra sự khác biệt và đạt được kết quả xuất sắc.",
        },
      ],
    },
    {
      title: "Giúp các doanh nghiệp tìm ra các thị trường kinh doanh tiềm năng mà công ty chưa có đủ nguồn lực đi khảo sát cũng như nghiên cứu thị trường.",
      subsections: [
        {
          subtitle: "Khám Phá Nguồn Cung Thị Trường: Định Hình Chiến Lược Mở Rộng",
          text: "Chúng tôi sử dụng công nghệ Big Data để xác định các thị trường kinh doanh tiềm năng. Doanh nghiệp sẽ không còn lo lắng về việc thiếu nguồn lực cho việc khảo sát và nghiên cứu thị trường. Thay vào đó, chúng tôi mang đến cái nhìn chi tiết và chiều sâu, giúp doanh nghiệp xác định chiến lược mở rộng hiệu quả.",
        },
        {
          subtitle: "Thị Trường Niche: Khám Phá Khoảnh Khắc Độc Đáo",
          text: "Chúng tôi tìm ra những thị trường niche không chỉ là cơ hội mới mà còn là đất đỏ cho sự sáng tạo. Bằng cách kết hợp dữ liệu đa nguồn, chúng tôi giúp doanh nghiệp đánh bại đối thủ trong các lĩnh vực chưa được khai phá, tạo ra cơ hội kinh doanh độc đáo.",
        },
        {
          subtitle: "Mở Rộng Nhanh Chóng: Phân Tích Chuyên Sâu Gói Thầu",
          text: [
            "Chúng tôi tìm ra những thị trường niche không chỉ là cơ hội mới mà còn là đất đỏ cho sự sáng tạo. Bằng cách kết hợp dữ liệu đa nguồn, chúng tôi giúp doanh nghiệp đánh bại đối thủ trong các lĩnh vực chưa được khai phá, tạo ra cơ hội kinh doanh độc đáo.",
            "Chúng tôi không chỉ giúp doanh nghiệp tìm thị trường mà còn hướng dẫn cách mở rộng nhanh chóng dựa trên nhu cầu mua sắm thông qua phân tích chuyên sâu các gói thầu. Chúng tôi là đối tác đáng tin cậy trong việc định hình chiến lược mở rộng và tăng doanh số bán hàng."
          ],
        },
      ],
    },
    {
      title: "Giúp các đơn vị mua sắm công và tư nâng cao năng lực nghiên cứu thị trường, thẩm định và lựa chọn nhà thầu uy tín và phù hợp với nhu cầu của các đơn vị.",
      subsections: [
        {
          subtitle: "Đối Tác Uy Tín: Lựa Chọn Thấu Hiểu Nhu Cầu Của Bạn",
          text: "Chúng tôi không chỉ là nguồn thông tin mà còn là đối tác đáng tin cậy của các đơn vị mua sắm công và tư. Bằng cách kết hợp sức mạnh của Machine Learning, chúng tôi giúp bạn đánh giá và chọn lựa những nhà thầu có uy tín và phù hợp nhất với nhu cầu cụ thể của bạn.",
        },
        {
          subtitle: "Nâng Cao Năng Lực Nghiên Cứu Thị Trường: Hành Trình Thẩm Định Hiệu Quả",
          text: "Chúng tôi hỗ trợ đơn vị mua sắm công và tư nâng cao năng lực nghiên cứu thị trường thông qua công nghệ tiên tiến. Bằng cách tổng hợp dữ liệu và phân tích chiến lược, chúng tôi giúp bạn đưa ra quyết định dựa trên thông tin chính xác và chiều sâu về thị trường.",
        },
        {
          subtitle: "Sự Chắc Chắn Từ Việc Lựa Chọn Nhà Thầu: Chiến Thắng Bền Vững",
          text: "Chúng tôi đảm bảo sự chắc chắn cho đơn vị mua sắm công và tư thông qua quy trình lựa chọn nhà thầu toàn diện. Từ việc đánh giá uy tín đến khả năng thích ứng với yêu cầu cụ thể, chúng tôi là đối tác giúp bạn đạt được chiến thắng bền vững trên thị trường đấu thầu.",
        },
      ],
    },
    {
      title: "Giúp các doanh nghiệp nước ngoài, các tập đoàn đa quốc gia hiểu rõ nhu cầu thị trường hàng hoá của Việt Nam, từ đó có những lựa chọn về chính sách đầu tư, phát triển kinh doanh tại Việt Nam (kể cả lĩnh vực M&A).",
      subsections: [
        {
          subtitle: "Đồng Hành cùng Doanh Nghiệp Nước Ngoài: Hiểu Rõ Nhu Cầu Thị Trường Việt Nam",
          text: "Chúng tôi là người bạn đồng hành đắc lực của doanh nghiệp nước ngoài, giúp họ hiểu rõ hơn về nhu cầu thị trường hàng hoá tại Việt Nam. Bằng cách cung cấp thông tin chi tiết và chiều sâu về đặc điểm thị trường, chúng tôi hỗ trợ quyết định chính sách đầu tư và phát triển kinh doanh.",
        },
        {
          subtitle: "Lựa Chọn Chiến Lược: Chìa Khóa Mở Cánh Cửa Đầu Tư Thành Công",
          text: "Chúng tôi không chỉ cung cấp dữ liệu mà còn giúp các tập đoàn đa quốc gia đưa ra những lựa chọn chiến lược chính xác. Bằng cách kết hợp thông tin thị trường và xu hướng, chúng tôi là đối tác quan trọng trong việc mở rộng kinh doanh và đạt được thành công bền vững tại Việt Nam.",
        },
        {
          subtitle: "M&A Thông Minh: Nắm Bắt Cơ Hội Phát Triển:",
          text: "Chúng tôi hỗ trợ các tập đoàn đa quốc gia trong quá trình M&A thông qua phân tích sâu rộng về thị trường. Bằng cách đưa ra thông tin chiến lược và đánh giá đối tác tiềm năng, chúng tôi giúp tạo ra các cơ hội phát triển mới và đồng hành cùng sự thành công của doanh nghiệp.",
        },
      ],
    },
  ];

  return (
    <div className="px-4 my-16 space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="space-y-6">
          <h2 className="text-2xl font-semibold">{`${index + 1}. ${section.title}`}</h2>
          <div className="space-y-4">
            {section.subsections?.map((subsection, subIndex) => (
              <div className="space-y-4" key={subIndex}>
                <h3 className="text-xl font-semibold">
                  {`${index + 1}.${subIndex + 1} ${subsection.subtitle}`}
                </h3>
                {Array.isArray(subsection.text) ? (
                  subsection.text.map((text, textIndex) => (
                    <p key={textIndex} className="text-base">
                      {text}
                    </p>
                  ))
                ) : (
                  <p className="text-base">{subsection.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

  );
};

export default Introduce;
