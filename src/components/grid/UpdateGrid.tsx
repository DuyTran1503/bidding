import { ReactNode, useMemo } from "react";

export interface IUpdateGridProps {
  colNumber?: "1" | "2";
  rate?: "3-1" | "2-2" | "1-3" | "1";
  groups: {
    colLeft?: ReactNode;
    colRight?: ReactNode;
    colFull?: ReactNode; // Add a full-width column
  };
  isLoading?: boolean;
}

const UpdateGrid = ({ colNumber = "1", rate = "1", groups, isLoading }: IUpdateGridProps) => {
  const [colLeftWidth, colRightWidth] = useMemo(() => {
    const widthRate = rate.split("-");
    if (widthRate.length > 1) {
      return rate.split("-").map((num) => `${(+num / 4) * 100}%`);
    }
    return ["100%", ""];
  }, [rate]);

  if (isLoading) {
    return (
      <div className="flex h-full gap-6">
        {groups.colFull ? (
          <div className="flex animate-pulse flex-col gap-6 rounded-lg bg-gray-50" style={{ width: "100%" }}></div>
        ) : (
          <>
            <div className="flex animate-pulse flex-col gap-6 rounded-lg bg-gray-50" style={{ width: colLeftWidth }}></div>
            {colNumber === "2" && (
              <div className="flex animate-pulse flex-col gap-6 rounded-lg bg-gray-50" style={{ width: colRightWidth }}></div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {groups.colFull ? (
        <div className="flex flex-col gap-6" style={{ width: "100%" }}>
          {groups.colFull}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6" style={{ width: colLeftWidth }}>
            {groups.colLeft}
          </div>
          {colNumber === "2" && (
            <div className="flex flex-col gap-6" style={{ width: colRightWidth }}>
              {groups.colRight}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateGrid;
