import { getAvailableTimeSlots, getDoctorById } from "@/actions/appointment";
import PageHeader from "@/components/page-header";
import { redirect } from "next/navigation";

import React from "react";
import toast from "react-hot-toast";
import DoctorProfile from "./_components/DoctorProfile";

const BookingPage = async ({ params }) => {
  const { id } = await params;
  try {
    const [doctorData, slotData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id),
    ]);

    return (
      <div>
        <DoctorProfile doctor={doctorData.doctor} slots={slotData.days || []} />
      </div>
    );
  } catch (error) {
    console.log("error" + error.message);
    toast.error("Error LLoading Dr Profile");
    redirect("/doctors");
  }
};

export default BookingPage;
