import { Link, useNavigate } from "react-router-dom";
import { NAVIGATION_ITEMS } from "@/lib/config";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import logo from "/Zinova_logo.png";
import { logUserAction, logError } from "@/lib/logger";


const Navbar = () => {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    try {
      logUserAction(
        "NAV_CLICK",
        { target: href.replace("#", "") || "home" },
        "Navbar"
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      try {
        logError("LOGGING_ERROR", { source: "NAV_CLICK", error: errorMessage }, "Navbar");
      } catch {
        // Logging should never break navbar navigation.
      }
    }
  };

  const handleNavigation = (href: string) => {
    handleNavClick(href);

    if (href.startsWith("/")) {
      navigate(href);
    } else {
      const targetId = href.replace("#", "");
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        
        {/* Logo */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <img 
            src={logo} 
            alt="Zinova" 
            className="h-12 w-12 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">Zinova</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {NAVIGATION_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.href)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </button>
          ))}

          {/* Login Button */}
          <Link
            to="/login"
            onClick={() => handleNavClick("/login")}
            className="text-sm font-medium text-foreground border border-border px-4 py-2 rounded-md hover:bg-muted transition"
          >
            Login
          </Link>

          <ThemeToggle />
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
};

export default Navbar;