"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface OcrUploaderProps {
  label: string;
  onText: (text: string) => void;
  onError: (message: string) => void;
}

export function OcrUploader({ label, onText, onError }: OcrUploaderProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [fileCount, setFileCount] = React.useState(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setFileCount(files.length);
    setCurrentIndex(0);

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (message: { progress?: number }) => {
          if (typeof message.progress === "number") {
            setProgress(Math.round(message.progress * 100));
          }
        }
      });

      for (let index = 0; index < files.length; index += 1) {
        setCurrentIndex(index + 1);
        setProgress(0);
        const { data } = await worker.recognize(files[index]);
        onText(data.text || "");
      }

      await worker.terminate();
    } catch {
      onError("OCR failed. Please try another screenshot.");
    } finally {
      setIsProcessing(false);
      setFileCount(0);
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isProcessing}
        >
          {label}
        </Button>
        {isProcessing ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              Processing screenshot {currentIndex} of {fileCount}
            </span>
          </div>
        ) : null}
      </div>

      {isProcessing ? (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
