"use client";

import * as React from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

interface UploadZoneProps {
  imageUrl: string | null;
  onFileSelect: (file: File) => void;
}

export function UploadZone({ imageUrl, onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) return;
    onFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Upload Screenshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={
            "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-8 text-center transition " +
            (isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30")
          }
        >
          <p className="text-sm text-muted-foreground">
            Drag and drop a Pokemon Go inventory screenshot here.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            Choose Image
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </div>

        {imageUrl ? (
          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-lg border sm:h-80">
            <Image
              src={imageUrl}
              alt="Pokemon Go screenshot preview"
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
