import { ConfigProvider, Input, Tree, TreeProps } from "antd";
import { DataNode } from "antd/es/tree";
import { useMemo, useState } from "react";

const { Search } = Input;

export interface ITreeDataProps {
  treeData: DataNode[];
  expanded?: React.Key[];
  isDisable?: boolean;
  checkedKeys: React.Key[];
  onCheck: TreeProps["onCheck"];
}

const TreeData = ({ treeData, expanded = [], isDisable, checkedKeys, onCheck }: ITreeDataProps) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(expanded);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // Tìm parentKey của một nút
  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key | undefined => {
    for (const node of tree) {
      if (node.children) {
        if (node.children.some((child) => child.key === key)) {
          return node.key;
        }
        const parentKey = getParentKey(key, node.children);
        if (parentKey) {
          return parentKey;
        }
      }
    }
    return undefined;
  };

  // Lấy danh sách các key cần mở rộng dựa trên giá trị tìm kiếm
  const findKeys = (value: string, data: DataNode[]): React.Key[] => {
    const keys: React.Key[] = [];
    data.forEach((node) => {
      if ((node.title as string).toLowerCase().includes(value.toLowerCase())) {
        keys.push(node.key);
      }
      if (node.children) {
        keys.push(...findKeys(value, node.children));
      }
    });
    return keys;
  };

  // Xử lý khi nhập vào ô tìm kiếm
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);

    const newExpandedKeys = treeData
      .flatMap((node) => findKeys(value, [node]))
      .map((key) => getParentKey(key, treeData))
      .filter((key, index, self) => key && self.indexOf(key) === index);

    setExpandedKeys(newExpandedKeys as any);
    setAutoExpandParent(true);
  };

  // Lọc và làm nổi bật kết quả tìm kiếm
  const filteredTreeData = useMemo(() => {
    const highlight = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const titleStr = item.title as string;
        const index = titleStr.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = titleStr.substring(0, index);
        const afterStr = titleStr.slice(index + searchValue.length);

        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: "#f50" }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            item.title
          );

        if (item.children) {
          return { ...item, title, children: highlight(item.children) };
        }
        return { ...item, title };
      });

    return highlight(treeData);
  }, [searchValue, treeData]);

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  return (
    <ConfigProvider>
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
        <Tree
          checkable
          disabled={isDisable}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={filteredTreeData}
        />
      </div>
    </ConfigProvider>
  );
};

export default TreeData;
