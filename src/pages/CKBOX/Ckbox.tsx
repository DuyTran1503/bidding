/* eslint-disable max-len */
import { CKBox } from "@ckbox/core";
import "@ckbox/components/dist/styles/ckbox.css";
import "ckbox";
import Heading from "@/components/layout/Heading";

const Ckbox = () => {
  return (
    <>
      <Heading
        title="Quản Lý File"
        hasBreadcrumb
        // buttons={[
        //     {
        //         icon: <FaPlus className="text-[18px]" />,
        //         // permission: EPermissions.CREATE_FUNDING_SOURCE,
        //         text: "Thêm Nguồn Tài Trợ",
        //         // onClick: () => navigate("/funding_sources/create"),
        //     },
        // ]}
      />

      {/* <ManagementGrid columns={columns} data={data} setFilter={setFilter} search={{ status: [] }} buttons={buttons} /> */}
      <CKBox
        categories={{
          icons: {
            Files: ({ className }) => (
              <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20">
                <path d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            ),
          },
        }}
        tokenUrl="https://115377.cke-cs.com/token/dev/YIdfCf3CxrBW4iucemy2LH8qLeW1NN8n7ggX?limit=10"
      />
    </>
  );
};
export default Ckbox;
