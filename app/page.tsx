"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight as faArrowRightIcon,
} from "@fortawesome/free-solid-svg-icons";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";

type NavKey = "services" | "sectors" | "contact";

type QuoteFormData = {
  companyName: string;
  contactName: string;
  email: string;
  requirements: string;
  website: string;
};

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "services", label: "Services", href: "#hero" },
  { key: "sectors", label: "Sectors", href: "#sectors" },
  { key: "contact", label: "Contact", href: "#contact" },
];

const navThresholds: Array<{ key: NavKey; threshold: number }> = [
  { key: "services", threshold: 0.16 },
  { key: "sectors", threshold: 0.39 },
  { key: "contact", threshold: 0.84 },
];

export default function LogisticsWebsiteMockup() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const services = [
    {
      number: "01",
      title: "Dedicated Transport Services",
      description:
        "Reliable dedicated transport support for scheduled deliveries, recurring routes, contract work, and time-sensitive commercial requirements.",
    },
    {
      number: "02",
      title: "Same Day Delivery",
      description:
        "Responsive same-day delivery cover for urgent consignments, priority movements, and business-critical deadlines.",
    },
    {
      number: "03",
      title: "Transport Consulting",
      description:
        "Professional consulting support focused on compliance, transport management services, and efficient route planning for reliable, scalable logistics operations.",
    },
  ];

  const sectors = [
    {
      title: "General Haulage",
      description: "Scheduled and ad-hoc transport support for commercial loads.",
    },
    {
      title: "Refrigerated",
      description: "Temperature-controlled transport for time-sensitive consignments.",
    },
    {
      title: "Containers",
      description: "Container movements originating from the port handled with dependable planning and coordination.",
    },
    {
      title: "Waste & Recycling",
      description: "Reliable transport support for regulated waste and recycling operations.",
    },
    {
      title: "Pallet Network",
      description: "Efficient pallet distribution support for consistent day-to-day delivery work.",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.52,
  });
  const heroY = useTransform(smoothProgress, [0, 0.18], [0, -28]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0.84]);
  const heroDetailY = useTransform(smoothProgress, [0, 0.24], [0, -16]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState<NavKey | null>(null);
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    companyName: "",
    contactName: "",
    email: "",
    requirements: "",
    website: "",
  });
  const [quoteStatus, setQuoteStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    let currentKey: NavKey | null = null;

    for (const item of navThresholds) {
      if (latest >= item.threshold) currentKey = item.key;
    }

    setActiveNavKey((prev) => (prev === currentKey ? prev : currentKey));
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const motionEnabled = !shouldReduceMotion;

  const handleQuoteChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setQuoteForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleQuoteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingQuote(true);
    setQuoteStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: quoteForm.companyName,
          contactName: quoteForm.contactName,
          email: quoteForm.email,
          requirements: quoteForm.requirements,
          website: quoteForm.website,
        }),
      });

      const result = (await response.json()) as {
        errors?: Array<{ message?: string }>;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.message ||
            result.message ||
            "Unable to submit your request."
        );
      }

      setQuoteForm({
        companyName: "",
        contactName: "",
        email: "",
        requirements: "",
        website: "",
      });
      setQuoteStatus({
        type: "success",
        message: "Thanks. Your quote request has been sent successfully.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to submit your request right now.";

      setQuoteStatus({ type: "error", message });
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white text-[#111111] [font-family:'Inter',ui-sans-serif,system-ui,sans-serif]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap');
        .font-display { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <header className="sticky top-0 z-[100] border-b border-black/6 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-6 py-3 sm:px-8 md:px-10 md:py-5 xl:px-16">
          <a href="#" className="flex items-center">
            <img
              src="/provida-logo.jpeg"
              alt="Provida Transport logo"
              className="h-24 w-auto object-contain sm:h-26 md:h-28"
            />
          </a>

          <div className="hidden lg:block">
            <nav className="flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-black/48">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`rounded-full px-5 py-2.5 transition ${
                    activeNavKey === item.key
                      ? "bg-black/[0.03] text-black"
                      : "hover:text-black"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#quote"
              className="group relative hidden items-center justify-center overflow-hidden rounded-full bg-black px-4 py-2 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-white transition hover:opacity-95 sm:px-4.5 sm:text-[0.7rem] lg:hidden"
            >
              <span className="pointer-events-none absolute inset-y-[2px] left-[-18%] w-[34%] skew-x-[-20deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.32)_50%,rgba(255,255,255,0.08)_55%,transparent_100%)] transition-transform duration-700 ease-out group-hover:translate-x-[320%]" />
              <span className="relative z-10 font-bold tracking-[0.16em] text-white">
                REQUEST QUOTE
              </span>
            </a>
            <a
              href="#quote"
              className="group relative hidden items-center justify-center overflow-hidden rounded-full bg-black px-5.5 py-2.5 text-[0.76rem] font-semibold tracking-[-0.02em] text-white transition hover:opacity-95 lg:inline-flex"
            >
              <span className="pointer-events-none absolute inset-y-[2px] left-[-18%] w-[34%] skew-x-[-20deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.32)_50%,rgba(255,255,255,0.08)_55%,transparent_100%)] transition-transform duration-700 ease-out group-hover:translate-x-[320%]" />
              <span className="relative z-10 font-bold uppercase tracking-[0.12em] text-white">
                REQUEST QUOTE
              </span>
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/12 bg-white text-black transition hover:bg-black hover:text-white lg:hidden"
            >
              {menuOpen ? (
                <span className="relative block h-5 w-5">
                  <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current" />
                </span>
              ) : (
                <span className="flex flex-col gap-[3px]">
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[90] bg-white/96 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex min-h-screen flex-col px-4 pb-8 pt-32 sm:px-6 sm:pt-34">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[1.2rem] border border-black/8 px-5 py-4 text-[0.86rem] font-semibold uppercase tracking-[0.16em] text-black"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 grid gap-3">
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-black"
                >
                  Contact
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section
        id="hero"
        className="relative scroll-mt-28 overflow-hidden bg-white sm:scroll-mt-32"
      >
        <div className="mx-auto max-w-[1520px] px-4 pb-7 pt-7 sm:px-6 sm:pb-9 sm:pt-4 md:px-10 md:pb-12 md:pt-6 xl:px-16 xl:pb-16 xl:pt-8">
          <motion.div
            className="grid gap-4 sm:gap-5"
            style={motionEnabled ? { y: heroY, opacity: heroOpacity } : undefined}
          >
            <div className="max-w-none pb-2 lg:pt-2 lg:pb-0 xl:pt-3">
              <h1 className="font-display max-w-none text-[2.35rem] leading-[0.97] tracking-[-0.05em] text-black sm:text-[3rem] md:text-[3.8rem] lg:text-[4.35rem] xl:text-[4.9rem]">
                <span className="inline">Transport, </span>
                <span className="inline text-black/64">
                  done right
                </span>
              </h1>
            </div>

            <motion.div
              className="max-w-none lg:mt-2"
              style={motionEnabled ? { y: heroDetailY } : undefined}
            >
              <div className="rounded-[1.6rem] border border-black/8 bg-black/[0.02] p-5 sm:rounded-[2rem] sm:p-7 md:p-8">
                <p className="text-[1.03rem] leading-7 tracking-[-0.02em] text-black sm:text-[1.1rem] sm:leading-8 md:text-[1.16rem]">
                  At Provida Transport, we deliver dependable, competitively
                  priced haulage services across the UK. With over a decade of
                  industry experience behind us, we pride ourselves on
                  reliability, efficiency, and a service you can trust every
                  load.
                </p>

                <div className="mt-6 grid gap-5 border-t border-black/8 pt-5 sm:mt-7 sm:grid-cols-2 sm:gap-6 sm:pt-6 lg:grid-cols-2">
                  {services.map((service) => (
                    <div key={service.number} className="grid gap-2">
                      <div className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-black/38">
                        {service.number}
                      </div>
                      <div className="text-[1.14rem] font-semibold tracking-[-0.02em] text-black sm:text-[1.22rem] md:text-[1.28rem]">
                        {service.title}
                      </div>
                      <p className="text-[0.96rem] leading-7 text-black/58 sm:text-[1rem]">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        id="sectors"
        className="scroll-mt-28 bg-[#0d0d0d] text-white sm:scroll-mt-32"
      >
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 xl:px-16 xl:py-24">
          <div className="grid gap-8 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.015)_100%)] px-5 py-7 sm:rounded-[2.2rem] sm:px-7 sm:py-9 md:px-10 md:py-12 xl:gap-10 xl:px-14">
            <div>
              <h2 className="font-display max-w-[520px] text-[1.72rem] leading-[1.04] tracking-[-0.05em] text-white sm:text-[2rem] md:text-[2.7rem]">
                Our fleet keeps you moving.
              </h2>
            </div>

            <div className="grid gap-5">
              <p className="max-w-[920px] text-[0.94rem] leading-7 text-white/70 sm:text-[1.02rem] sm:leading-8">
                Our fleet of articulated vehicles and trailers, from
                curtainsiders to skeletons, is built to handle a wide range of
                transport demands with precision and reliability. We offer the
                following haulage services:
              </p>
            </div>

            <div className="grid gap-3 pt-2 sm:pt-3">
            {sectors.map((sector, index) => (
              <div
                key={sector.title}
                className="rounded-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.018)_100%)] px-4 py-4 sm:rounded-[1.45rem] sm:px-6 sm:py-5 md:px-7 md:py-6"
              >
                <div className="grid gap-2 md:grid-cols-[72px_1fr] md:gap-5">
                  <div className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/38 sm:text-[0.6rem]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-[0.98rem] font-semibold tracking-[-0.015em] text-white sm:text-[1.05rem]">
                      {sector.title}
                    </div>
                    <p className="mt-2 max-w-[560px] text-[0.88rem] leading-6 text-white/62 sm:text-[0.92rem]">
                      {sector.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="quote"
        className="scroll-mt-28 border-y border-black/8 bg-[#fbfbfb] sm:scroll-mt-32"
      >
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 sm:py-18 md:px-10 md:py-24 xl:grid-cols-[0.78fr_1.22fr] xl:gap-18 xl:px-16 xl:py-28">
          <div className="text-left">
            <h2 className="font-display max-w-[420px] text-[1.7rem] leading-[1.04] tracking-[-0.05em] text-black sm:text-[1.95rem] md:text-[2.6rem]">
              Request a quote.
            </h2>
            <p className="mt-4 max-w-md text-[0.94rem] leading-7 text-black/62 sm:mt-5 sm:text-[0.98rem]">
              Share your requirements and we&apos;ll come back with a tailored
              solution you can rely on.
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-black/8 bg-white p-5 shadow-[0_20px_45px_rgba(0,0,0,0.045)] sm:rounded-[2rem] sm:p-7 md:p-9 xl:p-11">
            <form className="grid gap-4" onSubmit={handleQuoteSubmit} noValidate>
              <input
                name="companyName"
                value={quoteForm.companyName}
                onChange={handleQuoteChange}
                className="rounded-[1rem] border border-black/10 bg-[#fcfcfc] px-4 py-4 text-[0.94rem] text-black outline-none transition placeholder:text-black/30 focus:border-black/26 sm:text-[0.96rem]"
                placeholder="Company name"
                autoComplete="organization"
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="contactName"
                  value={quoteForm.contactName}
                  onChange={handleQuoteChange}
                  className="rounded-[1rem] border border-black/10 bg-[#fcfcfc] px-4 py-4 text-[0.94rem] text-black outline-none transition placeholder:text-black/30 focus:border-black/26 sm:text-[0.96rem]"
                  placeholder="Contact name"
                  autoComplete="name"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={quoteForm.email}
                  onChange={handleQuoteChange}
                  className="rounded-[1rem] border border-black/10 bg-[#fcfcfc] px-4 py-4 text-[0.94rem] text-black outline-none transition placeholder:text-black/30 focus:border-black/26 sm:text-[0.96rem]"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                />
              </div>
              <input
                name="website"
                value={quoteForm.website}
                onChange={handleQuoteChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <textarea
                name="requirements"
                value={quoteForm.requirements}
                onChange={handleQuoteChange}
                className="min-h-[160px] rounded-[1rem] border border-black/10 bg-[#fcfcfc] px-4 py-4 text-[0.94rem] text-black outline-none transition placeholder:text-black/30 focus:border-black/26 sm:min-h-[170px] sm:text-[0.96rem]"
                placeholder="Tell us about your transport, delivery, or distribution requirements"
                required
              />
              {quoteStatus.type !== "idle" ? (
                <div
                  className={`rounded-[1rem] border px-4 py-3 text-[0.84rem] leading-6 ${
                    quoteStatus.type === "success"
                      ? "border-black/12 bg-black/[0.03] text-black/72"
                      : "border-black/14 bg-black/[0.02] text-black/62"
                  }`}
                >
                  {quoteStatus.message}
                </div>
              ) : null}
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-black/34 sm:text-[0.78rem] sm:tracking-[0.18em]">
                  We aim to respond within 24 hours.
                </p>
                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmittingQuote ? "Submitting..." : "Submit"}
                  <FontAwesomeIcon
                    icon={faArrowRightIcon}
                    className="text-[0.82rem]"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-16 sm:px-6 sm:scroll-mt-32 sm:py-18 md:px-10 md:py-24 xl:px-16 xl:py-28"
      >
        <div className="grid gap-8 border-t border-black/10 pt-8 sm:pt-10 md:gap-10 xl:grid-cols-[0.82fr_1.18fr] xl:items-start">
          <div className="text-left">
            <h2 className="font-display max-w-[450px] text-[1.7rem] leading-[1.04] tracking-[-0.05em] text-black sm:text-[1.95rem] md:text-[2.5rem]">
              Get in touch with Provida Transport.
            </h2>
          </div>

          <div className="grid gap-3 xl:max-w-[620px] xl:justify-self-start">
            <div className="grid gap-2 px-1 py-1 sm:gap-2.5">
              <div className="text-[0.56rem] uppercase tracking-[0.22em] text-black/35 sm:text-[0.58rem] sm:tracking-[0.24em]">
                Address
              </div>
              <div className="text-[0.95rem] font-semibold tracking-[-0.01em] text-black sm:text-[0.98rem]">
                403 Copperbox, 66 High Street, Harborne, Birmingham, B17 9BF
              </div>
            </div>
            <div className="grid gap-2 px-1 py-1 sm:gap-2.5">
              <div className="text-[0.56rem] uppercase tracking-[0.22em] text-black/35 sm:text-[0.58rem] sm:tracking-[0.24em]">
                Email
              </div>
              <div className="text-[0.95rem] font-semibold tracking-[-0.01em] text-black sm:text-[0.98rem]">
                enquiries@providatransport.com
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/8 bg-white px-4 py-6 text-center text-[0.68rem] uppercase tracking-[0.14em] text-black/36 sm:px-6 sm:py-7 sm:text-[0.72rem] sm:tracking-[0.16em] md:px-10 xl:px-16">
        Â© 2026 Provida Transport. All rights reserved.
      </footer>
    </div>
  );
}

