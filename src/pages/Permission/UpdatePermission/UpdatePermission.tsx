import Heading from "@/components/layout/Heading"
import PermissionForm from "../PermissionForm"

const UpdatePermission = () => {

  return <>
    <Heading title="Update Permission" hasBreadcrumb buttons={[]} />
    <PermissionForm type="update"/>
  </>
}

export default UpdatePermission