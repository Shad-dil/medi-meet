import PageHeader from "@/components/page-header";
import { Stethoscope } from "lucide-react";

const metadata = {
  tittle: "Doctor Verification",
  description: "Doctor Verification Page",
};
const DoctorLayoutPage = ({ children }) => {
  return (
    <div className="container mx-auto my-20 px-4 py-12">
      <PageHeader icon={<Stethoscope />} title={"Doctor Dashboard"} />
      {children}
    </div>
  );
};

export default DoctorLayoutPage;
