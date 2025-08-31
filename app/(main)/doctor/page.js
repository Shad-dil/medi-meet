import { getDoctorAppointments, getDoctorAvailability } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/onboarding";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { AlertCircle, Calendar, Clock, User } from "lucide-react";
import { redirect } from "next/navigation";
import AppointmentSetting from "./_components/appointment-setting";
import AvailabilitySetting from "./_components/availiablity-setting";

const DoctorPage = async () => {
  const user = await getCurrentUser();

  const [appointmentsData, availabilityData] = await Promise.all([
    getDoctorAppointments(),
    getDoctorAvailability(),
  ]);
  if (user?.role !== "DOCTOR") {
    redirect("/onboarding");
  }

  if (user?.verificationStatus !== "VERIFIED") {
    redirect("/doctor/verification");
  }
  return (
    <div>
      <Tabs
        defaultValue="pending"
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <TabsList
          className={
            "md:col-span-1 bg-muted/30 border h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2  md:space-x-0"
          }
        >
          <TabsTrigger
            value="appointment"
            className={
              "cursor-pointer flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
            }
          >
            <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Appointment</span>
          </TabsTrigger>
          <TabsTrigger
            value="availabilty"
            className={
              "cursor-pointer flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
            }
          >
            <Clock className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Availability</span>
          </TabsTrigger>
        </TabsList>
        <div className="md:col-span-3">
          <TabsContent value="appointment" className="border-none p-0">
            <AppointmentSetting slots={appointmentsData || []} />
          </TabsContent>
          <TabsContent value="availabilty" className="border-none p-0">
            <AvailabilitySetting slots={availabilityData.slots || []} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DoctorPage;
