import { FaLeaf, FaUserMd, FaFlask, FaTruck, FaShieldAlt } from "react-icons/fa";

const benefits = [
  { icon: FaLeaf, text: "Authentic Ayurvedic Products" },
  { icon: FaUserMd, text: "Certified Ayurvedic Doctors" },
  { icon: FaFlask, text: "Holistic & Nutrient-Rich Formulas" },
  { icon: FaTruck, text: "Fast, Reliable Delivery" },
  { icon: FaShieldAlt, text: "Quality-Tested & Trustworthy" },
];

export default function BenefitsStrip() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
        {benefits.map(({ icon: Icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-canopy/10 flex items-center justify-center text-canopy text-xl">
              <Icon />
            </div>
            <p className="font-body text-sm text-bark/80 max-w-35">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}