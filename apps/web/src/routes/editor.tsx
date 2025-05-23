import { createFileRoute } from "@tanstack/react-router";
import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import { Header } from "@/components/header";
import {
  ChevronUpIcon,
  CircleDotIcon,
  ClockIcon,
  EraserIcon,
  FlagIcon,
  MenuIcon,
  MousePointer2Icon,
  PyramidIcon,
  SparklesIcon,
} from "lucide-react";
import type React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LANE_COLORS = ["#00ff00", "#ff0000", "#ffff00", "#0066ff", "#ff8800"];

export const Route = createFileRoute("/editor")({
  component: RouteComponent,
});

function Highway() {
  const texture = useLoader(THREE.TextureLoader, "/highway.png");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 10);

  return (
    <mesh position={[0, -0.1, -48]} rotation={[-Math.PI / 2, 0, 0]}>
      <boxGeometry args={[5, 100, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Hitzones() {
  const spacing = 0.95;
  const startX = -1.9;

  return (
    <group>
      {LANE_COLORS.map((color, index) => (
        <mesh
          key={index}
          position={[startX + index * spacing, 0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[0.35, 32]} />
          <meshStandardMaterial color={color} opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

function Strikeline() {
  return (
    <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[5, 0.01, 0.1]} />
      <meshStandardMaterial color="#ffffff" opacity={1} />
    </mesh>
  );
}

const LeftPanelContext = createContext({
  openPanelId: null as string | null,
  setOpenPanelId: (_: string | null) => {},
});

function LeftPanelProvider({ children }: React.PropsWithChildren) {
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);

  return (
    <LeftPanelContext.Provider value={{ openPanelId, setOpenPanelId }}>
      {children}
    </LeftPanelContext.Provider>
  );
}

type LeftPanelProps = React.PropsWithChildren<{
  label: string;
}>;

function LeftPanel({ label, children }: LeftPanelProps) {
  const { openPanelId, setOpenPanelId } = useContext(LeftPanelContext);

  const isOpen = openPanelId === label;

  const handleClick = useCallback(() => {
    setOpenPanelId(openPanelId === label ? null : label);
  }, [openPanelId, label, setOpenPanelId]);

  return (
    <>
      <Tooltip delayDuration={400}>
        <TooltipTrigger asChild>
          <button
            aria-label={`Open ${label}`}
            type="button"
            className={cn(
              "w-6 hover:w-10 hover:bg-secondary/15 transition-all ease-out duration-300 border-r backdrop-blur-md flex items-center justify-center relative overflow-visible",
              isOpen && "w-8 border-r-border/35 bg-secondary/25"
            )}
            onClick={handleClick}
          >
            <p className="rotate-90 whitespace-nowrap tracking-widest font-medium flex items-center gap-2">
              <ChevronUpIcon
                className={cn(
                  "w-4 h-4 transition-transform ease-out duration-500",
                  isOpen && "rotate-180"
                )}
              />{" "}
              {label}
            </p>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {isOpen ? "Close" : "Open"} {label}
        </TooltipContent>
      </Tooltip>

      <div
        className={cn(
          "max-w-0 transition-all ease-in-out duration-50 overflow-hidden",
          isOpen && "max-w-sm"
        )}
      >
        <div className="w-auto h-full">{children}</div>
      </div>
    </>
  );
}

type ToolButtonProps = {
  icon: React.ReactNode;
  label: string;
  keyBinding: string;
  onClick: () => void;
  isActive?: boolean;
};

function ToolButton({
  icon,
  label,
  keyBinding,
  onClick,
  isActive = false,
}: ToolButtonProps) {
  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          size="icon"
          onClick={onClick}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-1">
        <span>{label}</span>
        <span>Key: {keyBinding}</span>
      </TooltipContent>
    </Tooltip>
  );
}

function RouteComponent() {
  const [activeTool, setActiveTool] = useState<string>("select");

  const handleToolClick = useCallback((toolName: string) => {
    setActiveTool(toolName);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-50 inset-0 flex flex-col">
        <Header isSimple />
        <div className="flex grow">
          <LeftPanelProvider>
            <LeftPanel label="Song Properties">
              <div className="w-64 border-r h-full bg-background/15 backdrop-blur-md flex flex-col">
                <h1 className="text-xl font-semibold text-center p-1">
                  Song Properties
                </h1>
                <Separator />
                <div className="flex flex-col justify-between p-2 grow overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Song Title" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="artist">Artist</Label>
                      <Input id="artist" placeholder="Artist" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="album">Album</Label>
                      <Input id="album" placeholder="Album" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        placeholder="Year"
                        type="number"
                        min={1}
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="genre">Genre</Label>
                      <Input id="genre" placeholder="Genre" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Other
                    </p>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="charter">Charter</Label>
                      <Input id="charter" placeholder="Charter" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Input
                        id="difficulty"
                        placeholder="Difficulty"
                        type="number"
                        min={1}
                        max={100}
                      />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </LeftPanel>
            <LeftPanel label="Song Audio"></LeftPanel>
            <LeftPanel label="Stats"></LeftPanel>
            <LeftPanel label="Tools">
              <div className="w-12 border-r h-full bg-background/15 backdrop-blur-md flex flex-col items-center justify-center p-2 gap-2">
                <ToolButton
                  icon={<MousePointer2Icon />}
                  label="Select/Move"
                  keyBinding="J"
                  onClick={() => handleToolClick("select")}
                  isActive={activeTool === "select"}
                />
                <ToolButton
                  icon={<EraserIcon />}
                  label="Erase"
                  keyBinding="K"
                  onClick={() => handleToolClick("erase")}
                  isActive={activeTool === "erase"}
                />
                <ToolButton
                  icon={<CircleDotIcon />}
                  label="Add Note"
                  keyBinding="Y"
                  onClick={() => handleToolClick("addNote")}
                  isActive={activeTool === "addNote"}
                />
                <ToolButton
                  icon={<SparklesIcon />}
                  label="Starpower"
                  keyBinding="U"
                  onClick={() => handleToolClick("starpower")}
                  isActive={activeTool === "starpower"}
                />
                <ToolButton
                  icon={<PyramidIcon />}
                  label="Metronome"
                  keyBinding="I"
                  onClick={() => handleToolClick("metronome")}
                  isActive={activeTool === "metronome"}
                />
                <ToolButton
                  icon={<ClockIcon />}
                  label="Time Signature"
                  keyBinding="O"
                  onClick={() => handleToolClick("timeSignature")}
                  isActive={activeTool === "timeSignature"}
                />
                <ToolButton
                  icon={<MenuIcon />}
                  label="Section"
                  keyBinding="P"
                  onClick={() => handleToolClick("section")}
                  isActive={activeTool === "section"}
                />
                <ToolButton
                  icon={<FlagIcon />}
                  label="Event"
                  keyBinding="L"
                  onClick={() => handleToolClick("event")}
                  isActive={activeTool === "event"}
                />
              </div>
            </LeftPanel>
          </LeftPanelProvider>
        </div>
      </div>

      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 3.5, 1.5]}
          fov={90}
          rotation={[-Math.PI / 6, 0, 0]}
        />
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
        <color attach="background" args={["#0f0e18"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />
        <Highway />
        <Hitzones />
        <Strikeline />

        <EffectComposer multisampling={5}>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
        </EffectComposer>
        <fog attach="fog" args={["#0f0e18", 5, 25]} />
      </Canvas>
    </div>
  );
}
