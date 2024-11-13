import React from "react";
import { Tabs } from "antd";

interface CustomTabsProps {
  items: {
    key: string;
    label: string;
    content: React.ReactNode;
  }[];
  selectedKey?: string; // Make this prop required
  onChange?: (key: string) => void; // Function to handle tab changes
}

const CustomTabs: React.FC<CustomTabsProps> = ({ items, selectedKey, onChange }) => (
  <Tabs activeKey={selectedKey} onChange={onChange}>
    {items.map((item) => (
      <Tabs.TabPane tab={item.label} key={item.key}>
        {item.content}
      </Tabs.TabPane>
    ))}
  </Tabs>
);

export default CustomTabs;
