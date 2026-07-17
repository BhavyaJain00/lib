import { Users, Handshake, ShieldCheck, Star } from "lucide-react";
import { STATS } from "@/lib/data";

const ICONS = [Users, Handshake, ShieldCheck, Star];

export function Stats() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-8 py-10 sm:gap-8 sm:py-12 lg:grid-cols-4">
        {STATS.map((stat, i) => {
          const Icon = ICONS[i];
          return (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <Icon className="mb-3 h-6 w-6 opacity-90 sm:h-7 sm:w-7" />
              <span className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-medium text-primary-foreground/80">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
