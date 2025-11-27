import { useState, useEffect } from "react";
import { Leaf, Users, Heart, Package, TrendingUp } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const ImpactCalculator = () => {
  const [foodWaste, setFoodWaste] = useState(100); // kg per week
  const [timePeriod, setTimePeriod] = useState(12); // months
  const [impactData, setImpactData] = useState({
    mealsSaved: 0,
    co2Saved: 0,
    waterSaved: 0,
    peopleFed: 0
  });

  // Calculate impact based on food waste and time period
  useEffect(() => {
    // Conversion factors (simplified for demonstration)
    const mealsPerKg = 2.5; // meals saved per kg of food waste prevented
    const co2PerKg = 2.3; // kg CO2 saved per kg of food waste prevented
    const waterPerKg = 1500; // liters of water saved per kg of food waste prevented
    const peoplePerMeal = 0.3; // people fed per meal (fractional because meals are shared)
    
    const weeks = timePeriod * 4.33; // approx weeks in selected months
    const totalFoodWastePrevented = foodWaste * weeks;
    
    setImpactData({
      mealsSaved: Math.round(totalFoodWastePrevented * mealsPerKg),
      co2Saved: Math.round(totalFoodWastePrevented * co2PerKg),
      waterSaved: Math.round(totalFoodWastePrevented * waterPerKg),
      peopleFed: Math.round(totalFoodWastePrevented * mealsPerKg * peoplePerMeal)
    });
  }, [foodWaste, timePeriod]);

  const impactItems = [
    {
      icon: Package,
      title: "Meals Saved",
      value: impactData.mealsSaved,
      suffix: "+",
      color: "text-green-500",
      description: "nutritious meals redirected to communities in need"
    },
    {
      icon: Leaf,
      title: "CO2 Saved",
      value: impactData.co2Saved,
      suffix: "kg",
      color: "text-blue-500",
      description: "greenhouse gases prevented from entering the atmosphere"
    },
    {
      icon: TrendingUp,
      title: "Water Saved",
      value: impactData.waterSaved,
      suffix: "L",
      color: "text-cyan-500",
      description: "liters of water preserved through waste prevention"
    },
    {
      icon: Users,
      title: "People Fed",
      value: impactData.peopleFed,
      suffix: "+",
      color: "text-purple-500",
      description: "individuals receiving nutritious meals monthly"
    }
  ];

  return (
    <section id="impact-calculator" className="py-20 px-6 bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Calculate Your Impact 🌍
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how much difference you can make by reducing food waste with Zinova
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Controls */}
          <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6">Your Food Waste</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Food Waste per Week
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={foodWaste}
                    onChange={(e) => setFoodWaste(Number(e.target.value))}
                    className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-bold text-primary min-w-[60px]">
                    {foodWaste} kg
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 kg</span>
                  <span>500 kg</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Time Period
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-bold text-primary min-w-[60px]">
                    {timePeriod} mo
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 mo</span>
                  <span>24 mo</span>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-bold text-foreground mb-2">With Zinova:</h4>
                  <p className="text-sm text-muted-foreground">
                    {foodWaste > 0 ? (
                      `Prevent ${Math.round(foodWaste * timePeriod * 4.33)}kg of food waste`
                    ) : (
                      "Start making an impact today!"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Impact Results */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-6">
              {impactItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start mb-4">
                      <div className={`p-3 rounded-lg ${item.color}/10 mr-4`}>
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <div className="flex items-baseline mt-2">
                          <AnimatedCounter 
                            target={item.value} 
                            suffix={item.suffix} 
                            duration={1500} 
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex items-center mb-4 md:mb-0 md:mr-4">
                  <Heart className="h-8 w-8 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">Ready to Make a Difference?</h3>
                    <p className="mt-1 opacity-90">
                      Join thousands of organizations using Zinova to fight food waste
                    </p>
                  </div>
                </div>
                <button className="ml-auto bg-white text-green-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactCalculator;