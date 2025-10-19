import { getCurrentUser } from "@/actions/onboarding";
import { getPatientAppointments } from "@/actions/patient";
import PageHeader from "@/components/page-header";
import { Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const PatientAppointments = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { appointments, error } = getPatientAppointments();
  return (
    <div className="container mx-auto px-4 my-20  py-12 ">
      <PageHeader
        title="My Appointments"
        icon={<Calendar />}
        backLink="/doctors"
        backLabel="Find Doctors"
        className=""
      />
    </div>
  );
};

export default PatientAppointments;
