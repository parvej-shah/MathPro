"use client";

import { BookOpenCheck } from "lucide-react";
import lottie from "lottie-web";
import { useEffect, useRef, type ReactNode } from "react";
import onlineEducationAnimation from "../../../../public/assets/LottieFile/LottieOnlineEducation.json";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const mathMotifs = [
  { value: "∫", className: "left-4 top-24 text-[8rem] md:text-[14rem]", rotation: "10deg", delay: "0s" },
  { value: "π", className: "right-3 top-1/4 text-[7rem] md:text-[12rem]", rotation: "-12deg", delay: "-3s" },
  { value: "√", className: "bottom-20 left-8 text-[7rem] md:text-[11rem]", rotation: "28deg", delay: "-6s" },
  { value: "∞", className: "bottom-8 right-12 text-[6rem] md:text-[10rem]", rotation: "-8deg", delay: "-9s" },
];

function AuthLottie() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: onlineEducationAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full drop-shadow-2xl" aria-hidden />;
}

export default function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-section-a text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-0 top-1/4 size-80 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--primary) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--primary) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
        {mathMotifs.map((motif) => (
          <span
            key={motif.value}
            className={`absolute font-serif font-black leading-none text-primary/10 animate-motif-float ${motif.className}`}
            style={{
              ["--motif-rot" as string]: motif.rotation,
              ["--motif-tx" as string]: "10px",
              ["--motif-ty" as string]: "-12px",
              ["--motif-dr" as string]: "2deg",
              animationDelay: motif.delay,
            }}
          >
            {motif.value}
          </span>
        ))}
      </div>

      <section className="relative z-10 mx-auto grid min-h-screen w-[92%] max-w-7xl grid-cols-1 items-center gap-8 py-8 md:w-[88%] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-12">
        <div className="hidden min-h-[650px] items-center justify-center lg:flex">
          <div className="relative flex min-h-[650px] w-full items-center justify-center">
            <div aria-hidden className="absolute inset-x-4 bottom-16 h-28 rounded-full bg-primary/12 blur-3xl" />
            <div aria-hidden className="absolute left-4 top-20 h-96 w-36 -rotate-12 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative h-[520px] w-full max-w-4xl">
              <AuthLottie />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-3xl border border-border/70 bg-card/88 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-7">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="hidden size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:flex">
                  <BookOpenCheck className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">MathPro</p>
                  <h1 className="text-3xl font-extrabold leading-tight text-heading sm:text-[2.6rem]">
                    {title}
                  </h1>
                </div>
              </div>
              <p className="text-base leading-7 text-muted-foreground">{description}</p>
            </div>

            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
