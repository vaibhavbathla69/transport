"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight as faArrowRightIcon,
  faPhone as faPhoneIcon,
  faShieldHalved as faShieldHalvedIcon,
  faTruckFast as faTruckFastIcon,
} from "@fortawesome/free-solid-svg-icons";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function TruckIcon() {
  return (
    <FontAwesomeIcon
      icon={faTruckFastIcon}
      className="text-[1.5rem] text-black"
    />
  );
}

type NavKey = "services" | "sectors" | "approach" | "quote";

export default function LogisticsWebsiteMockup() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const navRouteRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLAnchorElement | null>(null);
  const sectorsRef = useRef<HTMLAnchorElement | null>(null);
  const approachRef = useRef<HTMLAnchorElement | null>(null);
  const quoteRef = useRef<HTMLAnchorElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.42,
  });
  const heroY = useTransform(smoothProgress, [0, 0.22], [0, -34]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.22], [1, 0.78]);
  const visualY = useTransform(smoothProgress, [0, 0.3], [0, -24]);
  const visualScale = useTransform(smoothProgress, [0, 0.3], [1, 1.035]);
  const truckLift = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -1.5, 0, -1.5, 0]
  );

  const [activeStop, setActiveStop] = useState(0);
  const [truckLeft, setTruckLeft] = useState(0);
  const [navPositions, setNavPositions] = useState<number[]>([0, 120, 240, 360]);

  const services = [
    {
      number: "01",
      title: "Dedicated Transport Services",
      description:
        "Reliable dedicated transport solutions for scheduled deliveries, recurring routes, contract work, and time-sensitive commercial requirements.",
    },
    {
      number: "02",
      title: "Same Day Delivery",
      description:
        "Responsive same-day delivery support for urgent consignments, priority movements, and business-critical deadlines.",
    },
    {
      number: "03",
      title: "Warehousing & Distribution",
      description:
        "Flexible warehousing and distribution support to help businesses manage stock movement, storage, and onward delivery more efficiently.",
    },
  ];

  const sectors = [
    "Manufacturing",
    "Retail",
    "Distribution",
    "E-commerce",
    "Supply Chain Partners",
    "Time-Critical Operations",
  ];

  const principles = [
    {
      title: "Clear communication",
      text: "A straightforward and professional approach that makes it easy for clients to understand services, coverage, and next steps.",
    },
    {
      title: "Dependable service",
      text: "A strong focus on reliability, responsiveness, and delivering on agreed transport requirements.",
    },
    {
      title: "Professional presence",
      text: "A clean and credible digital presence that helps reinforce trust with partners, subcontractors, and potential clients.",
    },
  ];

  const routeStops = useMemo(
    () => [
      { label: "Start", threshold: 0.04 },
      { label: "Services", threshold: 0.18 },
      { label: "Sectors", threshold: 0.4 },
      { label: "Approach", threshold: 0.6 },
      { label: "Quote", threshold: 0.8 },
      { label: "Contact", threshold: 0.94 },
    ],
    []
  );

  useEffect(() => {
    const updatePositions = () => {
      if (!navRouteRef.current) return;

      const containerRect = navRouteRef.current.getBoundingClientRect();
      const refs = [servicesRef, sectorsRef, approachRef, quoteRef];
      const nextPositions = refs.map((itemRef) => {
        const el = itemRef.current;
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.left - containerRect.left + rect.width / 2 - 16;
      });

      if (nextPositions.every((value) => Number.isFinite(value))) {
        setNavPositions(nextPositions);
        setTruckLeft(nextPositions[0] ?? 0);
      }
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);
    return () => window.removeEventListener("resize", updatePositions);
  }, []);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    let current = 0;
    for (let i = 0; i < routeStops.length; i += 1) {
      if (latest >= routeStops[i].threshold) current = i;
    }
    setActiveStop(current);

    const sectionThresholds = [
      routeStops[1].threshold,
      routeStops[2].threshold,
      routeStops[3].threshold,
      routeStops[4].threshold,
    ];

    if (latest <= sectionThresholds[0]) {
      setTruckLeft(navPositions[0] ?? 0);
      return;
    }

    if (latest >= sectionThresholds[sectionThresholds.length - 1]) {
      setTruckLeft(navPositions[navPositions.length - 1] ?? 0);
      return;
    }

    for (let i = 0; i < sectionThresholds.length - 1; i += 1) {
      const start = sectionThresholds[i];
      const end = sectionThresholds[i + 1];
      if (latest >= start && latest <= end) {
        const localProgress = (latest - start) / (end - start);
        const startX = navPositions[i] ?? 0;
        const endX = navPositions[i + 1] ?? startX;
        setTruckLeft(startX + (endX - startX) * localProgress);
        return;
      }
    }
  });

  const activeNavKey: NavKey | null =
    activeStop === 1
      ? "services"
      : activeStop === 2
        ? "sectors"
        : activeStop === 3
          ? "approach"
          : activeStop === 4
            ? "quote"
            : null;

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white text-[#111111] [font-family:'Inter',ui-sans-serif,system-ui,sans-serif]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap');
        .font-display { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <header className="sticky top-0 z-40 bg-white/96 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-6 py-6 md:px-10 xl:px-16">
          <div className="flex items-center">
            <img
              src="/provida-logo.jpeg"
              alt="Provida Transport logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="hidden lg:block">
            <nav className="relative flex items-center gap-3 pb-5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-black/56">
              <a
                ref={servicesRef}
                href="#services"
                className={`rounded-full px-3 py-1.5 transition ${
                  activeNavKey === "services"
                    ? "bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.06)]"
                    : "hover:text-black"
                }`}
              >
                Services
              </a>
              <a
                ref={sectorsRef}
                href="#sectors"
                className={`rounded-full px-3 py-1.5 transition ${
                  activeNavKey === "sectors"
                    ? "bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.06)]"
                    : "hover:text-black"
                }`}
              >
                Sectors
              </a>
              <a
                ref={approachRef}
                href="#approach"
                className={`rounded-full px-3 py-1.5 transition ${
                  activeNavKey === "approach"
                    ? "bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.06)]"
                    : "hover:text-black"
                }`}
              >
                Approach
              </a>
              <a
                ref={quoteRef}
                href="#quote"
                className={`rounded-full px-3 py-1.5 transition ${
                  activeNavKey === "quote"
                    ? "bg-white text-black shadow-[0_8px_18px_rgba(0,0,0,0.06)]"
                    : "hover:text-black"
                }`}
              >
                Quote
              </a>

              <div
                ref={navRouteRef}
                className="pointer-events-none absolute inset-x-0 bottom-0"
              >
                <div className="relative h-5">
                  <motion.div
                    className="absolute top-[2px] z-10"
                    animate={{ left: truckLeft }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 28,
                      mass: 0.32,
                    }}
                    style={{ y: truckLift }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
                      <TruckIcon />
                    </div>
                  </motion.div>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden rounded-full border border-black/20 px-7 py-3 text-[0.82rem] font-medium tracking-[-0.02em] text-black lg:inline-flex"
            >
              Let&apos;s talk
            </a>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-black/25 text-[1.15rem] text-black">
              ☰
            </button>
          </div>
        </div>
      </header>

      <section id="hero" className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-[1520px] px-6 pb-20 pt-12 md:px-10 md:pb-24 xl:px-16 xl:pb-28">
          <motion.div className="relative" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="max-w-[1260px]">
              <h1 className="font-display text-[4.3rem] font-semibold leading-[0.92] tracking-[-0.08em] text-black md:text-[6.6rem] xl:text-[8.8rem]">
                Reliable
                <br />
                <span className="text-black/72">Transport</span> Solutions
              </h1>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 grid items-end gap-8 xl:grid-cols-[0.9fr_0.9fr_0.5fr]"
            style={{ y: visualY, scale: visualScale }}
          >
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[1.25rem] font-semibold text-white">
                24
              </div>
              <div className="text-[1.6rem] leading-none tracking-[-0.03em] text-black/52 md:text-[2rem]">
                Hour delivery
                <br />
                support
              </div>
            </div>

            <div className="max-w-[520px] justify-self-start text-[1.2rem] leading-[1.45] tracking-[-0.02em] text-black md:justify-self-center md:text-[1.35rem]">
              Provida Transport delivers dependable logistics support, dedicated
              transport, and same-day delivery solutions for businesses across
              the UK.
            </div>

            <div className="justify-self-start xl:justify-self-end">
              <a
                href="#quote"
                className="inline-flex items-center justify-center rounded-full bg-black px-12 py-5 text-[1rem] font-semibold tracking-[-0.02em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)] transition hover:opacity-90"
              >
                Request Quote
              </a>
            </div>
          </motion.div>

          <motion.div className="mt-16 flex justify-center" style={{ y: visualY }}>
            <div className="h-10 w-full max-w-[560px] rounded-full bg-[linear-gradient(90deg,#050505_0%,#111111_38%,#3b3b3b_72%,#1a1a1a_100%)] shadow-[0_10px_28px_rgba(0,0,0,0.08)]" />
          </motion.div>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-[1440px] px-6 py-22 md:px-10 md:py-28 xl:px-16"
      >
        <div className="grid gap-14 xl:grid-cols-[0.72fr_1.28fr] xl:gap-20">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Services
            </div>
            <h2 className="font-display mt-4 text-[2.02rem] leading-[1.04] tracking-[-0.04em] md:text-[2.75rem]">
              Core transport services presented with clarity.
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-7 text-black/62">
              Whether a client needs urgent delivery support or a dependable
              logistics partner for ongoing work, the service offering should be
              quick to understand and easy to trust.
            </p>
          </div>

          <div className="border-t border-black/10">
            {services.map((service) => (
              <div
                key={service.title}
                className="grid gap-4 border-b border-black/10 py-8 md:grid-cols-[90px_1fr_1.08fr] md:gap-8"
              >
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-black/34">
                  {service.number}
                </div>
                <h3 className="font-display text-[1.3rem] leading-[1.08] tracking-[-0.03em] md:text-[1.6rem]">
                  {service.title}
                </h3>
                <p className="max-w-xl text-[0.96rem] leading-7 text-black/62">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/6 bg-[#111111] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-18 md:px-10 md:py-20 xl:grid-cols-[0.88fr_1.12fr] xl:gap-20 xl:px-16">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-white/40">
              Credibility
            </div>
            <h2 className="font-display mt-4 text-[1.95rem] leading-[1.06] tracking-[-0.04em] md:text-[2.7rem]">
              A website built to reinforce trust from the first visit.
            </h2>
          </div>
          <div className="max-w-2xl text-[1.02rem] leading-8 text-white/68">
            In logistics, first impressions matter. Many visitors arrive
            through referrals, supplier introductions, or direct
            recommendations, and the website often acts as a quick credibility
            check before they pick up the phone or request a quote.
          </div>
        </div>
      </section>

      <section id="sectors" className="bg-white text-black">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-22 md:px-10 md:py-28 xl:grid-cols-[0.84fr_1.16fr] xl:gap-20 xl:px-16">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Who we work with
            </div>
            <h2 className="font-display mt-4 text-[2rem] leading-[1.04] tracking-[-0.04em] md:text-[2.75rem]">
              Who we work with.
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-7 text-black/62">
              Provida Transport is positioned for commercial clients who need a
              transport partner that communicates clearly, responds quickly, and
              delivers reliably.
            </p>
          </div>

          <div className="grid gap-[1px] overflow-hidden rounded-[1.7rem] bg-black/10">
            {sectors.map((sector) => (
              <div
                key={sector}
                className="flex items-center justify-between bg-white px-6 py-5 md:px-8"
              >
                <div className="text-[1rem] font-semibold tracking-[-0.01em] text-black">
                  {sector}
                </div>
                <FontAwesomeIcon
                  icon={faArrowRightIcon}
                  className="text-[0.82rem] text-black/32"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="approach"
        className="mx-auto max-w-[1440px] px-6 py-22 md:px-10 md:py-28 xl:px-16"
      >
        <div className="grid gap-10 xl:grid-cols-[0.76fr_1.24fr] xl:gap-20">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Approach
            </div>
            <h2 className="font-display mt-4 text-[2rem] leading-[1.04] tracking-[-0.04em] md:text-[2.75rem]">
              Why businesses choose Provida Transport.
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-7 text-black/62">
              The website should help prospective clients understand not just
              what Provida does, but why the business is a dependable partner to
              work with.
            </p>
          </div>

          <div className="grid gap-[1px] overflow-hidden rounded-[1.7rem] bg-black/10">
            {principles.map((item) => (
              <div
                key={item.title}
                className="grid gap-4 bg-white px-6 py-6 md:grid-cols-[220px_1fr] md:px-8"
              >
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-black/36">
                  {item.title}
                </div>
                <p className="max-w-xl text-[0.96rem] leading-7 text-black/62">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="border-y border-black/8 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-6 py-22 md:px-10 md:py-28 xl:grid-cols-[0.8fr_1.2fr] xl:gap-20 xl:px-16">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Request a Quote
            </div>
            <h2 className="font-display mt-4 text-[2rem] leading-[1.04] tracking-[-0.04em] md:text-[2.75rem]">
              Request a quote.
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-7 text-black/62">
              A simple enquiry form gives prospective clients a direct way to
              discuss delivery requirements, recurring transport needs, or
              distribution support.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_22px_60px_rgba(0,0,0,0.05)] md:p-10 xl:p-12">
            <div className="grid gap-4">
              <input
                className="rounded-[1rem] border border-black/10 bg-white px-4 py-4 text-[0.96rem] outline-none transition focus:border-black/30"
                placeholder="Company name"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="rounded-[1rem] border border-black/10 bg-white px-4 py-4 text-[0.96rem] outline-none transition focus:border-black/30"
                  placeholder="Contact name"
                />
                <input
                  className="rounded-[1rem] border border-black/10 bg-white px-4 py-4 text-[0.96rem] outline-none transition focus:border-black/30"
                  placeholder="Email address"
                />
              </div>
              <textarea
                className="min-h-[170px] rounded-[1rem] border border-black/10 bg-white px-4 py-4 text-[0.96rem] outline-none transition focus:border-black/30"
                placeholder="Tell us about your transport, delivery, or distribution requirements"
              />
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90">
                Submit Quote Request
                <FontAwesomeIcon
                  icon={faArrowRightIcon}
                  className="text-[0.82rem]"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-[1440px] px-6 py-22 md:px-10 md:py-28 xl:px-16"
      >
        <div className="grid gap-8 border-t border-black/10 pt-10 md:grid-cols-[1fr_1fr] xl:grid-cols-[0.84fr_1.16fr]">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Contact
            </div>
            <h2 className="font-display mt-4 text-[1.95rem] leading-[1.06] tracking-[-0.04em] md:text-[2.55rem]">
              Get in touch with Provida Transport.
            </h2>
            <p className="mt-5 max-w-md text-[0.98rem] leading-7 text-black/62">
              Whether you need a one-off urgent movement or a longer-term
              logistics partner, Provida Transport can be contacted quickly to
              discuss requirements and provide a tailored quote.
            </p>
          </div>

          <div className="grid gap-[1px] overflow-hidden rounded-[1.7rem] bg-black/10">
            <div className="grid gap-5 bg-white px-6 py-6 md:grid-cols-[150px_1fr] md:px-8">
              <div className="text-[0.58rem] uppercase tracking-[0.24em] text-black/35">
                Telephone
              </div>
              <div className="flex items-center gap-3 text-[0.98rem] font-semibold text-black">
                <FontAwesomeIcon icon={faPhoneIcon} className="text-[0.82rem]" />
                01234 567890
              </div>
            </div>
            <div className="grid gap-5 bg-white px-6 py-6 md:grid-cols-[150px_1fr] md:px-8">
              <div className="text-[0.58rem] uppercase tracking-[0.24em] text-black/35">
                Email
              </div>
              <div className="text-[0.98rem] font-semibold text-black">
                info@providatransport.co.uk
              </div>
            </div>
            <div className="grid gap-5 bg-white px-6 py-6 md:grid-cols-[150px_1fr] md:px-8">
              <div className="text-[0.58rem] uppercase tracking-[0.24em] text-black/35">
                Hours
              </div>
              <div className="text-[0.98rem] font-semibold text-black">
                Monday to Friday, 8:00am – 6:00pm
              </div>
            </div>
            <div className="grid gap-5 bg-white px-6 py-6 md:grid-cols-[150px_1fr] md:px-8">
              <div className="text-[0.58rem] uppercase tracking-[0.24em] text-black/35">
                Coverage
              </div>
              <div className="text-[0.98rem] font-semibold text-black">
                UK-wide transport and logistics support
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/8 bg-white px-6 py-7 text-center text-[0.72rem] uppercase tracking-[0.16em] text-black/36 md:px-10 xl:px-16">
        © 2026 Provida Transport. All rights reserved.
      </footer>
    </div>
  );
}
