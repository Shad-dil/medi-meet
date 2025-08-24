import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/Speciality";
import Link from "next/link";

const DoctorPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-3xl font-bold  mb-2 gradient-title">
          Find your Doctor
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse by speciality or view all avaialble healthcare providers
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {SPECIALTIES.map((speciality) => (
          <Link key={speciality.name} href={`/doctors/${speciality.name}`}>
            <Card
              className={
                " border border-emerald-900/20 hover:border-emerald-700/40 transition-all cursor-pointer h-full"
              }
            >
              <CardContent
                className={
                  "flex p-6 flex-col items-center justify-center text-center h-full"
                }
              >
                <div className="w-12 h-12 rounded-full bg-emerald-900/20  flex items-center justify-center mb-4">
                  <div>{speciality.icon}</div>
                </div>
                <h3 className="font-medium text-white">{speciality.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default DoctorPage;
