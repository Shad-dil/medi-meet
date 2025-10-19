import { bookAppointment } from "@/actions/appointment";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns/format";
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AppointmentForm = ({ doctorId, slot, onBack, onComplete }) => {
  const [description, setDescription] = useState("");

  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("booking");
      const formData = new FormData();
      formData.append("doctorId", doctorId);
      formData.append("startTime", slot.startTime);
      formData.append("endTime", slot.endTime);
      formData.append("description", description);
      const response = await submitBooking(formData);
    } catch (error) {
      console.log("Booking error: ", error);
      toast.error(
        error?.message || "An error occurred while booking the appointment."
      );
    }
  };

  useEffect(() => {
    if (data) {
      toast.success("Appointment booked successfully!");
      onComplete();
    }
  }, [data]);
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white  font-medium">
            {format(new Date(slot.startTime), "EEE, MMMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-white ">{slot.formatted}</span>
        </div>
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
          <span className="text-muted-foreground">
            Cost: <span className="text-white font-medium">2 credits</span>
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description">
          Describe your medical issue (optional)
        </label>
        <textarea
          id="description"
          value={description}
          placeholder="Provide any relevant details about your condition..."
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 p-2 w-full border border-muted-foreground rounded-md"
          rows={4}
        />
      </div>
      <div className="flex justify-between pt-2">
        <Button
          type="button"
          onClick={onBack}
          variant={"outline"}
          disabled={loading}
          className="mr-4 border border-emerald-900/30"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Change Time Slot
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className={"bg-emerald-600 hover:bg-emerald-700"}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
