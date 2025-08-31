"use client";
import { setAvailabilitySlots } from "@/actions/doctor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import { Circle, Clock, Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AvailabilitySetting = ({ slots }) => {
  const [showForm, setShowForm] = useState(false);
  const { loading, fn: SubmitSlots, data } = useFetch(setAvailabilitySlots);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
    },
  });

  const createLocalDateFromTime = (timeStr) => {
    const [hour, minutes] = timeStr.split(":").map(Number);
    const now = new Date();
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minutes
    );

    return date;
  };
  const onSubmit = async (data) => {
    if (loading) return;
    const formData = new FormData();
    const startTime = createLocalDateFromTime(data.startTime);
    const endTime = createLocalDateFromTime(data.endTime);
    if (startTime > endTime) {
      toast.error("End time must be after start time ");
      return;
    }

    formData.append("startTime", startTime.toISOString());
    formData.append("endTime", endTime.toISOString());
    await SubmitSlots(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      setShowForm(false);
      toast.success(" Avaibility slot is updated");
    }
  }, [data]);
  const formatDateString = (dateStr) => {
    try {
      return format(new Date(dateStr), "h:mm a");
    } catch (error) {
      return "invaled time";
    }
  };
  return (
    <Card className={"border-emerald-900/20"}>
      <CardHeader>
        <CardTitle className={"text-xl font-bold text-white flex items-center"}>
          <Clock className="h-5 w-5 mr-2 text-emerald-400" />
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set Your daily availability for patients appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <>
            <div className="mb-6">
              <h3 className="font-medium text-lg text-white mb-3">
                Current Avaibility
              </h3>
              {slots.length === 0 ? (
                <p>
                  You havent't set any availability slot yet, Add your
                  availability here.
                </p>
              ) : (
                <div>
                  {slots.map((slot) => {
                    return (
                      <div
                        key={slot.id}
                        className="flex items-center p-3 rounded-md bg-muted/20 border border-emerald-900/20"
                      >
                        <div className="bg-emerald-900/20 p-2 rounded-full mr-3">
                          <Circle className="h-4 w-4  text-emerald-400" />
                        </div>

                        <p className="text-white font-medium">
                          {formatDateString(slot.startTime)}-
                          {formatDateString(slot.endTime)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className={
                "w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Availability Time
            </Button>
          </>
        ) : (
          <form
            className="space-y-4 border border-emerald-900/20 rounded-md p-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-lg text-white font-medium mb-2">
              Set Daily Availability
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startTime">Start Time</label>
                <Input
                  id="startTime"
                  type={"time"}
                  {...register("startTime", {
                    required: "Start Time is Required",
                  })}
                  className={"bg-background border-emerald-900/20"}
                />
                {errors.startTime && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="endTime">End Time</label>
                <Input
                  id="endTime"
                  type={"time"}
                  {...register("endTime", {
                    required: "End Time is Required",
                  })}
                  className={"bg-background border-emerald-900/20"}
                />
                {errors.endTime && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-2 space-x-3">
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant={"outline"}
                disabled={loading}
                className={"border border-emerald-900/20"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={"bg-emerald-600 hover:bg-emerald-700"}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 rounded-md animate-spin" />
                ) : (
                  "Save Availability"
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilitySetting;
