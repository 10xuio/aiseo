import { Suspense } from "react";
import { getTopics } from "@/components/dashboard/topics/actions";
import { TopicStep } from "./topic-step";
import { PromptStep } from "./prompt-step";
import { AnalysisStep } from "./analysis-step";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export async function Onboarding() {
  const topics = await getTopics();
  const hasTopics = topics.length > 0;

  let hasPrompts = false;
  let firstPromptId = "";

  if (hasTopics) {
    const { getPrompts } = await import(
      "@/components/dashboard/rankings/actions"
    );
    const prompts = await getPrompts(topics[0].id);
    hasPrompts = prompts.length > 0;
    firstPromptId = prompts[0]?.id || "";
  }

  const steps = [
    {
      id: "topic",
      number: 1,
      title: "Add Your Website",
      isComplete: hasTopics,
      isActive: !hasTopics,
      isLocked: false,
    },
    {
      id: "prompt",
      number: 2,
      title: "Create Your First Prompt",
      isComplete: hasPrompts,
      isActive: hasTopics && !hasPrompts,
      isLocked: !hasTopics,
    },
    {
      id: "analysis",
      number: 3,
      title: "Run Analysis",
      isComplete: false,
      isActive: hasPrompts,
      isLocked: !hasPrompts,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        {/* Steps */}
        <div className="space-y-8">
          <StepContainer step={steps[0]} isLastStep={false}>
            <Suspense fallback={<StepSkeleton />}>
              <TopicStep isComplete={hasTopics} />
            </Suspense>
          </StepContainer>

          <StepContainer step={steps[1]} isLastStep={false}>
            <Suspense fallback={<StepSkeleton />}>
              {hasTopics ? (
                <PromptStep topicId={topics[0].id} isComplete={hasPrompts} />
              ) : (
                <LockedStep
                  title="Create Your First Prompt"
                  description="Choose a prompt to track your SEO performance"
                />
              )}
            </Suspense>
          </StepContainer>

          <StepContainer step={steps[2]} isLastStep={true}>
            <Suspense fallback={<StepSkeleton />}>
              {hasPrompts ? (
                <AnalysisStep promptId={firstPromptId} />
              ) : (
                <LockedStep
                  title="Ready to Analyze!"
                  description="Start your first SEO analysis across AI models"
                />
              )}
            </Suspense>
          </StepContainer>
        </div>
      </div>
    </div>
  );
}

function StepContainer({
  step,
  children,
  isLastStep,
}: {
  step: {
    number: number;
    title: string;
    isComplete: boolean;
    isActive: boolean;
    isLocked: boolean;
  };
  children: React.ReactNode;
  isLastStep: boolean;
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          "bg-background rounded-xl border transition-all duration-300",
          step.isActive ? "shadow-lg shadow-primary/10" : "shadow-none",
          step.isComplete ? "opacity-90" : "",
          step.isLocked ? "opacity-50" : ""
        )}
      >
        {/* Step Header */}
        <div className="flex items-center gap-4 p-6 border-b">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-all",
              step.isComplete
                ? "bg-green-600 text-white"
                : step.isActive
                ? "bg-primary/10 text-primary border-1"
                : "bg-muted text-muted-foreground"
            )}
          >
            {step.isComplete ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : step.isLocked ? (
              <Lock className="h-5 w-5" />
            ) : (
              <span className="font-semibold">{step.number}</span>
            )}
          </div>
          <div className="flex-1">
            <h3
              className={cn(
                "font-semibold text-lg",
                step.isLocked ? "text-muted-foreground" : ""
              )}
            >
              Step {step.number}: {step.title}
            </h3>
          </div>
          {step.isComplete && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Completed
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className={cn("p-6", step.isLocked ? "pointer-events-none" : "")}>
          {children}
        </div>
      </div>

      {/* Connector Line */}
      {!isLastStep && (
        <div className="absolute left-7 top-full h-8 w-0.5 bg-border" />
      )}
    </div>
  );
}

function LockedStep({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        <Lock className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-12 rounded-full mx-auto" />
      <Skeleton className="h-6 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
      <Skeleton className="h-10 w-full max-w-md mx-auto" />
    </div>
  );
}
