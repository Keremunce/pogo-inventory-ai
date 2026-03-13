"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OCRProcessorProps {
  file: File | null;
  onTextExtracted: (text: string) => void;
  onError: (message: string) => void;
}

export function OCRProcessor({ file, onTextExtracted, onError }: OCRProcessorProps) {
  const [progress, setProgress] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleOcr = async () => {
    if (!file) {
      onError("Please upload a screenshot before running OCR.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (message: { progress?: number }) => {
          if (typeof message.progress === "number") {
            setProgress(Math.round(message.progress * 100));
          }
        }
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      onTextExtracted(data.text || "");
    } catch (error) {
      onError("OCR failed. Please try another image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Run OCR</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={handleOcr} disabled={!file || isProcessing}>
            {isProcessing ? "Processing..." : "Extract Text"}
          </Button>
          {isProcessing ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Working in the browser</span>
            </div>
          ) : null}
        </div>

        {isProcessing ? (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
