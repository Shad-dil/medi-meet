"use client";
import { setUserRole } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const doctorSchema = z.object({
  speciality: z.string().min(2, "Speciality is required"),
  experience: z
    .number()
    .min(1, "Experience is required")
    .max(70, "Experience cannot exceed 70 years"),
  credentialUrl: z
    .string()
    .url("Invalid URL format")
    .min(1, "Credential URL is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description cannot exceed 1000 characters"),
});
const Onboarding = () => {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();
  const { loading, data, fn: submitUserRole } = useFetch(setUserRole);
  console.log(loading, data);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      speciality: "",
      experience: 1,
      credentialUrl: "",
      description: "",
    },
  });

  const specialityValue = watch("speciality");

  const handlePatientSelection = async () => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "PATIENT");
    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      toast.success("User role updated successfully");
      router.navigate(data.redirect);
    }
  }, [data]);

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => !loading && handlePatientSelection()}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-emerald-900/20 mb-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as Patient
            </CardTitle>
            <CardDescription className="mb-4">
              Book Appointments, consult with doctors, and manage your
              healthcare journey
            </CardDescription>
            <Button
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Continue as Patient"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => !loading && setStep("doctor-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-emerald-900/20 mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as Doctor
            </CardTitle>
            <CardDescription className="mb-4">
              Create your professional profile, manage appointments, and connect
              with patients
            </CardDescription>
            <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
              Continue as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (step === "doctor-form") {
    return <>Doctor Form</>;
  }
};

export default Onboarding;
