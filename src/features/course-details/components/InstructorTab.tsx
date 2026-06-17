import Image from "next/image";
import { Instructor } from "@/features/course-details/_lib/types";

interface InstructorTabProps {
  instructors?: Instructor[];
}

function SingleInstructorLayout({ instructor }: { instructor: Instructor }) {
  const credibilityLines = instructor.credibility
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="grid md:grid-cols-[1fr_30%] gap-8 lg:gap-16 items-stretch">
      {/* Left — content */}
      <div className="flex flex-col justify-center order-2 md:order-1">
        <div className="max-w-xl">
          <div className="h-1 w-16 bg-primary rounded-full mb-5" />
          <h3 className="text-2xl md:text-3xl font-extrabold text-heading font-heading leading-snug mb-1">
            {instructor.name}
          </h3>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground mb-4">
            ইন্সট্রাক্টর
          </p>

          {credibilityLines.length > 0 && (
            <ul className="flex flex-col gap-2.5">
              {credibilityLines.map((line, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 size-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right — photo */}
      <div className="relative aspect-[3/4] sm:aspect-square md:aspect-auto md:min-h-72 rounded-2xl overflow-hidden bg-muted order-1 md:order-2">
        <Image
          src={instructor.imageUploadedLink || "/Frame 1000004442.png"}
          alt={instructor.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 30vw"
        />
      </div>
    </div>
  );
}

function InstructorCard({ instructor }: { instructor: Instructor }) {
  const credibilityLines = instructor.credibility
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <article className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-primary/25 hover:bg-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex items-center gap-3 sm:w-56 sm:flex-shrink-0">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
              src={instructor.imageUploadedLink || "/Frame 1000004442.png"}
              alt={instructor.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-foreground">
              {instructor.name}
            </h3>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              ইন্সট্রাক্টর
            </p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid gap-2 sm:grid-cols-2">
            {credibilityLines.map((line, index) => (
              <div
                key={`${instructor.name}-${index}`}
                className="flex items-start gap-2 rounded-xl bg-muted/35 px-3 py-2"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                <p className="text-sm leading-6 text-muted-foreground">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function InstructorTab({ instructors }: InstructorTabProps) {
  if (!instructors || instructors.length === 0) {
    return (
      <section className="py-12">
        <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-8 text-center">
          <p className="text-muted-foreground">
            ইন্সট্রাক্টরের তথ্য শীঘ্রই আপডেট করা হবে
          </p>
        </div>
      </section>
    );
  }

  if (instructors.length === 1) {
    return (
      <section className="py-12">
        <SingleInstructorLayout instructor={instructors[0]} />
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
          ইন্সট্রাক্টর
        </p>
        <p className="text-sm text-muted-foreground">
          কারা তোমাকে কোর্সটা শেখাবেন, এক নজরে দেখে নাও।
        </p>
      </div>
      <div className="space-y-3">
        {instructors.map((instructor) => (
          <InstructorCard key={instructor.name} instructor={instructor} />
        ))}
      </div>
    </section>
  );
}
