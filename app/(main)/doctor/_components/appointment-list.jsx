import AppointmentCard from "@/components/AppointmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import React from "react";

const DoctorAppointmentList = ({ appointments }) => {
  return (
    <Card className={"border border-emerald-900/20"}>
      <CardHeader>
        <CardTitle className={"text-xl font-bold text-white flex items-center"}>
          <Calendar className="h-5 w-5 mr-2 text-emerald-400" /> Upcoming
          Appointments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              return (
                <AppointmentCard
                  appointment={appointment}
                  key={appointment.id}
                  userRole="DOCTOR"
                />
              );
            })}
          </div>
        ) : (
          <div>
            <h3 className="text-muted-foreground">No upcoming appointments.</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorAppointmentList;
