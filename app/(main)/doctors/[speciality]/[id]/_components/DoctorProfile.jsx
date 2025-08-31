"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Medal, User } from "lucide-react";
import Image from "next/image";
import React from "react";

const DoctorProfile = ({ doctor, slots }) => {
  const totalSlots = slots.reduce((total, day) => total + day.slots.length, 0);
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
      <div className="md:grid-cols-1">
        <div className="md:sticky md:top-24">
          {" "}
          <Card className={"border-emerald-900/20"}>
            <CardContent className={"pt-6"}>
              <div className="flex flex-col items-center text-center ">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-emerald-900/20 relative">
                  {doctor?.imageUrl ? (
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-emerald-600" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-1 text-white">
                  Dr. {doctor.name}
                </h2>
                <Badge
                  variant={"outline"}
                  className={
                    "bg-emerald-900/20  border-emerald-900/20 mb-4 text-emerald-400"
                  }
                >
                  {doctor.specialty}
                </Badge>
                <div className="flex items-center justify-center mb-2">
                  <Medal className="h-4 w-4 text-emerald-400 mr-2" />
                  <span className="text-muted-foreground">
                    {doctor.experience} Year's of experience
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="md:grid-cols-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className={"text-xl font-bold text-white"}>
              About Dr. {doctor.name}
            </CardTitle>
            <CardDescription>{doctor.specialty}</CardDescription>
          </CardHeader>
          <CardContent>
            {totalSlots > 0 ? <>sss</> : <div>ddd</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
