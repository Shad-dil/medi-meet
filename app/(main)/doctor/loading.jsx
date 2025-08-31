import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingDoctor = () => {
  return (
    <div>
      <div className="" id="header">
        <Card
          className={
            " border border-emerald-900/20 hover:border-emerald-700/40 transition-all cursor-pointer h-full"
          }
        >
          <CardContent
            className={
              "flex p-6 flex-col items-center justify-center text-center h-full"
            }
          >
            <Skeleton className="h-[20px] w-[100px] rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingDoctor;
