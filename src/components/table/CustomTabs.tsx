import React from "react";
import { Tabs } from "antd";

interface CustomTabsProps {
    items: {
        key: string;
        label: string;
        content: React.ReactNode;
    }[];
    onChange?: (key: string) => void;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ items, onChange  }) => (
    <Tabs onChange={onChange}>
        {items.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.key}>
                {item.content}
            </Tabs.TabPane>
        ))}
    </Tabs>
);

export default CustomTabs;
