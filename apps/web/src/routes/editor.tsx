import { createFileRoute } from "@tanstack/react-router";
import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import { Header } from "@/components/header";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type {
  FormValidateOrFn,
  FormAsyncValidateOrFn,
} from "@tanstack/react-form";
import { z } from "zod";

export const Route = createFileRoute("/editor")({
  component: RouteComponent,
});

// Collapsible section component
function CollapsibleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 rounded-md overflow-hidden border border-sidebar-border bg-sidebar/80 backdrop-blur-sm">
      <button
        className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold text-lg hover:bg-sidebar-accent/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-3 pt-1">{children}</div>}
    </div>
  );
}

// Form type for the song properties
type SongFormValues = {
  title: string;
  artist: string;
  album: string;
  year: number | undefined;
  genre: string;
  difficulty: number | undefined;
  charter: string;
};

function SongPropertiesForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      artist: "",
      album: "",
      year: undefined,
      genre: "",
      difficulty: undefined,
      charter: "",
    } as SongFormValues,
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <SidebarMenu className="space-y-3">
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => (!value ? "Title is required" : undefined),
          }}
        >
          {(field) => (
            <SidebarMenuItem className="space-y-1">
              <Label htmlFor="title" className="text-sidebar-foreground">
                Song title
              </Label>
              <Input
                id="title"
                type="text"
                className="w-full bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground placeholder:text-muted-foreground"
                placeholder="Title"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </div>
              )}
            </SidebarMenuItem>
          )}
        </form.Field>

        <form.Field
          name="artist"
          validators={{
            onChange: ({ value }) =>
              !value ? "Artist is required" : undefined,
          }}
        >
          {(field) => (
            <SidebarMenuItem className="space-y-1">
              <Label htmlFor="artist" className="text-sidebar-foreground">
                Artist
              </Label>
              <Input
                id="artist"
                type="text"
                className="w-full bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground placeholder:text-muted-foreground"
                placeholder="Artist"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </div>
              )}
            </SidebarMenuItem>
          )}
        </form.Field>

        <form.Field name="album">
          {(field) => (
            <SidebarMenuItem className="space-y-1">
              <Label htmlFor="album" className="text-sidebar-foreground">
                Album
              </Label>
              <Input
                id="album"
                type="text"
                className="w-full bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground placeholder:text-muted-foreground"
                placeholder="Album"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </SidebarMenuItem>
          )}
        </form.Field>

        <form.Field
          name="year"
          validators={{
            onChange: ({ value }) =>
              value !== undefined &&
              (value < 1 || value > new Date().getFullYear())
                ? `Year must be between 1 and ${new Date().getFullYear()}`
                : undefined,
          }}
        >
          {(field) => (
            <SidebarMenuItem className="space-y-1">
              <Label htmlFor="year" className="text-sidebar-foreground">
                Year
              </Label>
              <Input
                id="year"
                type="number"
                className="w-full bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground placeholder:text-muted-foreground"
                placeholder="Year"
                value={field.state.value === undefined ? "" : field.state.value}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  field.handleChange(value);
                }}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </div>
              )}
            </SidebarMenuItem>
          )}
        </form.Field>

        <form.Field name="genre">
          {(field) => (
            <SidebarMenuItem className="space-y-1">
              <Label htmlFor="genre" className="text-sidebar-foreground">
                Genre
              </Label>
              <Input
                id="genre"
                type="text"
                className="w-full bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground placeholder:text-muted-foreground"
                placeholder="Genre"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </SidebarMenuItem>
          )}
        </form.Field>

        <form.Field
          name="difficulty"
          validators={{
            onChange: ({ value }) =>
              value !== undefined && (value < 1 || value > 100)
                ? "Difficulty must be between 1 and 100"
                : undefined,
          }}
        >
          {(field) => (
            <SidebarMenuItem className="space-y-1">
              <Label htmlFor="difficulty" className="text-sidebar-foreground">
                Difficulty
              </Label>
              <Input
                id="difficulty"
                type="number"
                className="w-full bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground placeholder:text-muted-foreground"
                placeholder="Difficulty"
                value={field.state.value === undefined ? "" : field.state.value}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  field.handleChange(value);
                }}
                onBlur={field.handleBlur}
              />
              {field.state.meta.errors && (
                <div className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </div>
              )}
            </SidebarMenuItem>
          )}
        </form.Field>

        <form.Field name="charter">
          {(field) => (
            <SidebarMenuItem className="space-y-1">
              <Label htmlFor="charter" className="text-sidebar-foreground">
                Charter
              </Label>
              <Input
                id="charter"
                type="text"
                className="w-full bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground placeholder:text-muted-foreground"
                placeholder="Charter"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </SidebarMenuItem>
          )}
        </form.Field>
      </SidebarMenu>
    </form>
  );
}

function LeftPanel() {
  return (
    <SidebarProvider>
      <Sidebar className="m-4 mt-20" variant="floating">
        <SidebarContent className="p-4">
          <CollapsibleSection title="Song Properties">
            <SongPropertiesForm />
          </CollapsibleSection>

          <CollapsibleSection title="Settings">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2 text-sidebar-foreground">
                Step: 1 /
                <Input
                  type="number"
                  className="w-16 h-6 bg-sidebar-accent/10 border-sidebar-border focus:border-sidebar-primary text-sidebar-foreground"
                  value={24}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleSection>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

function Highway() {
  const texture = useLoader(THREE.TextureLoader, "/highway.png");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 10);

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <boxGeometry args={[5, 100, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function RouteComponent() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-50">
        <Header isSimple />
      </div>
      <div className="absolute top-0 left-0 w-full z-50">
        <LeftPanel />
      </div>
      <Canvas
        camera={{
          fov: 90,
          near: 0.1,
          far: 1000,
          position: [0, 4, 10],
        }}
      >
        <Stars
          radius={250}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <hemisphereLight intensity={1} color="white" groundColor="black" />
        <fog attach="fog" args={["#0f0e18", 5, 20]} />
        <color attach="background" args={["#0f0e18"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />
        <Highway />

        <EffectComposer multisampling={5}>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
