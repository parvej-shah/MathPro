import Image from "next/image";
import { Instructor } from "@/features/course-details/_lib/types";

interface InstructorTabProps {
  instructors?: Instructor[];
}

export default function InstructorTab({ instructors }: InstructorTabProps) {
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

      {instructors && instructors.length > 0 ? (
        <div className="space-y-3">
          {instructors.map((instructor) => {
            const credibilityLines = instructor.credibility
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

            return (
              <article
                key={instructor.name}
                className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-primary/25 hover:bg-card"
              >
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
                          <p className="text-sm leading-6 text-muted-foreground">
                            {line}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-8 text-center">
          <p className="text-muted-foreground">
            ইন্সট্রাক্টরের তথ্য শীঘ্রই আপডেট করা হবে
          </p>
        </div>
      )}
    </section>
  );
}
