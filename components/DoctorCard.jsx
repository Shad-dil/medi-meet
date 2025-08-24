import React from "react";
import { Card, CardContent } from "./ui/card";
import { Calendar, Star, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

const DoctorCard = ({ doctor }) => {
  return (
    <Card
      className={
        "border-emerald-900/20 hover:border-emerald-700/40 transition-all"
      }
    >
      <CardContent>
        <div className="flex flex-col ">
          <div className="flex justify-start gap-4">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="h-12 w-12  rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-emerald-400" />
            )}

            <div className="flex-1 ">
              <h3 className="font-bold">{doctor.name}</h3>
              <p className="text-muted-foreground">{doctor.specialty}</p>
              <span className="text-muted-foreground text-sm">
                {doctor.description}
              </span>
              <Button
                asChild
                className={"w-full bg-emerald-500 mt-2 hover:bg-emerald-600"}
              >
                <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                  <Calendar className="h-4 w-4 mr-2" /> View Profile & Book
                </Link>
              </Button>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-900/20  flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-emerald-400 " />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
