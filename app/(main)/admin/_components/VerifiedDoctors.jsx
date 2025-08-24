"use client";

import {
  suspendDoctor,
  updateDoctorActiveStatus,
  updateDoctorStatus,
} from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const VerifiedDoctors = ({ doctors }) => {
  const [searchTerms, setSearchTerms] = useState("");
  const [targetDoctor, settargetDoctor] = useState(null);

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchTerms.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query)
    );
  });

  const {
    loading,
    data,
    fn: submitStatusuUpdate,
  } = useFetch(updateDoctorActiveStatus);

  const handleUpdateStatus = async (doctor) => {
    const confirm = window.confirm(
      `Are you sure , you want to suspend ${doctor.name}?`
    );
    if (!confirm || loading) return;

    const formData = new FormData();
    formData.append("doctorId", doctor.id);
    formData.append("suspend", "true");
    settargetDoctor(doctor);
    await submitStatusuUpdate(formData);
    // setSelectedDoctor(null);
  };

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success("Doctor suspended successfully !!!");
      } else {
        toast.error(data.error);
      }
      settargetDoctor(null);
    }
  }, [data]);

  return (
    <div>
      <Card className={"bg-muted/20 border-emerald-900/20"}>
        <CardHeader>
          <div>
            <div>
              <CardTitle className={"text-xl font-bold text-white"}>
                Manage Doctors
              </CardTitle>
              <CardDescription>
                view and manage all verified doctors
              </CardDescription>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className={"pl-8 bg-background border-emerald-900/20"}
                placeholder="Search Doctors..."
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerms
                ? "No Doctor Match your search criteria"
                : "No Verified Doctors Available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={"bg-muted/20 border-emerald-900/20"}
                >
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className={"text-xl font-bold text-white"}>
                        {doctor.name}
                      </CardTitle>
                      <div className="">
                        <Badge
                          variant={"outline"}
                          className={
                            "bg-emerald-900/20 border-emerald-900/30 text-emerald-400 mr-2"
                          }
                        >
                          Active
                        </Badge>
                        <Button
                          onClick={() => handleUpdateStatus(doctor)}
                          disabled={loading && targetDoctor?.id === doctor.id}
                          className="cursor-pointer bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-600/30"
                        >
                          Suspend
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {doctor.email}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifiedDoctors;
