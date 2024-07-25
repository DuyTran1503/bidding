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
interface IActiveRole extends Omit<IRole, "permissions"> {
  permissions: string[];
}

interface IRoleFormProps {
  formikRef?: FormikRefType<IRoleFormInitialValues>;
  type: "create" | "view" | "update";
  role?: IActiveRole;
}

export interface IRoleFormInitialValues {
  name: string;
  permissions: string[];
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
    name: string().required("Please enter role name"),
  });

  useEffect(() => {
    setTreePermissions(convertPermissionsToTree(state.permissions));
  }, [JSON.stringify(state.permissions)]);

  useEffect(() => {
    dispatch(getAllPermissions());
    setLoading(false);
  }, []);

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

  function getIdsForKeys(keys: string[], mappingKeyWithId: { key: string; id: number }[]): number[] {
    const idsForKeys: number[] = [];

    for (const key of keys) {
      const matchingPair = mappingKeyWithId.find((pair) => pair.key === key);
      if (matchingPair) {
        idsForKeys.push(matchingPair.id);
      }
    }

    return idsForKeys;
  }

  function getAllKeysAndIds(permissionNodes: TreeNode[]): { key: string; id: number }[] {
    let result: { key: string; id: number }[] = [];
    const seenIds = new Set<number>();

    for (const node of permissionNodes) {
      if (!seenIds.has(node.id!)) {
        seenIds.add(node.id!);
        result.push({ key: node.key, id: node.id! });
      }

      if (node.children && node.children.length > 0) {
        const childrenResult = getAllKeysAndIds(node.children);
        for (const { key, id } of childrenResult) {
          if (!seenIds.has(id)) {
            seenIds.add(id);
            result.push({ key, id });
          }
        }
      }
    }

    return result;
  }

  const mappingKeyWithId = getAllKeysAndIds(convertPermissionsToTree(state.permissions));
  console.log(mappingKeyWithId);
  return (
    <Formik
      innerRef={formikRef}
      initialValues={role ?? initialValues}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        const body = {
          ...lodash.omit(data, "id"),
          permissions: getIdsForKeys(
            data.permissions.filter((p) => !p.startsWith("parent-")),
            mappingKeyWithId,
          ),
        };
        if (type === "create") {
          dispatch(createRole({ body }));
          console.log(body);
        } else if (type === "update") {
          dispatch(updateRole({ body, param: role?.id }));
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
                    checkedKeys={values.permissions}
                    onCheck={(checkedKeys) => {
                      console.log(checkedKeys);

                      setFieldValue("permissions", checkedKeys);
                    }}
                  />
                </FormGroup>
              ),
              colRight: (
                <FormGroup title="General Information">
                  <FormInput
                    type="text"
                    isDisabled={type === "view"}
                    label="Role name"
                    value={values.name}
                    name="name"
                    error={touched.name ? errors.name : ""}
                    placeholder="Type role name here..."
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
