"use client";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function TimelineUpdateCreate() {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <div>
      <h2>TimelineUpdate Create</h2>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input placeholder="Activity title" required name="title" />
          </Field>
          <Field>
            <FieldLabel htmlFor="description">About you</FieldLabel>
            <Textarea
              name="description"
              placeholder="Any interesting happenings"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="image">Profile Picture</FieldLabel>
            {imagePreviewUrl && (
              <FieldLabel htmlFor="image">
                <div className="relative cursor-pointer ">
                  <div className="bg-accent-foreground p-1 absolute top-1 right-1 rounded border border-muted-foreground">
                    <EditIcon className=" text-background w-4 h-4" />
                  </div>
                  <Image
                    src={imagePreviewUrl}
                    tabIndex={0}
                    className="max-w-40 rounded"
                    width={100}
                    height={100}
                    alt="profile image"
                    objectFit="true"
                  />
                </div>
              </FieldLabel>
            )}

            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              ref={imageInputRef}
              onChange={handleImageChange}
            />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
