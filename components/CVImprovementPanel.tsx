"use client";

import { ImprovedCV } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Lightbulb } from "lucide-react";

interface CVImprovementPanelProps {
  improvedCV: ImprovedCV;
}

export default function CVImprovementPanel({
  improvedCV,
}: CVImprovementPanelProps) {
  return (
    <div className="space-y-6">
      {improvedCV.name && (
        <div>
          <h2 className="text-xl font-bold">{improvedCV.name}</h2>
          <div className="flex gap-3 text-sm text-muted-foreground mt-1">
            {improvedCV.email && <span>{improvedCV.email}</span>}
            {improvedCV.phone && <span>{improvedCV.phone}</span>}
          </div>
        </div>
      )}

      {improvedCV.experience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Experience</h3>
          {improvedCV.experience.map((job, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {job.role}
                  {job.company && (
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      — {job.company}
                    </span>
                  )}
                </CardTitle>
                {job.duration && (
                  <p className="text-xs text-muted-foreground">{job.duration}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {job.bullets.map((bullet, j) => (
                  <div key={j} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-start">
                      {/* Original */}
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-xs text-red-600 font-medium mb-1">
                          Original
                        </p>
                        <p className="text-sm text-red-900">{bullet.original}</p>
                      </div>

                      {/* Arrow */}
                      <div className="hidden md:flex items-center justify-center pt-6">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>

                      {/* Improved */}
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <p className="text-xs text-green-600 font-medium mb-1">
                          Improved
                        </p>
                        <p className="text-sm text-green-900">{bullet.improved}</p>
                      </div>
                    </div>

                    {bullet.reason && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
                        <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{bullet.reason}</span>
                      </div>
                    )}

                    {j < job.bullets.length - 1 && (
                      <Separator className="my-1" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {improvedCV.skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {improvedCV.skills.map((skill, i) => (
              <Badge key={i} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
