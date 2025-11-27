import { TESTIMONIALS } from "@/lib/config";
import { Quote } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Community Voices 🗣️
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from those who are making a difference with Zinova
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-4">
                <Quote className="h-6 w-6 text-accent flex-shrink-0 mr-2" />
                <p className="text-muted-foreground italic">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center mt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="font-bold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;