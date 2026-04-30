"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  LineChart,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const stats = [
  { label: "Active students", value: "1,284", delta: "+18%", icon: UsersRound },
  { label: "Course revenue", value: "BDT 7.8L", delta: "+24%", icon: CreditCard },
  { label: "Avg. completion", value: "76%", delta: "+9%", icon: LineChart },
];

const courses = [
  {
    title: "Class 10 Higher Math",
    students: 428,
    progress: 84,
    next: "Functions revision live class",
    accent: "bg-emerald-500",
  },
  {
    title: "Class 9 Algebra Sprint",
    students: 312,
    progress: 67,
    next: "Quadratic formula worksheet",
    accent: "bg-amber-500",
  },
  {
    title: "HSC Calculus Foundation",
    students: 544,
    progress: 73,
    next: "Limits chapter recording",
    accent: "bg-sky-500",
  },
];

const activity = [
  "Bkash queue cleared for 18 pending submissions",
  "Class 10 module 05 recording published",
  "42 students completed today's MCQ set",
  "Routine updated for Friday evening batch",
];

export function MathProDashboard() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f7f3e8_0%,#eef7f2_48%,#f5f7fb_100%)] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-sm">
              <GraduationCap className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">MathPro</p>
              <p className="text-sm text-slate-600">LMS command center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon" aria-label="Review platform health">
                  <ShieldCheck className="size-4" />
                  </Button>
                }
              />
              <TooltipContent>Platform health</TooltipContent>
            </Tooltip>
            <Button className="hidden bg-emerald-700 hover:bg-emerald-800 sm:inline-flex">
              Launch staging
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </header>

        <section className="grid flex-1 gap-5 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="flex flex-col justify-between gap-6 rounded-xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur sm:p-7"
          >
            <div className="space-y-5">
              <Badge className="w-fit bg-amber-500 text-slate-950 hover:bg-amber-500">
                <Sparkles className="size-3.5" />
                Fresh frontend stack
              </Badge>
              <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                  Build MathPro as a fast, animated, production-ready LMS.
                </h1>
                <p className="text-base leading-7 text-slate-600 sm:text-lg">
                  Next.js, Tailwind, shadcn/ui, Axios, Framer Motion, Motion, and GSAP are ready for the course, payment, admin, and student flows.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                >
                  <Card className="rounded-lg border-slate-200/80 bg-white/90 shadow-none">
                    <CardHeader className="pb-2">
                      <CardDescription className="flex items-center justify-between text-slate-600">
                        {stat.label}
                        <stat.icon className="size-4 text-emerald-700" />
                      </CardDescription>
                      <CardTitle className="text-2xl">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-emerald-700">{stat.delta} this month</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
          >
            <Card className="h-full rounded-xl border-slate-200 bg-white/90 shadow-sm">
              <CardHeader>
                <CardTitle>Today at a glance</CardTitle>
                <CardDescription>Operational pulse for live batches and payments.</CardDescription>
                <CardAction>
                  <Badge variant="secondary">Dhaka</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="courses" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-lg">
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="courses" className="mt-5 space-y-4">
                    {courses.map((course) => (
                      <div key={course.title} className="rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className={`mt-1 size-2.5 rounded-full ${course.accent}`} />
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="mt-1 text-sm text-slate-600">{course.next}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{course.students}</Badge>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <Progress value={course.progress} className="h-2" />
                          <span className="w-10 text-right text-sm font-medium">{course.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="activity" className="mt-5">
                    <div className="space-y-4">
                      {activity.map((item) => (
                        <div key={item} className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" />
                          <p className="text-sm leading-6 text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-5" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-emerald-100 text-emerald-800">PS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Parvej Shah</p>
                          <p className="text-xs text-slate-500">Frontend setup complete</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="grid gap-3 pb-6 md:grid-cols-3">
          {[
            { icon: BookOpenCheck, text: "Course builder ready" },
            { icon: PlayCircle, text: "Animated LMS views ready" },
            { icon: CalendarClock, text: "Routine UI foundation ready" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 rounded-lg border border-white/70 bg-white/65 px-4 py-3 text-sm font-medium text-slate-700 backdrop-blur">
              <item.icon className="size-4 text-emerald-700" />
              {item.text}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
