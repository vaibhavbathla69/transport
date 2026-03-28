"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DotLottieReact,
  type DotLottieInstance,
} from "@lottiefiles/dotlottie-react";
import {
  faArrowRight as faArrowRightIcon,
  faPhone as faPhoneIcon,
  faShieldHalved as faShieldHalvedIcon,
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
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";

type NavKey = "services" | "sectors" | "approach" | "quote";

type NavPositions = Record<NavKey, number>;

type QuoteFormData = {
  companyName: string;
  contactName: string;
  email: string;
  requirements: string;
  website: string;
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xreoejgv";

const navKeys: NavKey[] = ["services", "sectors", "approach", "quote"];

const navItems: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "services", label: "Services", href: "#services" },
  { key: "sectors", label: "Sectors", href: "#sectors" },
  { key: "approach", label: "Approach", href: "#approach" },
  { key: "quote", label: "Quote", href: "#quote" },
];

const navThresholds: Array<{ key: NavKey; threshold: number }> = [
  { key: "services", threshold: 0.16 },
  { key: "sectors", threshold: 0.39 },
  { key: "approach", threshold: 0.61 },
  { key: "quote", threshold: 0.8 },
];

export default function LogisticsWebsiteMockup() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const navRouteRef = useRef<HTMLDivElement | null>(null);
  const truckAnimationRef = useRef<DotLottieInstance | null>(null);
  const previousTruckLeftRef = useRef<number | null>(null);
  const servicesRef = useRef<HTMLAnchorElement | null>(null);
  const sectorsRef = useRef<HTMLAnchorElement | null>(null);
  const approachRef = useRef<HTMLAnchorElement | null>(null);
  const quoteRef = useRef<HTMLAnchorElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const navRefs = useMemo(
    () => ({
      services: servicesRef,
      sectors: sectorsRef,
      approach: approachRef,
      quote: quoteRef,
    }),
    []
  );

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
      text: "Straightforward updates, clear expectations, and a direct commercial approach from first enquiry to delivery.",
    },
    {
      title: "Dependable execution",
      text: "A strong focus on responsiveness, reliability, and delivering transport requirements exactly as agreed.",
    },
    {
      title: "Professional presence",
      text: "A credible, well-presented business that gives partners and clients confidence from the first interaction.",
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
  const heroRailScale = useTransform(smoothProgress, [0, 0.2], [1, 1.015]);
  const truckLift = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, -0.75, 0, -0.75, 0]
  );

  const [navPositions, setNavPositions] = useState<NavPositions>({
    services: 0,
    sectors: 108,
    approach: 216,
    quote: 324,
  });
  const [showLoader, setShowLoader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState<NavKey | null>(null);
  const [truckLeft, setTruckLeft] = useState(0);
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

  useEffect(() => {
    const updatePositions = () => {
      if (!navRouteRef.current) return;

      const containerRect = navRouteRef.current.getBoundingClientRect();
      const nextPositions = navKeys.reduce((acc, key) => {
        const element = navRefs[key].current;
        if (!element) return acc;

        const rect = element.getBoundingClientRect();
        acc[key] = rect.left - containerRect.left + rect.width / 2 - 18;
        return acc;
      }, {} as NavPositions);

      if (navKeys.every((key) => Number.isFinite(nextPositions[key]))) {
        setNavPositions(nextPositions);
        setTruckLeft((current) => {
          if (!activeNavKey) return nextPositions.services;
          return nextPositions[activeNavKey];
        });
      }
    };

    updatePositions();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updatePositions)
        : null;

    if (navRouteRef.current && resizeObserver) {
      resizeObserver.observe(navRouteRef.current);
    }

    navKeys.forEach((key) => {
      const node = navRefs[key].current;
      if (node && resizeObserver) resizeObserver.observe(node);
    });

    window.addEventListener("resize", updatePositions);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePositions);
    };
  }, [activeNavKey, navRefs]);

  useEffect(() => {
    if (!activeNavKey) {
      setTruckLeft(navPositions.services);
      return;
    }

    setTruckLeft(navPositions[activeNavKey]);
  }, [activeNavKey, navPositions]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    let currentKey: NavKey | null = null;

    for (const item of navThresholds) {
      if (latest >= item.threshold) currentKey = item.key;
    }

    setActiveNavKey((prev) => (prev === currentKey ? prev : currentKey));
  });

  useEffect(() => {
    const truckAnimation = truckAnimationRef.current;
    if (!truckAnimation) return;
    if (previousTruckLeftRef.current === null) {
      previousTruckLeftRef.current = truckLeft;
      truckAnimation.setLoop(false);
      truckAnimation.pause();
      return;
    }
    if (previousTruckLeftRef.current === truckLeft) return;

    previousTruckLeftRef.current = truckLeft;
    truckAnimation.setLoop(false);
    truckAnimation.stop();
    truckAnimation.play();
  }, [truckLeft]);

  useEffect(() => {
    const truckAnimation = truckAnimationRef.current;
    if (!truckAnimation) return;

    const handleComplete = () => {
      truckAnimation.pause();
    };

    truckAnimation.setLoop(false);
    truckAnimation.pause();
    truckAnimation.addEventListener("complete", handleComplete);

    return () => {
      truckAnimation.removeEventListener("complete", handleComplete);
    };
  }, []);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => {
      setShowLoader(false);
    }, shouldReduceMotion ? 1200 : 3600);

    return () => {
      window.clearTimeout(loaderTimer);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    document.body.style.overflow = showLoader || menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, showLoader]);

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
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          companyName: quoteForm.companyName,
          contactName: quoteForm.contactName,
          email: quoteForm.email,
          requirements: quoteForm.requirements,
          _subject: `Provida quote request from ${quoteForm.companyName}`,
          _gotcha: quoteForm.website,
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

      <AnimatePresence>
        {showLoader ? (
          <motion.div
            key="loading-screen"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: motionEnabled ? 0.45 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div className="flex w-full max-w-[680px] flex-col items-center px-6 text-center sm:px-8">
              <img
                src="/provida-logo.jpeg"
                alt="Provida Transport logo"
                className="h-12 w-auto object-contain sm:h-14 md:h-16"
              />
              <div className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-black/42">
                Provida Transport
              </div>
              <div className="mt-10 flex items-center justify-center">
                <DotLottieReact
                  src="/Delivery Truck _ Ignite Animation.lottie"
                  autoplay
                  speed={1}
                  layout={{ fit: "contain", align: [0.5, 0.56] }}
                  renderConfig={{ autoResize: true }}
                  className="h-[150px] w-[220px] sm:h-[180px] sm:w-[260px] md:h-[220px] md:w-[340px]"
                />
              </div>
              <div className="mt-7 max-w-[300px] text-[0.74rem] uppercase tracking-[0.16em] text-black/34 sm:mt-8 sm:max-w-[340px] sm:text-[0.86rem] sm:tracking-[0.18em]">
                Dedicated transport and time-critical delivery support
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="sticky top-0 z-[100] border-b border-black/6 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-4 py-3 sm:px-6 md:px-10 md:py-5 xl:px-16">
          <a href="#hero" className="flex items-center">
            <img
              src="/provida-logo.jpeg"
              alt="Provida Transport logo"
              className="h-8 w-auto object-contain sm:h-9 md:h-11"
            />
          </a>

          <div className="hidden lg:block">
            <nav className="relative flex items-center gap-1.5 pb-4 text-[0.69rem] font-semibold uppercase tracking-[0.14em] text-black/48">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  ref={
                    item.key === "services"
                      ? servicesRef
                      : item.key === "sectors"
                        ? sectorsRef
                        : item.key === "approach"
                          ? approachRef
                          : quoteRef
                  }
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition ${
                    activeNavKey === item.key
                      ? "bg-black/[0.03] text-black"
                      : "hover:text-black"
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <div
                ref={navRouteRef}
                className="pointer-events-none absolute inset-x-0 bottom-[-6px] h-6"
              >
                <div className="absolute inset-x-1 top-4 h-[1.5px] bg-black/14" />
                <motion.div
                  className="absolute top-0 z-10"
                  animate={{ left: truckLeft }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 30,
                    mass: 0.58,
                  }}
                  style={motionEnabled ? { y: truckLift } : undefined}
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden">
                    <DotLottieReact
                      src="/Shipping.lottie"
                      speed={0.9}
                      layout={{ fit: "cover", align: [0.52, 0.56] }}
                      renderConfig={{ autoResize: true }}
                      dotLottieRefCallback={(instance) => {
                        truckAnimationRef.current = instance;
                      }}
                      className="h-9 w-9 scale-[2.85]"
                    />
                  </div>
                </motion.div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#quote"
              className="hidden rounded-full border border-black/14 px-6 py-3 text-[0.79rem] font-medium tracking-[-0.02em] text-black transition hover:bg-black hover:text-white lg:inline-flex"
            >
              Request quote
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
            <div className="flex min-h-screen flex-col px-4 pb-8 pt-22 sm:px-6">
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
                  href="#quote"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-black px-6 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] !text-white"
                >
                  Request Quote
                </a>
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

      <section id="hero" className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-[1520px] px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 md:px-10 md:pb-24 md:pt-16 xl:px-16 xl:pb-28 xl:pt-20">
          <motion.div
            className="grid gap-9 sm:gap-10 xl:grid-cols-[1.18fr_0.82fr] xl:items-end xl:gap-14"
            style={motionEnabled ? { y: heroY, opacity: heroOpacity } : undefined}
          >
            <div className="max-w-[900px]">
              <div className="mb-4 text-[0.56rem] font-semibold uppercase tracking-[0.28em] text-black/42 sm:mb-6 sm:text-[0.62rem] sm:tracking-[0.3em] md:mb-8">
                Provida Transport
              </div>
              <h1 className="font-display max-w-[860px] text-[3rem] leading-[0.92] tracking-[-0.065em] text-black sm:text-[3.8rem] md:text-[5.8rem] xl:text-[7.6rem]">
                <span className="block">Transport,</span>
                <span className="block text-black/64">done properly</span>
              </h1>
            </div>

            <motion.div
              className="max-w-none sm:max-w-[420px] xl:justify-self-end"
              style={motionEnabled ? { y: heroDetailY } : undefined}
            >
              <div className="rounded-[1.6rem] border border-black/8 bg-black/[0.02] p-5 sm:rounded-[2rem] sm:p-7 md:p-8">
                <div className="flex items-start gap-3 border-b border-black/8 pb-5 sm:items-center sm:gap-4 sm:pb-6">
                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-black text-[1rem] font-semibold text-white sm:h-15 sm:w-15 sm:text-[1.15rem]">
                    24
                  </div>
                  <div>
                    <div className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-black/42 sm:text-[0.68rem] sm:tracking-[0.24em]">
                      Operational support
                    </div>
                    <div className="mt-2 text-[1.02rem] leading-[1.12] tracking-[-0.03em] text-black sm:text-[1.14rem] md:text-[1.22rem]">
                      Same-day and scheduled transport for time-sensitive work.
                    </div>
                  </div>
                </div>

                <p className="pt-5 text-[0.96rem] leading-7 text-black/68 sm:pt-6 sm:text-[1.02rem] sm:leading-8 md:text-[1.06rem]">
                  Provida Transport delivers dependable logistics support,
                  dedicated transport, and same-day delivery solutions for
                  businesses across the UK.
                </p>

                <div className="mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <a
                    href="#quote"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-black px-7 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-95 sm:px-9 sm:text-[0.86rem]"
                  >
                    <span className="pointer-events-none absolute inset-y-[2px] left-[-18%] w-[34%] skew-x-[-20deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.32)_50%,rgba(255,255,255,0.08)_55%,transparent_100%)] transition-transform duration-700 ease-out group-hover:translate-x-[320%]" />
                    <span className="relative z-10 text-white">Request Quote</span>
                  </a>
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-6 py-4 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-black/62 transition hover:text-black sm:justify-start sm:rounded-none sm:border-0 sm:px-0 sm:py-0 sm:text-[0.85rem]"
                  >
                    View services
                    <FontAwesomeIcon
                      icon={faArrowRightIcon}
                      className="text-[0.72rem]"
                    />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 rounded-[1.6rem] border border-black/8 bg-[linear-gradient(180deg,rgba(0,0,0,0.025)_0%,rgba(0,0,0,0.01)_100%)] px-5 py-5 sm:mt-10 sm:rounded-[2rem] sm:px-6 md:mt-14 md:px-8"
            style={
              motionEnabled ? { y: heroDetailY, scale: heroRailScale } : undefined
            }
          >
            <div className="grid gap-5 md:grid-cols-3 md:gap-8">
              <div>
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-black/40 sm:text-[0.64rem] sm:tracking-[0.24em]">
                  Dedicated transport
                </div>
                <div className="mt-2 text-[0.92rem] leading-7 text-black/64 sm:text-[0.96rem]">
                  Contract routes and recurring delivery support with a clear,
                  commercial service model.
                </div>
              </div>
              <div>
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-black/40 sm:text-[0.64rem] sm:tracking-[0.24em]">
                  Same-day response
                </div>
                <div className="mt-2 text-[0.92rem] leading-7 text-black/64 sm:text-[0.96rem]">
                  Fast turnaround for urgent movements, priority consignments,
                  and time-critical requirements.
                </div>
              </div>
              <div>
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-black/40 sm:text-[0.64rem] sm:tracking-[0.24em]">
                  Distribution support
                </div>
                <div className="mt-2 text-[0.92rem] leading-7 text-black/64 sm:text-[0.96rem]">
                  Warehousing and onward delivery support to keep operations
                  moving cleanly and efficiently.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-18 md:px-10 md:py-24 xl:px-16 xl:py-28"
      >
        <div className="grid gap-10 sm:gap-12 xl:grid-cols-[0.68fr_1.32fr] xl:gap-18">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Services
            </div>
            <h2 className="font-display mt-4 max-w-[420px] text-[1.7rem] leading-[1.04] tracking-[-0.05em] text-black sm:text-[1.95rem] md:text-[2.6rem]">
              Core transport services presented with clarity.
            </h2>
            <p className="mt-4 max-w-md text-[0.94rem] leading-7 text-black/62 sm:mt-5 sm:text-[0.98rem]">
              Whether a client needs urgent delivery support or a dependable
              logistics partner for ongoing work, the service offering should be
              quick to understand and easy to trust.
            </p>
          </div>

          <div className="border-t border-black/10">
            {services.map((service) => (
              <div
                key={service.title}
                className="grid gap-3 border-b border-black/8 py-6 sm:gap-4 sm:py-8 md:grid-cols-[84px_1fr_1.04fr] md:gap-8 md:py-10"
              >
                <div className="pt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-black/34 sm:text-[0.64rem] sm:tracking-[0.22em]">
                  {service.number}
                </div>
                <h3 className="font-display max-w-[320px] text-[1.12rem] leading-[1.12] tracking-[-0.035em] text-black sm:text-[1.22rem] md:text-[1.5rem]">
                  {service.title}
                </h3>
                <p className="max-w-[520px] text-[0.93rem] leading-7 text-black/62 sm:text-[0.97rem]">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d0d0d] text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20 xl:px-16 xl:py-24">
          <div className="grid gap-8 rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.015)_100%)] px-5 py-7 sm:rounded-[2.2rem] sm:px-7 sm:py-9 md:px-10 md:py-12 xl:grid-cols-[0.92fr_1.08fr] xl:gap-18 xl:px-14">
            <div>
              <div className="text-[0.58rem] uppercase tracking-[0.28em] text-white/44">
                Credibility
              </div>
              <h2 className="font-display mt-4 max-w-[520px] text-[1.72rem] leading-[1.04] tracking-[-0.05em] text-white sm:text-[2rem] md:text-[2.7rem]">
                Built to reassure serious clients from the first visit.
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end md:gap-7">
              <p className="max-w-[720px] text-[0.94rem] leading-7 text-white/70 sm:text-[1.02rem] sm:leading-8">
                In logistics, a website often acts as a quick credibility check.
                It needs to communicate capability, reliability, and a
                professional standard without unnecessary noise.
              </p>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 px-4 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/76 sm:px-5 sm:text-[0.72rem] sm:tracking-[0.16em]">
                <FontAwesomeIcon
                  icon={faShieldHalvedIcon}
                  className="text-[0.8rem]"
                />
                Trusted first impression
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sectors" className="bg-white text-black">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 sm:py-18 md:px-10 md:py-24 xl:grid-cols-[0.8fr_1.2fr] xl:gap-18 xl:px-16 xl:py-28">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Who we work with
            </div>
            <h2 className="font-display mt-4 max-w-[400px] text-[1.7rem] leading-[1.04] tracking-[-0.05em] text-black sm:text-[1.95rem] md:text-[2.6rem]">
              Transport support for commercially demanding sectors.
            </h2>
            <p className="mt-4 max-w-md text-[0.94rem] leading-7 text-black/62 sm:mt-5 sm:text-[0.98rem]">
              Provida Transport is positioned for businesses that need a
              transport partner that communicates clearly, responds quickly, and
              delivers reliably.
            </p>
          </div>

          <div className="grid gap-2.5">
            {sectors.map((sector) => (
              <div
                key={sector}
                className="flex items-center justify-between rounded-[1.15rem] border border-black/8 px-4 py-4 transition hover:border-black/16 sm:rounded-[1.35rem] sm:px-6 sm:py-5 md:px-7"
              >
                <div className="pr-4 text-[0.95rem] font-semibold tracking-[-0.015em] text-black sm:text-[1rem]">
                  {sector}
                </div>
                <FontAwesomeIcon
                  icon={faArrowRightIcon}
                  className="text-[0.78rem] text-black/28"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="approach"
        className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-18 md:px-10 md:py-24 xl:px-16 xl:py-28"
      >
        <div className="grid gap-10 xl:grid-cols-[0.74fr_1.26fr] xl:gap-18">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Approach
            </div>
            <h2 className="font-display mt-4 max-w-[420px] text-[1.7rem] leading-[1.04] tracking-[-0.05em] text-black sm:text-[1.95rem] md:text-[2.6rem]">
              Why businesses choose Provida Transport.
            </h2>
            <p className="mt-4 max-w-md text-[0.94rem] leading-7 text-black/62 sm:mt-5 sm:text-[0.98rem]">
              The site should help prospective clients understand not just what
              Provida does, but why the business is a dependable partner to work
              with.
            </p>
          </div>

          <div className="grid gap-3">
            {principles.map((item) => (
              <div
                key={item.title}
                className="grid gap-3 rounded-[1.35rem] border border-black/8 px-5 py-5 sm:rounded-[1.6rem] sm:px-6 sm:py-6 md:grid-cols-[220px_1fr] md:gap-6 md:px-8 md:py-7"
              >
                <div className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-black/36 sm:text-[0.62rem] sm:tracking-[0.24em]">
                  {item.title}
                </div>
                <p className="max-w-[620px] text-[0.93rem] leading-7 text-black/62 sm:text-[0.97rem]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quote" className="border-y border-black/8 bg-[#fbfbfb]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 sm:py-18 md:px-10 md:py-24 xl:grid-cols-[0.78fr_1.22fr] xl:gap-18 xl:px-16 xl:py-28">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Request a Quote
            </div>
            <h2 className="font-display mt-4 max-w-[420px] text-[1.7rem] leading-[1.04] tracking-[-0.05em] text-black sm:text-[1.95rem] md:text-[2.6rem]">
              Request a quote.
            </h2>
            <p className="mt-4 max-w-md text-[0.94rem] leading-7 text-black/62 sm:mt-5 sm:text-[0.98rem]">
              A simple enquiry form gives prospective clients a direct way to
              discuss delivery requirements, recurring transport needs, or
              distribution support.
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
                  Commercial enquiries only
                </p>
                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmittingQuote ? "Submitting..." : "Submit Quote Request"}
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
        className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-18 md:px-10 md:py-24 xl:px-16 xl:py-28"
      >
        <div className="grid gap-8 border-t border-black/10 pt-8 sm:pt-10 md:gap-10 xl:grid-cols-[0.78fr_1.22fr]">
          <div>
            <div className="text-[0.58rem] uppercase tracking-[0.28em] text-black/38">
              Contact
            </div>
            <h2 className="font-display mt-4 max-w-[450px] text-[1.7rem] leading-[1.04] tracking-[-0.05em] text-black sm:text-[1.95rem] md:text-[2.5rem]">
              Get in touch with Provida Transport.
            </h2>
            <p className="mt-4 max-w-md text-[0.94rem] leading-7 text-black/62 sm:mt-5 sm:text-[0.98rem]">
              Whether you need a one-off urgent movement or a longer-term
              logistics partner, Provida Transport can be contacted quickly to
              discuss requirements and provide a tailored quote.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2 rounded-[1.35rem] border border-black/8 bg-white px-5 py-5 sm:gap-5 sm:rounded-[1.6rem] sm:px-6 sm:py-6 md:grid-cols-[160px_1fr] md:px-8">
              <div className="text-[0.56rem] uppercase tracking-[0.22em] text-black/35 sm:text-[0.58rem] sm:tracking-[0.24em]">
                Telephone
              </div>
              <div className="flex items-center gap-3 text-[0.95rem] font-semibold tracking-[-0.01em] text-black sm:text-[0.98rem]">
                <FontAwesomeIcon icon={faPhoneIcon} className="text-[0.82rem]" />
                +44 (0)XXX XXX XXXX
              </div>
            </div>
            <div className="grid gap-2 rounded-[1.35rem] border border-black/8 bg-white px-5 py-5 sm:gap-5 sm:rounded-[1.6rem] sm:px-6 sm:py-6 md:grid-cols-[160px_1fr] md:px-8">
              <div className="text-[0.56rem] uppercase tracking-[0.22em] text-black/35 sm:text-[0.58rem] sm:tracking-[0.24em]">
                Email
              </div>
              <div className="break-all text-[0.95rem] font-semibold tracking-[-0.01em] text-black sm:break-normal sm:text-[0.98rem]">
                hello@providatransport.co.uk
              </div>
            </div>
            <div className="grid gap-2 rounded-[1.35rem] border border-black/8 bg-white px-5 py-5 sm:gap-5 sm:rounded-[1.6rem] sm:px-6 sm:py-6 md:grid-cols-[160px_1fr] md:px-8">
              <div className="text-[0.56rem] uppercase tracking-[0.22em] text-black/35 sm:text-[0.58rem] sm:tracking-[0.24em]">
                Hours
              </div>
              <div className="text-[0.95rem] font-semibold tracking-[-0.01em] text-black sm:text-[0.98rem]">
                Monday to Friday, 08:00 to 18:00
              </div>
            </div>
            <div className="grid gap-2 rounded-[1.35rem] border border-black/8 bg-white px-5 py-5 sm:gap-5 sm:rounded-[1.6rem] sm:px-6 sm:py-6 md:grid-cols-[160px_1fr] md:px-8">
              <div className="text-[0.56rem] uppercase tracking-[0.22em] text-black/35 sm:text-[0.58rem] sm:tracking-[0.24em]">
                Coverage
              </div>
              <div className="text-[0.95rem] font-semibold tracking-[-0.01em] text-black sm:text-[0.98rem]">
                UK-wide transport and logistics support
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

