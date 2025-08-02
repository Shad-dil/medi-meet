import { getPendingDoctors, getVerifiedDoctors } from "@/actions/admin";
import PendingDoctors from "@/app/(main)/admin/_components/PendingDoctors";
import VerifiedDoctors from "@/app/(main)/admin/_components/VerifiedDoctors";
import { TabsContent } from "@/components/ui/tabs";

const AdminPage = async () => {
  const [pendingDoctorsResult, verifiedDoctsResult] = await Promise.all([
    getPendingDoctors(),
    getVerifiedDoctors(),
  ]);
  const pendingDoctors = pendingDoctorsResult.doctors;
  const verifiedDoctors = verifiedDoctsResult.doctors;
  return (
    <>
      <TabsContent value="pending" className={"border-none p-0"}>
        <PendingDoctors doctors={pendingDoctors || []} />
      </TabsContent>
      <TabsContent value="doctors" className={"border-none p-0"}>
        <VerifiedDoctors doctors={verifiedDoctors || []} />
      </TabsContent>
    </>
  );
};

export default AdminPage;
