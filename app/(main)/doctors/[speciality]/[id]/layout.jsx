import { getDoctorById } from "@/actions/appointment";
import PageHeader from "@/components/page-header";
import { Description } from "@radix-ui/react-dialog";
import { redirect } from "next/navigation";
import React from "react";
export async function generateMetadata({ params }) {
  const { id } = await params;
  const { doctor } = await getDoctorById(id);
  return {
    title: `Dr. ${doctor.name} | Medimeet`,
    description: `Book Appointment `,
  };
}
const BookingLayout = async ({ children, params }) => {
  const { id } = await params;
  const { doctor } = await getDoctorById(id);
  if (!doctor) redirect("/doctors");
  return (
    <div className="container mx-auto">
      <PageHeader
        title={"Dr. " + doctor.name}
        backLink={`/doctors/${doctor.specialty}`}
        backLabel={`Back to ${doctor.specialty}`}
      />
      {children}
    </div>
  );
};

export default BookingLayout;
