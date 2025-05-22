import { MusicIcon, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const navItems = ["Pricing", "Features", "About", "Blog"];

// Navigation component shared between mobile and desktop
function Navigation() {
  return (
    <ul className="flex flex-col md:flex-row md:items-center md:gap-4 lg:gap-8">
      {navItems.map((item) => (
        <li key={item} className="py-1 md:py-0 w-full md:w-auto">
          <a
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors px-2 py-1 rounded-md block w-full md:w-auto"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Action buttons component shared between mobile and desktop
function ActionButtons() {
  return (
    <>
      <Button variant="secondary" size="sm" className="w-full md:w-auto">
        Open Editor
      </Button>
      <Button variant="outline" size="sm" className="w-full md:w-auto">
        Sign In
      </Button>
      <Button size="sm" className="w-full md:w-auto">
        Sign Up
      </Button>
    </>
  );
}

// Mobile menu component
function MobileMenu({ isOpen }: { isOpen: boolean }) {
  const displayClass = isOpen ? "block" : "hidden";

  return (
    <>
      <nav className={`w-full md:hidden ${displayClass} mt-4`}>
        <Navigation />
      </nav>

      <div
        className={`w-full md:hidden ${displayClass} mt-4 flex flex-col items-stretch gap-2`}
      >
        <ActionButtons />
      </div>
    </>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-3 border-b md:px-6 md:h-16">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <Link to="/" className="flex items-center gap-2.5">
          <MusicIcon className="w-6 h-6 text-primary" />
          <span className="text-lg font-medium">Lunar Notes</span>
        </Link>
      </div>

      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <Navigation />
      </nav>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex md:items-center md:gap-4">
        <ActionButtons />
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} />
    </header>
  );
}
