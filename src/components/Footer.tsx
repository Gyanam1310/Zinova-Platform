import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <div className="flex justify-center">
          <Leaf className="h-6 w-6 text-accent" />
        </div>
        <p className="text-sm text-primary-foreground/80">
          © {new Date().getFullYear()} Zinova – Building a sustainable future 🌱
        </p>
        <p className="text-xs text-primary-foreground/60">
          Together, we can end food waste and hunger 🤝
        </p>
      </div>
    </footer>
  );
};

export default Footer;