import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 badge mb-8 opacity-0 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[var(--sage)]" />
            Now available for Nepali merchants
          </div>

          <h1 className="text-display-1 font-display font-bold text-[var(--charcoal)] opacity-0 animate-fade-in-up delay-100">
            Launch Your <span className="text-gradient">Online Store</span> in Minutes
          </h1>

          <p className="mt-6 text-body-lg text-[var(--graphite)] max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
            Baazarify is the all-in-one e-commerce platform built for Nepal. Create your store,
            manage products, accept local payments, and grow your business online.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
            <Link href="/register" className="btn-primary text-base">
              Start Selling Free
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base">
              See How It Works
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[var(--slate)] opacity-0 animate-fade-in-up delay-400">
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--sage)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--sage)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Free plan available
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--sage)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Setup in 5 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
