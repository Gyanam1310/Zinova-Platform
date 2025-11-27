import { useState } from "react";
import { Leaf, Zap, Heart, Users } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";

const CallToAction = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would connect to your backend
      console.log("Email submitted:", email);
      setIsSubmitted(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  const benefits = [
    {
      icon: Leaf,
      title: "Reduce Waste",
      description: "Cut food waste by up to 70% with our smart platform"
    },
    {
      icon: Heart,
      title: "Feed Communities",
      description: "Directly impact families in need with surplus food"
    },
    {
      icon: Zap,
      title: "Save Resources",
      description: "Preserve water, energy, and reduce carbon emissions"
    },
    {
      icon: Users,
      title: "Join Movement",
      description: "Connect with a network of like-minded organizations"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Benefits */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Waste Into Worth 🌟
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl">
              Join the growing community of restaurants, farms, and NGOs making a real impact on food waste and hunger.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="p-2 bg-primary-foreground/10 rounded-lg mr-4">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-foreground">{benefit.title}</h3>
                      <p className="text-sm text-primary-foreground/80 mt-1">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <AnimatedButton 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
                animationType="lift"
              >
                Schedule Demo
              </AnimatedButton>
              <AnimatedButton 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                animationType="lift"
              >
                View Case Studies
              </AnimatedButton>
            </div>
          </div>
          
          {/* Right Column - Email Signup */}
          <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-primary-foreground/80">
                Join thousands of organizations fighting food waste
              </p>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-primary-foreground mb-2">
                  Thank You! 🙏
                </h4>
                <p className="text-primary-foreground/80">
                  We've received your information and will contact you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary-foreground/80 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-white/10 border border-primary-foreground/20 rounded-lg text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-foreground/80 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-primary-foreground/20 rounded-lg text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-primary-foreground/80 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    placeholder="Restaurant, NGO, Farm, etc."
                    className="w-full px-4 py-3 bg-white/10 border border-primary-foreground/20 rounded-lg text-white placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div className="pt-2">
                  <AnimatedButton 
                    type="submit"
                    size="lg" 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    animationType="pulse"
                  >
                    Join the Movement
                  </AnimatedButton>
                </div>
                
                <p className="text-xs text-center text-primary-foreground/60 mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;