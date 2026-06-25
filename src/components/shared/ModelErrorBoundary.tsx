"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import { clearModelCache } from "@/lib/gltfLoader";
import { cn } from "@/lib/utils";
import { ModelPlaceholder } from "./ModelPlaceholder";

interface ModelErrorBoundaryProps {
  children: ReactNode;
  modelPath?: string;
  className?: string;
}

interface ModelErrorBoundaryState {
  attempt: number;
  hasError: boolean;
}

export class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = { attempt: 0, hasError: false };

  static getDerivedStateFromError(): Partial<ModelErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("3D model failed to load:", error.message, info.componentStack);
  }

  private retry = () => {
    if (this.props.modelPath) {
      clearModelCache(this.props.modelPath);
      useGLTF.clear(this.props.modelPath);
    }
    this.setState((state) => ({
      hasError: false,
      attempt: state.attempt + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <button
          type="button"
          onClick={this.retry}
          className={cn(
            "flex h-full w-full flex-col items-center justify-center gap-2 rounded-[2rem] border border-leaf/20 bg-lemon/10 px-4 text-center text-sm text-muted-foreground transition-colors hover:bg-lemon/15",
            this.props.className
          )}
        >
          <span>3D preview unavailable</span>
          <span className="font-medium text-leaf">Tap to retry</span>
        </button>
      );
    }

    return (
      <div key={this.state.attempt} className={cn("h-full w-full", this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
