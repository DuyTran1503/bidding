// import React, { useEffect, useState } from "react";
// import { useArchive } from "@/hooks/useArchive";
// import GenericChart from "@/components/chart/GenericChart";
// import CustomTabs from "@/components/table/CustomTabs";
// import Heading from "@/components/layout/Heading";
// import { IoClose } from "react-icons/io5";
// import { useNavigate, useParams } from "react-router-dom";
// import Button from "@/components/common/Button";
// import { IEnterpriseInitialState } from "@/services/store/enterprise/enterprise.slice";
// import { getEnterpriseById, getListEnterprise } from "@/services/store/enterprise/enterprise.thunk";
// import { IChartEnterpriseInitialState } from "@/services/store/enterprise_chart/enterprise_chart.slice";
// import FormSelect from "@/components/form/FormSelect";
// import { convertDataOptions } from "@/pages/Project/helper";
// import { Form, Formik } from "formik";
// import FormGroup from "@/components/form/FormGroup";
// import { Col, Row } from "antd";
// import { getSalaryOfEmployees } from "@/services/store/enterprise_chart/enterprise_chart.thunk";

// interface IProp {
//   ids: string[] | number[];
// }

// const StatisticalEnterprise: React.FC = () => {
//   const { id } = useParams();

//   const { state: stateEnterprise, dispatch: dispatchEnterprise } = useArchive<IEnterpriseInitialState>("enterprise");
//   const { state: stateChartEnterprise, dispatch: dispatchChartEnterprise } = useArchive<IChartEnterpriseInitialState>("chart_enterprise");
//   const [treeData, setTreeData] = useState<{ title: string; value: string; key: string; children?: any[] }[]>([]);
//   const [selectedProjectIds, setSelectedProjectIds] = useState<number[] | string[]>([]);
//   const [ids, setIds] = useState<number[]>([]);
//   const [compareData, setCompareData] = useState<any[]>([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatchEnterprise(getListEnterprise());
//   }, [dispatchEnterprise]);

//   useEffect(() => {
//     !!id && dispatchEnterprise(getEnterpriseById(id));
//   }, [id]);

//   const handleAddToCompare = (data: any) => {
//     if (ids.length && !!id) {
//       const updatedProjectIds = [...new Set([...ids])]; // Kết hợp và loại bỏ trùng lặp
//       updatedProjectIds.push(Number(id)); // Thêm investorId vào mảng
//       if (updatedProjectIds.length > 1) {
//         dispatchChartEnterprise(getSalaryOfEmployees({ body: updatedProjectIds }));
//       }
//     }
//   };
//   console.log(selectedProjectIds);

//   const nameMapping: Record<string, string> = {
//     after_university: "Sau đại học",
//     university: "Đại học",
//     college: "Cao đẳng",
//     high_school: "Trung học phổ thông",
//     secondary_school: "Trung học cơ sở",
//     primary_school: "Tiểu học",
//   };
//   const formatTreeData = (data: any[]): { title: string; value: string; key: string; children?: any[] }[] => {
//     return data.map((item) => ({
//       title: item.name,
//       value: item.id.toString(),
//       key: item.id.toString(),
//       children: item.children ? formatTreeData(item.children) : [],
//     }));
//   };
//   useEffect(() => {
//     dispatchChartEnterprise(getSalaryOfEmployees({ body: [id] }));
//   }, []);
//   const tabItems = [
//     {
//       key: "1",
//       label: "Thống kê dự án",
//       content: (
//         <GenericChart
//           chartType="bar"
//           title="Thống kê ngành"
//           name={stateChartEnterprise.salaryOfEmployees.map(({ enterprise }) => enterprise)}
//           value={stateChartEnterprise.salaryOfEmployees.map((item) => item.salaryAvg)}
//           seriesName="Dữ liệu Ngành"
//         />
//       ),
//     },
//   ];
//   const initialValues: IProp = {
//     ids: ids || [],
//   };

//   return (
//     <>
//       <Heading
//         title={"Thống kê chi tiết " + (stateEnterprise.enterprise?.name || "")}
//         hasBreadcrumb
//         buttons={[
//           {
//             type: "secondary",
//             text: "Hủy",
//             icon: <IoClose className="text-[18px]" />,
//             onClick: () => {
//               navigate("/enterprise");
//             },
//           },
//         ]}
//       />
//       <Formik
//         initialValues={initialValues}
//         enableReinitialize
//         onSubmit={(data) => {
//           handleAddToCompare(data);
//         }}
//       >
//         {({ values, setFieldValue }) => {
//           return (
//             <Form>
//               <Row className="items-center bg-white">
//                 <Col xs={24} sm={24} md={12} xl={12} className="mb-4">
//                   <FormGroup title="Doanh nghiệp" className="bg-[#f9f9fc]">
//                     <FormSelect
//                       placeholder="Chọn doanh nghiệp..."
//                       options={convertDataOptions(stateEnterprise.listEnterprise || []).map((option) => ({
//                         ...option,
//                         disabled: values.ids.includes(id as never), // Disable if the ID is in values.ids
//                       }))}
//                       value={values.ids}
//                       isMultiple
//                       onChange={(e) => {
//                         setFieldValue("ids", e);
//                         setIds(e as any);
//                       }}
//                     ></FormSelect>
//                   </FormGroup>
//                 </Col>
//                 <Col xs={24} sm={24} md={12} xl={12} className="translate-y-[14px] transform">
//                   <Button type="primary" text="So sánh" kind="submit" isDisabled={ids.length === 0} />
//                 </Col>
//               </Row>
//             </Form>
//           );
//         }}
//       </Formik>
//       <CustomTabs items={tabItems} />
//     </>
//   );
// };

// export default StatisticalEnterprise;
