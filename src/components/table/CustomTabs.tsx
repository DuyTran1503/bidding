import React from "react";
import { Tabs } from "antd";

interface CustomTabsProps {
    items: {
        key: string;
        label: string;
        content: React.ReactNode;
    }[];
}

const CustomTabs: React.FC<CustomTabsProps> = ({ items }) => (
    <Tabs>
        {items.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.key}>
                {item.content}
            </Tabs.TabPane>
        ))}
    </Tabs>
);

export default CustomTabs;
