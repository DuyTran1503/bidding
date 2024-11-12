import { useArchive } from "@/hooks/useArchive";
import FormGroup from "@/components/form/FormGroup";
import FormInput from "@/components/form/FormInput";
import UpdateGrid from "@/components/grid/UpdateGrid";
import { Formik } from "formik";
import TreeData from "@/components/TreeData";
import { object, string } from "yup";
import { DataNode } from "antd/es/tree";
import { useEffect, useState } from "react";
import { createRole, getAllPermissions, updateRole } from "@/services/store/role/role.thunk";
import { FormikRefType } from "@/shared/utils/shared-types";
import { IRole } from "@/services/store/role/role.model";
import lodash from "lodash";
import { IRoleInitialState } from "@/services/store/role/role.slice";
import { EPageTypes } from "@/shared/enums/page";
interface Permission {
  created_at: string;
  guard_name: string;
  id: number | null;
  name: string;
  section: string;
  updated_at: string;
}

interface TreeNode {
  title: string;
  key: string;
  id: number | null;
  children?: TreeNode[];
}
export interface IActiveRole extends Omit<IRole, "permissions"> {
  id: string;
  name: string;
  permissions: string[];
}

interface IRoleFormProps {
  formikRef?: FormikRefType<IRoleFormInitialValues>;
  type: EPageTypes;
  role?: IActiveRole;
}

export interface IRoleFormInitialValues {
  name: string;
  permissions: string[];
}
interface MappingItem {
  key: string;
  id: number;
}
const RoleForm = ({ formikRef, type, role }: IRoleFormProps) => {
  const [treePermissions, setTreePermissions] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState(true);

  const { dispatch, state } = useArchive<IRoleInitialState>("role");
  const initialValues: IRoleFormInitialValues = {
    name: "",
    permissions: [],
  };

  const validationSchema = object().shape({
    name: string().required("Vui lòng không để trống trường này"),
  });

  useEffect(() => {
    setTreePermissions(convertPermissionsToTree(state.permissions));
  }, [JSON.stringify(state.permissions)]);

  useEffect(() => {
    dispatch(getAllPermissions());
    setLoading(false);
  }, [dispatch]);

  function convertPermissionsToTree(permissions: any[]): TreeNode[] {
    // Gom nhóm permissions theo section
    const sectionMap = permissions.reduce((acc: { [key: string]: Permission[] }, permission) => {
      if (!acc[permission.section]) {
        acc[permission.section] = [];
      }
      acc[permission.section].push(permission);
      return acc;
    }, {});

    // Chuyển đổi thành cấu trúc cây
    return Object.entries(sectionMap).map(([section, items], index): TreeNode => {
      // Tìm id của section (nếu có)
      const sectionId = items.find((item) => item.section === section)?.id || null;

      return {
        title: section,
        key: `0-${index}`,
        id: sectionId,
        children: items.map(
          (item, subIndex): TreeNode => ({
            title: item.name,
            key: `0-${index}-${subIndex}`,
            id: item.id,
          }),
        ),
      };
    });
  }

  const getIdsForKeys = (keys: string[], mappingKeyWithId: { key: string; id: number }[]): number[] => {
    const idsForKeys: number[] = [];

    for (const key of keys) {
      const matchingPair = mappingKeyWithId.find((pair) => pair.key === key);
      if (matchingPair) {
        idsForKeys.push(matchingPair.id);
      }
    }

    return idsForKeys;
  };

  const getAllKeysAndIds = (permissionNodes: TreeNode[]): { key: string; id: number }[] => {
    const result: { key: string; id: number }[] = [];

    for (const node of permissionNodes) {
      // Luôn thêm node vào kết quả
      result.push({ key: node.key, id: node.id! });

      if (node.children && node.children.length > 0) {
        const childrenResult = getAllKeysAndIds(node.children);
        result.push(...childrenResult); // Thêm tất cả kết quả của children vào result
      }
    }
    return result;
  };
  const mappingKeyWithId = getAllKeysAndIds(convertPermissionsToTree(state.permissions));

  const updateDataChecked = (() => {
    const lastItemById: Record<number, string> = {};

    // Lưu phần tử cuối cùng cho mỗi ID
    mappingKeyWithId.forEach((item: MappingItem) => {
      lastItemById[item.id] = item.key; // Lưu key của phần tử cuối cùng
    });

    // Lọc các ID có trong quyền
    const allowedIds = new Set(role?.permissions.map((ele) => +ele));

    // Lấy key của các phần tử cuối cùng có ID trong quyền
    return Object.entries(lastItemById)
      .filter(([id]) => allowedIds.has(Number(id))) // Kiểm tra xem ID có trong quyền không
      .map(([, key]) => key); // Lấy key
  })();

  return (
    <Formik
      enableReinitialize
      innerRef={formikRef as any}
      initialValues={type === EPageTypes.UPDATE ? { ...role, name: role?.name, permissions: updateDataChecked } : initialValues}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        const body = {
          ...lodash.omit(data, "id"),
          permissions: data.permissions
            ? getIdsForKeys(
                data.permissions.filter((p: string) => !p.startsWith("parent-")),
                mappingKeyWithId,
              )
            : [],
        };
        const newBody = {
          ...lodash.omit(data, "id"),
          permissions: [...new Set(body.permissions)],
        };
        if (type === EPageTypes.CREATE) {
          dispatch(createRole({ body: newBody }));
        } else if (type === EPageTypes.UPDATE) {
          const updateData = { ...newBody, id: role?.id };
          dispatch(updateRole({ body: updateData, id: role?.id }));
        }
      }}
    >
      {({ values, errors, touched, handleBlur, setFieldValue }) => {
        return (
          <UpdateGrid
            colNumber="2"
            rate="1-3"
            isLoading={loading}
            groups={{
              colLeft: (
                <FormGroup title="Vai trò">
                  <TreeData
                    isDisable={type === "view"}
                    expanded={["parent-all"]}
                    treeData={[
                      {
                        key: "parent-all",
                        title: "Chọn tất cả",
                        children: treePermissions,
                      },
                    ]}
                    // @ts-ignore
                    checkedKeys={values.permissions}
                    onCheck={(checkedKeys) => {
                      setFieldValue("permissions", checkedKeys);
                    }}
                  />
                </FormGroup>
              ),
              colRight: (
                <FormGroup title="Thông tin ">
                  <FormInput
                    type="text"
                    isDisabled={type === EPageTypes.VIEW}
                    label="Tên vai trò"
                    value={values.name}
                    name="name"
                    error={touched.name ? errors.name : ""}
                    placeholder="Nhập tên vai trò..."
                    onChange={(value) => {
                      setFieldValue("name", value);
                    }}
                    onBlur={handleBlur}
                  />
                </FormGroup>
              ),
            }}
          />
        );
      }}
    </Formik>
  );
};

export default RoleForm;
