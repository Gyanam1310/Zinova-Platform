import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Mail, Building, MessageSquare, CheckCircle } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent! 📨",
      description: "Thank you for your interest. We'll get back to you soon.",
    });
    setIsSubmitted(true);
    setFormData({ name: "", email: "", organization: "", message: "" });
    
    // Reset submission status after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section id="contact" className="py-20 px-6 bg-card">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Join the Movement 🤝
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground">
            Whether you're a farmer 🧑‍🌾, restaurant 🍽️, NGO ❤️, or just want to help—let's connect
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Thank You! 🙏
            </h3>
            <p className="text-green-700">
              We've received your message and will contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Organization (Optional)"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="bg-background pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  placeholder="Tell us how you'd like to get involved..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="min-h-32 bg-background pl-10"
                />
              </div>
            </div>
            
            <AnimatedButton type="submit" className="w-full" size="lg" variant="hero" animationType="pulse">
              Send Message <Send className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;