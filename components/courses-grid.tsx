"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Users, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/lib/data";
import { getIcon } from "@/lib/icons";

export function CoursesGrid({ courses }: { courses: Course[] }) {
  const [showAll, setShowAll] = React.useState(false);

  const displayedCourses = showAll ? courses : courses.slice(0, 6);
  const remainingCount = courses.length - 6;

  return (
    <div className="mt-10 sm:mt-12">
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {displayedCourses.map((course) => {
          const Icon = getIcon(course.icon);
          return (
            <motion.div
              key={course.slug}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex"
            >
              <Card className="group flex w-full flex-col transition-all duration-300 ease-out hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md">
                      <Icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                    </span>
                    {course.featured && (
                      <Badge
                        variant="soft"
                        className="transition-transform duration-200 group-hover:scale-105"
                      >
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4 text-xl">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="transition-colors duration-200 hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                    >
                      {course.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {course.tagline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
                      {course.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
                      {course.batchSize}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
                      {course.level}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full transition-all duration-200 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      <Link href={`/courses/${course.slug}`}>
                        View Course Details
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {courses.length > 6 && (
        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowAll((v) => !v)}
            className="group gap-2 rounded-full border-primary/40 px-8 font-bold shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
          >
            <span>
              {showAll
                ? "Show Fewer Courses"
                : `See All Courses (${remainingCount} More)`}
            </span>
            {showAll ? (
              <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
