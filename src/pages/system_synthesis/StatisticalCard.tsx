import { Card } from "antd";
import React from "react";

// Enums with snake_,ase keys
const keyMappings = {
  projectStatsKeys: {
    total_project: "Tổng số dự án",
    total_await_project: "Dự án đang chờ",
    total_reject_project: "Dự án bị từ chối",
    total_approve_project: "Dự án đã được phê duyệt",
  },

  enterpriseStatsKeys: {
    total_enterprises: "Tổng số doanh nghiệp",
    total_active_enterprises: "Doanh nghiệp hoạt động",
    total_inactive_enterprises: "Doanh nghiệp ngừng hoạt động",
  },

  industryStatsKeys: {
    total_industries: "Tổng số ngành",
    total_active_industries: "Ngành hoạt động",
    total_inactive_industries: "Ngành ngừng hoạt động",
  },

  staffStatsKeys: {
    total_staffs: "Tổng số nhân viên",
    total_is_not_ban_staffs: "Nhân viên không bị cấm",
    total_ban_staffs: "Nhân viên bị cấm",
  },

  bidBondStatsKeys: {
    total_bid_bonds: "Tổng số bảo lãnh thầu",
    total_not_expired_bid_bonds: "Bảo lãnh thầu chưa hết hạn",
    total_expired_bid_bonds: "Bảo lãnh thầu đã hết hạn",
  },

  biddingResultKeys: {
    total_bidding_result: "Tổng số kết quả thầu",
  },

  evaluateKeys: {
    total_evaluates: "Tổng số đánh giá",
  },

  evaluationCriteriaKeys: {
    total_evaluation_criterias: "Tổng số tiêu chí đánh giá",
    total_active_evaluation_criterias: "Tiêu chí đánh giá hoạt động",
    total_inactive_evaluation_criterias: "Tiêu chí đánh giá ngừng hoạt động",
  },

  fundingSourceKeys: {
    total_funding_source: "Tổng số nguồn vốn",
    total_active_funding_source: "Nguồn vốn hoạt động",
    total_inactive_funding_source: "Nguồn vốn ngừng hoạt động",
  },

  postKeys: {
    total_post: "Tổng số bài viết",
    total_public_post: "Bài viết công khai",
    total_hidden_post: "Bài viết ẩn",
    total_draft_post: "Bài viết nháp",
  },

  procurementCategoryKeys: {
    total_procurement_category: "Tổng số danh mục thầu",
    total_active_procurement_category: "Danh mục thầu hoạt động",
    total_inactive_procurement_category: "Danh mục thầu ngừng hoạt động",
  },

  supportKeys: {
    total_support: "Tổng số hỗ trợ",
    total_sent_support: "Hỗ trợ đã gửi",
    total_processing_support: "Hỗ trợ đang xử lý",
    total_responded_support: "Hỗ trợ đã phản hồi",
  },

  taskKeys: {
    total_task: "Tổng số nhiệm vụ",
    total_easy_task: "Nhiệm vụ dễ",
    total_medium_task: "Nhiệm vụ trung bình",
    total_hard_task: "Nhiệm vụ khó",
    total_veryhard_task: "Nhiệm vụ rất khó",
  },
};

interface StatItem {
  label: string;
  value: number;
}

interface GroupedStats {
  name: string;
  stats: StatItem[];
}

interface StatisticalCardProps {
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
}

const StatisticalCard: React.FC<StatisticalCardProps> = ({ data }) => {
  // Function to transform raw data into grouped statistics
  const transformData = (item: { [key: string]: string | number }): GroupedStats => {
    const { name, ...stats } = item;
    const statItems: StatItem[] = Object.entries(stats).map(([key, value]) => {
      // Find the mapping object that contains this key
      const mappingObject = Object.values(keyMappings).find((mapping) => Object.keys(mapping).includes(key));

      return {
        label: mappingObject?.[key as keyof typeof mappingObject] || key,
        value: value as number,
      };
    });

    return {
      name: name as string,
      stats: statItems,
    };
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item, index) => {
        const groupedStats = transformData(item);

        return (
          <Card
            key={index}
            title={groupedStats.name}
            bordered={false}
            className="statistical-card" // Custom class for targeting antd elements
            headStyle={{
              backgroundColor: "#eaf8ff",
              color: "#2086bf",
            }}
          >
            <div className="space-y-2">
              {groupedStats.stats.map((stat, statIndex) => (
                <div key={statIndex} className="flex items-center justify-between py-1">
                  <span className="text-gray-600">{stat.label}:</span>
                  <span className="font-semibold">{stat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticalCard;
