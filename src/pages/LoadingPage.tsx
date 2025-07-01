// src/pages/LoadingPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music, CheckCircle, Loader } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoadingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  loading: boolean;
}

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: "fetch-playlist",
      label: "Fetching Discover Weekly",
      description: "Finding your current Discover Weekly playlist",
      completed: false,
      loading: true, // Start with first step loading
    },
    {
      id: "analyze-history",
      label: "Analyzing listening history",
      description: "Reviewing your recent music preferences",
      completed: false,
      loading: false,
    },
    {
      id: "check-popularity",
      label: "Checking song popularity",
      description: "Gathering popularity metrics from Spotify",
      completed: false,
      loading: false,
    },
    {
      id: "compare-artists",
      label: "Comparing with your top artists",
      description: "Identifying known vs new artists",
      completed: false,
      loading: false,
    },
  ]);

  useEffect(() => {
    const duration = 4000; // 4 seconds total
    const stepDuration = duration / steps.length; // 1 second per step
    let completedSteps = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 100 / (duration / 100), 100);

        // Calculate which step should be completed
        const targetCompletedSteps = Math.floor(
          (newProgress / 100) * steps.length
        );

        // If we should complete more steps
        if (targetCompletedSteps > completedSteps) {
          setSteps((prevSteps) => {
            const updated = [...prevSteps];

            // Complete the current step
            if (completedSteps < steps.length) {
              updated[completedSteps].completed = true;
              updated[completedSteps].loading = false;
            }

            // Start the next step if there is one
            if (completedSteps + 1 < steps.length) {
              updated[completedSteps + 1].loading = true;
            }

            return updated;
          });

          completedSteps = targetCompletedSteps;
          setCurrentStepIndex(completedSteps);
        }

        return newProgress;
      });
    }, 100);

    // Complete the loading and redirect
    const redirectTimeout = setTimeout(() => {
      // Make sure all steps are completed
      setSteps((prevSteps) => {
        const updated = prevSteps.map((step) => ({
          ...step,
          completed: true,
          loading: false,
        }));
        return updated;
      });

      setProgress(100);

      // Redirect to dashboard after a brief pause
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimeout);
    };
  }, [navigate, steps.length]);

  return (
    <div className="min-h-screen spotify-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">DiscoverTrue</h1>
          <div className="flex items-center text-gray-300">
            <span className="mr-2">👤</span>
            <span>Welcome!</span>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-md mx-auto text-center">
          {/* Loading Icon */}
          <div className="mb-8">
            <Music className="w-16 h-16 mx-auto mb-4 text-spotify-green animate-pulse" />
            <h2 className="text-2xl font-bold mb-4">
              Analyzing Your Music DNA...
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="mb-4 h-3" />
            <div className="text-lg font-semibold">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Steps List */}
          <Card className="bg-black/30 border-gray-700 p-6 mb-8">
            <div className="space-y-4 text-left">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-spotify-green" />
                    ) : step.loading ? (
                      <Loader className="w-5 h-5 animate-spin text-yellow-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        step.completed
                          ? "text-white"
                          : step.loading
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                      {step.completed && " ✓"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Time Estimate */}
          <div className="text-center text-gray-400">
            <div className="text-sm">Estimated time: 30 seconds</div>
          </div>

          {/* Fun Fact */}
          <Card className="mt-8 bg-blue-900/30 border-blue-500/20 p-4">
            <div className="flex items-center justify-center mb-2">
              <span className="mr-2">💡</span>
              <span className="font-semibold">Did you know?</span>
            </div>
            <div className="text-sm text-gray-300">
              The average Discover Weekly contains 15-20 songs you've never
              heard
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
