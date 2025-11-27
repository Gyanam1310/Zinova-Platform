import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/lib/config";
import ThemeToggle from "@/components/ThemeToggle";
import AnimatedButton from "@/components/ui/animated-button";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <AnimatedButton
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        className="rounded-full"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </AnimatedButton>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
          <div className="px-6 py-4 space-y-4">
            {NAVIGATION_ITEMS.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Zinova</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;