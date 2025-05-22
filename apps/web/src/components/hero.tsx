import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function Hero({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative py-clamp overflow-hidden bg-background",
        className
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-y-8 md:gap-x-8 md:gap-y-0">
        {/* Content area */}
        <div className="w-full md:w-1/2 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Create Clone Hero Charts in Your Browser
          </h1>
          <p className="text-[clamp(1rem,4vw,1.25rem)] text-muted-foreground mb-6">
            Lunar Notes is a powerful, browser-based chart editor for Clone
            Hero. No downloads required.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="px-5 font-medium">
              <span>Start Charting</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-5 font-medium">
              Import Existing Chart
            </Button>
          </div>
        </div>

        {/* Image area */}
        <div className="w-full md:w-1/2 aspect-[4/3] rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden border border-slate-800">
          {/* Guitar shape */}
          <div className="relative w-3/4 h-3/4">
            <div
              className="w-full h-full bg-slate-800/20 absolute top-1/4 left-1/2 transform -translate-x-1/2"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            ></div>
            {/* Note buttons */}
            <div className="absolute bottom-[20%] right-[30%] w-[10%] h-[5%] bg-green-600 rounded-sm"></div>
            <div className="absolute bottom-[40%] left-[40%] w-[10%] h-[5%] bg-amber-600 rounded-sm"></div>
            <div className="absolute bottom-0 left-0 right-0 text-center text-slate-400 text-sm">
              Highway visualization coming soon
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
