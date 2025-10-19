"use client";
import { generateVideoToken } from "@/actions/appointment";
import {
  addAppointmentNote,
  cancelAppointment,
  markAppointmentComplete,
} from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { Calendar, Clock, Stethoscope, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns/format";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const AppointmentCard = ({ appointment, userRole }) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState(appointment.notes || "");

  const {
    loading: cancelLoading,
    data: cancelData,
    fn: submitCancel,
  } = useFetch(cancelAppointment);
  const {
    loading: notesLoading,
    data: noteslData,
    fn: submitNotes,
  } = useFetch(addAppointmentNote);
  const {
    loading: tokenLoading,
    data: tokenData,
    fn: submitTokenRequest,
  } = useFetch(generateVideoToken);
  const {
    loading: completeLoading,
    data: completeData,
    fn: submitComplete,
  } = useFetch(markAppointmentComplete);

  const otherParty =
    userRole === "DOCTOR" ? appointment.patient : appointment.doctor;
  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
  const otherPartyIcons = userRole === "DOCTOR" ? <User /> : <Stethoscope />;

  const formatDateTime = (dateTime) => {
    try {
      return format(new Date(dateTime), "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return "invalid date";
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      return "invalid date";
    }
  };

  const canMarkComplete = () => {
    if (userRole !== "DOCTOR" && appointment.status !== "SCHEDULED") {
      return false;
    }
    const now = new Date();
    const appotmentEndTime = new Date(appointment.endTime);
    return now >= appotmentEndTime;
  };

  const handleMarkComplete = async () => {
    if (completeLoading) return;
    if (
      window.confirm(
        "Are you sure you want to mark this as completed? this action can not be undone"
      )
    ) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitComplete(formData);
    }
  };

  useEffect(() => {
    if (completeData?.success) {
      toast.success("Appointment Marked as Completed");
      setOpen(false);
    }
  }, [completeData, cancelData, noteslData, tokenData]);

  return (
    <Card
      className={
        "border-emerald-900/20 hover:border-emerald-700/30 transition-all"
      }
    >
      <CardContent className={"p-4"}>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-muted/20 rounded-full p-2 mt-1">
              {otherPartyIcons}
            </div>
            <div>
              <h3>
                {userRole === "DOCTOR"
                  ? otherParty.name
                  : `Dr. ${otherParty.name}`}
              </h3>

              {userRole === "DOCTOR" && (
                <p className="text-sm text-muted-foreground">
                  {otherParty.email}
                </p>
              )}

              {userRole === "PATIENT" && (
                <p className="text-sm text-muted-foreground">
                  {otherParty.specialty}
                </p>
              )}

              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDateTime(appointment.startTime)}</span>
              </div>

              <div className="flex items-center  mt-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {formatTime(appointment.startTime)}-{" "}
                  {formatTime(appointment.endTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col self-end md:self-start gap-2">
            <Badge
              variant={"outline"}
              className={
                appointment.status === "COMPLETED"
                  ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400 font-bold"
                  : appointment.status === "CANCELED"
                  ? "bg-red-900/20 border-red-900/30 text-red-400 font-bold"
                  : "bg-amber-900/20 border-amber-900/30 text-amber-400 font-bold"
              }
            >
              {appointment.status}
            </Badge>
            <div>
              {canMarkComplete() && (
                <Button
                  size={"sm"}
                  className={"bg-emerald-600 hover:bg-emerald-700"}
                  onClick={handleMarkComplete}
                  disabled={completeLoading}
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
