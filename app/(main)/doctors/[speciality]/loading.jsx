import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingSpecialty = () => {
  return (
    <div>
      <div className="" id="header">
        <Card>
          <Skeleton className="h-[100px] w-[100px] rounded-full" />
        </Card>
      </div>
    </div>
  );
};

export default LoadingSpecialty;
