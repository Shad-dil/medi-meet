"use client";
import { generateVideoToken } from "@/actions/appointment";
import {
  addAppointmentNote,
  cancelAppointment,
  markAppointmentComplete,
} from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Loader2,
  Stethoscope,
  User,
  Video,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns/format";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";

const AppointmentCard = ({ appointment, userRole }) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState(appointment.notes || "");
  const router = useRouter();

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
  }, [completeData]);

  const isAppointmentActive = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);
    return (
      (appointmentTime.getTime() - now.getTime() <= 30 * 60 * 1000 &&
        now > appointmentTime) ||
      (now >= appointmentTime && now <= appointmentEndTime)
    );
  };

  const handleJoinVideoCall = async () => {
    if (tokenLoading) return;
    setAction("video");
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    await submitTokenRequest(formData);
  };

  useEffect(() => {
    if (tokenData?.success) {
      router.push(
        `/video-call/sessionId=${tokenData.videoSessionId}&token=${tokenData.token}&appointmentId=${appointment.id}`
      );
    }
  }, [tokenData, appointment.id]);

  const handleSaveNotes = async () => {
    if (notesLoading) return;
    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("notes", notes);
    await submitNotes(formData);
    setAction(null);
  };

  useEffect(() => {
    if (noteslData?.success) {
      toast.success("Notes saved successfully");
    }
  }, [noteslData, appointment.id]);

  const handleCancelAppointment = async () => {
    if (cancelLoading) return;
    if (
      window.confirm(
        "Are you sure you want to cancel this appointment? this action can not be undone"
      )
    ) {
      const formData = new FormData();
      formData.append("appointmentId", appointment.id);
      await submitCancel(formData);
    }
  };

  useEffect(() => {
    if (cancelData?.success) {
      toast.success("Appointment Canceled successfully");
      setOpen(false);
    }
  }, [completeData]);

  return (
    <>
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
              <div className="flex items-center gap-2">
                {canMarkComplete() && (
                  <Button
                    size={"sm"}
                    className={"bg-emerald-600 hover:bg-emerald-700"}
                    onClick={handleMarkComplete}
                    disabled={completeLoading}
                  >
                    {completeLoading ? (
                      <Loader2 className=" h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" /> Complete
                      </>
                    )}
                  </Button>
                )}

                <Button
                  className={"border-emerald-900/20"}
                  size={"sm"}
                  variant={"outline"}
                  onClick={() => setOpen(true)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl font-bold text-white"}>
              Appointment Details
            </DialogTitle>
            <DialogDescription>
              {appointment.status === "SCHEDULED"
                ? "Manage your upcoming appointment"
                : "View Appointment information"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {otherPartyLabel}
              </h4>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 text-emerald-400 mr-2">
                {otherPartyIcons}
              </div>
              <div>
                <p className="text-white font-medium">
                  {userRole === "DOCTOR"
                    ? otherParty.name
                    : `Dr. ${otherParty.name}`}
                </p>
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
              </div>
            </div>
            {/* Appointment Time  */}

            <div className="space-y-2 ">
              <h4 className="text-sm font-medium text-muted-foreground">
                Scheduled Time
              </h4>
              <div className="flex flex-col gap-1">
                <div className=" flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
                  <p className="text-white">
                    {formatDateTime(appointment.startTime)}
                  </p>
                </div>
                <div className=" flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-emerald-400" />
                  <p className="text-white">
                    {formatTime(appointment.startTime)}-{" "}
                    {formatTime(appointment.endTime)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 flex justify-between mt-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Status
              </h4>
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
            </div>

            {appointment.patientDescription && (
              <div className="space-y-2 ">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {userRole === "DOCTOR"
                    ? "Patient Description"
                    : "Your Description"}
                </h4>
                <div className="p-3 rounded-md bg-muted/20 border border-emerald-900/20">
                  <p className="text-white whitespace-pre-line">
                    {appointment.patientDescription}
                  </p>
                </div>
              </div>
            )}

            {appointment.status === "SCHEDULED" && (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Video Consultation
                  </h4>
                  <Button
                    className={"w-full bg-emerald-600 hover:bg-emerald-700"}
                    disabled={
                      !isAppointmentActive() ||
                      action === "video" ||
                      tokenLoading
                    }
                    onClick={handleJoinVideoCall}
                  >
                    {tokenLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Preparing Video Call...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        {isAppointmentActive()
                          ? "Join Video Call"
                          : "Join Video Call (Available 30 mins before appointment)"}
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Doctor Notes
                </h4>
                {userRole === "DOCTOR" &&
                  action !== "notes" &&
                  appointment.status !== "CANCELLED" && (
                    <Button
                      variant={"ghost"}
                      size={"sm"}
                      onClick={() => setAction("notes")}
                      className={
                        "h-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                      }
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      {appointment.notes ? "Edit" : "Add"}
                    </Button>
                  )}
              </div>
              {userRole === "DOCTOR" && action === "notes" ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add clinical notes here..."
                    className={
                      "bg-background bordder border-emerald-900/30 min-h-[80px]"
                    }
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant={"outline"}
                      size="sm"
                      onClick={() => {
                        setAction(null);
                        setNotes(appointment.notes || "");
                      }}
                      disabled={notesLoading}
                      className={"border-emerald-900/30"}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      disabled={notesLoading}
                      className={"bg-emerald-600 hover:bg-emerald-700"}
                      onClick={handleSaveNotes}
                    >
                      {notesLoading ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        </>
                      ) : (
                        "Save Notes"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-md bg-muted/20 bordder border-emerald-900/30 min-h-[80px]">
                  {appointment.notes ? (
                    <p className="text-white whitespace-pre-line">
                      {" "}
                      {appointment.notes}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">
                      No Notes Added Yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter
            className={
              "flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2"
            }
          >
            {appointment.status === "SCHEDULED" && (
              <>
                <Button
                  variant={"outline"}
                  onClick={handleCancelAppointment}
                  className={"w-full sm:w-auto border-red-900/30"}
                >
                  {cancelLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Canceling...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Cancel Appointment
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentCard;
