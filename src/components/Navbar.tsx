import { NAVIGATION_ITEMS } from "@/lib/config";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/Zinova_logo.PNG" 
            alt="Zinova" 
            className="h-12 w-12 object-contain"
          />
          <span className="text-xl font-bold text-foreground">Zinova</span>
        </div>
        
        <div className="hidden md:flex gap-8 items-center">
          {NAVIGATION_ITEMS.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
          <ThemeToggle />
        </div>
        
        <MobileMenu />
      </div>
    </nav>
  );
};

export default Navbar;