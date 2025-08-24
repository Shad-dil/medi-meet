import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const PageHeader = ({
  icon,
  title,
  backLink = "/",
  backLabel = "Back to Home",
}) => {
  return (
    <div className="flex flex-col justify-between  mb-8 mt-10">
      <Link href={backLink} className="mb-4">
        <Button
          variant={"outline"}
          size={"sm"}
          className="flex items-center border-emerald-900/30 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backLabel}
        </Button>
      </Link>

      <div className="flex items-end gap-2">
        {icon && (
          <div className="text-emerald-400">
            {React.cloneElement(icon, {
              className: "h-12 w-12 md:h-14 md:w-14",
            })}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl gradient-title">{title}</h1>
      </div>
    </div>
  );
};

export default PageHeader;
