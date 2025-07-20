// "use client";

const DoctorSpeciality = async ({ params }) => {
  const { speciality } = await params;
  return <div>Speciality: {speciality}</div>;
};

export default DoctorSpeciality;
