const testimonials = [
  {
    name: 'Sita Sharma',
    role: 'Owner, Himalayan Crafts',
    quote:
      'Baazarify made it possible for me to sell my handmade products online. The setup was incredibly easy, and my customers love paying with eSewa.',
    avatar: 'SS',
  },
  {
    name: 'Rajesh Thapa',
    role: 'Founder, TechGadgets Nepal',
    quote:
      'Moving from Instagram DMs to Baazarify was a game-changer. Now I have a proper storefront, order tracking, and inventory management all in one place.',
    avatar: 'RT',
  },
  {
    name: 'Priya Gurung',
    role: 'Co-founder, Organic Kitchen',
    quote:
      'The dashboard gives me a clear view of my business. I can see which products are trending, manage orders efficiently, and my revenue has grown 3x.',
    avatar: 'PG',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[var(--grey-100)]">
      <div className="container-main">
        <div className="text-center mb-16">
          <span className="text-overline text-[var(--primary-main)] font-semibold">
            Testimonials
          </span>
          <h2 className="mt-4 text-heading-1 font-display font-bold text-[var(--grey-900)]">
            Loved by Nepali Merchants
          </h2>
          <p className="mt-4 text-body-lg text-[var(--graphite)] max-w-2xl mx-auto">
            Join hundreds of merchants who trust Baazarify to power their online business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card p-8">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="var(--amber)"
                    stroke="var(--amber)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-body text-[var(--graphite)] mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--peach)] text-[var(--coral-dark)] flex items-center justify-center font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-[var(--grey-900)]">
                    {testimonial.name}
                  </p>
                  <p className="text-caption text-[var(--grey-600)]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
