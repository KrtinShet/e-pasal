import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      'Up to 25 products',
      'Basic storefront',
      'Order management',
      'COD payments',
      'Email support',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '999',
    description: 'For growing businesses',
    features: [
      'Up to 200 products',
      'Custom domain',
      'eSewa & Khalti payments',
      'Analytics dashboard',
      'Inventory management',
      'Priority support',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '2,499',
    description: 'For established merchants',
    features: [
      'Unlimited products',
      'Custom domain + SSL',
      'All payment methods',
      'Advanced analytics',
      'Staff accounts',
      'API access',
      'Dedicated support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
];

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--sage)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="container-main">
        <div className="text-center mb-16">
          <span className="text-overline text-[var(--coral)] font-semibold">Pricing</span>
          <h2 className="mt-4 text-heading-1 font-display font-bold text-[var(--charcoal)]">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-body-lg text-[var(--graphite)] max-w-2xl mx-auto">
            Start for free, upgrade as you grow. All prices in Nepali Rupees per month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? 'bg-[var(--charcoal)] text-white ring-4 ring-[var(--coral)]/20 scale-[1.02]'
                  : 'card'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--coral)] text-white text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold ${plan.highlighted ? 'text-white' : 'text-[var(--charcoal)]'}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-body-sm mt-1 ${plan.highlighted ? 'text-white/70' : 'text-[var(--slate)]'}`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-overline text-[var(--mist)]">NPR</span>
                <span
                  className={`text-display-2 font-display font-bold ${plan.highlighted ? 'text-white' : 'text-[var(--charcoal)]'}`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-body-sm ${plan.highlighted ? 'text-white/60' : 'text-[var(--slate)]'}`}
                >
                  /month
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckIcon />
                    <span
                      className={`text-body-sm ${plan.highlighted ? 'text-white/80' : 'text-[var(--graphite)]'}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block text-center w-full py-3 px-6 rounded-full font-medium text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-white text-[var(--charcoal)] hover:bg-[var(--cream)]'
                    : 'btn-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
