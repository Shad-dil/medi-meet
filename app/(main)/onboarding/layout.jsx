import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding | MediMeet",
  description:
    "Get started with MediMeet's onboarding process to set up your account and preferences.",
};
const OnboardingLayout = async ({ children }) => {
  const user = await getCurrentUser();
  if (user) {
    if (user.role === "PATIENT") {
      redirect("/doctors");
    } else if (user.role === "DOCTOR") {
      if (user.verificationStatus === "PENDING") {
        redirect("/doctor/verification");
      } else {
        redirect("/doctor");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }

  return (
    <div className="container mx-auto my-20 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 gradient-title">
            Welcome to Medimeet
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell Us how you want to use our platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default OnboardingLayout;
