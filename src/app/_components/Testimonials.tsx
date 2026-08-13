import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Mohan Pareek",
    text: "I tried Herbsvedic's Shilajit Resin Gold after hearing about its benefits, and honestly, it works. Within a couple of weeks, I felt more energetic and less fatigued.",
  },
  {
    name: "Rahul Sharma",
    text: "What I liked most about the consultation was that it wasn't just about giving medicine, it was about understanding me as a whole person.",
  },
  {
    name: "Urmila Sharma",
    text: "I've been using Herbsvedic's Neem & Aloe Vera skin care for a month now, and my skin feels soft, fresh, and much clearer.",
  },
  {
    name: "Premlata",
    text: "The Ayurvedic Hair Oil has been a lifesaver for my dry scalp. After regular use, I've noticed less hair fall and stronger, shinier hair.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#F9F3D9] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <h2 className="font-display text-3xl text-bark text-center mb-10">
          Loved by thousands of customers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div key={review.name} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex text-turmeric mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
              <p className="font-body text-sm text-bark/80 mb-4">&quot;{review.text}&quot;</p>
              <p className="font-body font-semibold text-sm text-bark">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}