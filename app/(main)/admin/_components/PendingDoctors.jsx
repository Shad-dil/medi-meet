"use client";

import { updateDoctorStatus } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useFetch from "@/hooks/use-fetch";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PendingDoctors = ({ doctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const {
    loading,
    data,
    fn: submitStatusuUpdate,
  } = useFetch(updateDoctorStatus);

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Done");
    }
  }, [data]);
  return (
    <div>
      <Card className={"bg-muted/20 border-emerald-900/20"}>
        <CardHeader>
          <CardTitle className={"text-xl font-bold text-white"}>
            Pending Doctor Verification
          </CardTitle>
          <CardDescription>
            Review and approve doctor applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No pending verification request at this time
            </div>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={
                    "bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all"
                  }
                >
                  <CardContent className={"p-4"}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="bg-muted/20 rounded-full p-2">
                          <User className="h-4 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialty} . {doctor.experience} years
                            experience
                          </p>
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant={"outline"}
                          className={
                            "bg-amber-900/20 border-amber-900/30 text-amber-400"
                          }
                        >
                          Pending
                        </Badge>
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className={"border-emerald-900/30 hover:bg-muted/80"}
                          onClick={() => handleViewDetails(doctor)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedDoctor}
        onOpenChange={() => setSelectedDoctor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"font-bold text-xl text-white"}>
              Doctor Verification Details
            </DialogTitle>
            <DialogDescription>
              Review the doctor&apos; information carefully before making a
              decision.
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Name</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.name}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.email}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Specialty</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.specialty}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Experience</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.experience} years
                </p>
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDoctor.description}
                </p>
              </div>
              {selectedDoctor.credentialUrl && (
                <div>
                  <h4 className="font-medium">Credentials</h4>
                  <a
                    href={selectedDoctor.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-400 hover:underline"
                  >
                    View Credential Document
                  </a>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("doctorId", selectedDoctor.clerkUserId);
                    formData.append("status", "VERIFIED");
                    submitStatusuUpdate(formData);
                    setSelectedDoctor(null);
                  }}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append("doctorId", selectedDoctor.clerkUserId);
                    formData.append("status", "REJECTED");
                    submitStatusuUpdate(formData);
                    setSelectedDoctor(null);
                  }}
                  disabled={loading}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingDoctors;
