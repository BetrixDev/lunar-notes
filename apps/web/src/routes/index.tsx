import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <Header />
      <Hero className="py-16" />
    </div>
  );
}
