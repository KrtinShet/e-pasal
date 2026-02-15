const steps = [
  {
    number: '01',
    title: 'Create Your Store',
    description:
      'Sign up for free and set up your store in minutes. Choose a subdomain, add your logo, and pick a theme that matches your brand.',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Add Your Products',
    description:
      'Upload your catalog with photos, descriptions, and pricing. Organize with categories and manage inventory with ease.',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Start Selling',
    description:
      'Share your store link and start accepting orders. Track sales, manage fulfillments, and watch your business grow.',
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="container-main">
        <div className="text-center mb-16">
          <span className="text-overline text-[var(--primary-main)] font-semibold">
            How It Works
          </span>
          <h2 className="mt-4 text-heading-1 font-display font-bold text-[var(--grey-900)]">
            Three Steps to Your Online Store
          </h2>
          <p className="mt-4 text-body-lg text-[var(--graphite)] max-w-2xl mx-auto">
            Getting started with Baazarify is simple. No technical knowledge required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px border-t-2 border-dashed border-[var(--grey-200)]" />
              )}
              <div className="relative mx-auto w-20 h-20 rounded-full bg-[var(--peach-light)] flex items-center justify-center text-[var(--primary-main)] mb-6">
                {step.icon}
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--grey-900)] text-white text-sm font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-heading-3 font-semibold text-[var(--grey-900)] mb-3">
                {step.title}
              </h3>
              <p className="text-body text-[var(--graphite)] max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
