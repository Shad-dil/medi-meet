import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingDoctor = () => {
  return (
    <div>
      <div className="" id="header">
        {[1, 2, 3, 4, 5, 6].map((ske) => (
          <Card
            className={
              " border border-emerald-900/20 hover:border-emerald-700/40 transition-all cursor-pointer h-full"
            }
            key={ske}
          >
            <CardContent
              className={
                "flex p-6 flex-col items-center justify-center text-center h-full"
              }
            >
              <div className="w-12 h-12 rounded-full bg-emerald-900/20  flex items-center justify-center mb-4">
                <Skeleton className="h-[20px] w-[20px] rounded-full" />
              </div>
              <Skeleton className="h-[20px] w-[100px] rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LoadingDoctor;
