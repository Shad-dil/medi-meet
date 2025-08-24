// "use client";

import { getDoctorBySpeciality } from "@/actions/doctor-listing";
import DoctorCard from "@/components/DoctorCard";
import Header from "@/components/Header";
import PageHeader from "@/components/page-header";
import useFetch from "@/hooks/use-fetch";
import { redirect } from "next/navigation";

const DoctorSpeciality = async ({ params }) => {
  const { speciality } = await params;
  const decodedSpeciality = decodeURIComponent(speciality);
  if (!speciality) redirect("/doctors");
  const { doctors, error } = await getDoctorBySpeciality(speciality);
  if (error) {
    console.log(error, "error in fetching doctors by speciality");
  }
  return (
    <div>
      <PageHeader
        title={decodedSpeciality}
        backLink={"/doctors"}
        backLabel="All Speciality"
      />
      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {" "}
          <h3 className="text-xl font-medium text-white mb-2">
            No Doctors Available, right now . check later !
          </h3>
        </div>
      )}
    </div>
  );
};

export default DoctorSpeciality;
