import Pricing from "@/components/pricing";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PricingPage = () => {
  return (
    <div className="container mx-auto my-20">
      <div className="flex justify-start mb-2">
        <Link
          href="/"
          className="flex items-center text-muted-foreground hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>
      </div>
      <div className="max-w-full mx-auto mb-12 text-center">
        <Badge
          variant="outline"
          className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 gap-2"
        >
          Affordable Healthcare Plans
        </Badge>
        <h1 className="text-4xl md:text-5xl gradient-title mb-4 font-bold">
          Pricing Plans
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs.
        </p>
      </div>
      <Pricing />
      <div>
        <p className="text-center text-muted-foreground mt-6">
          For more information, contact us at{" "}
          <a
            href="mailto:info@medi-meet.com"
            className="text-blue-500 hover:underline"
          >
            info@medi-meet.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
