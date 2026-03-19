"use client";
import { updateProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { EditIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

export default function editPage() {
  const router = useRouter();
  const { data: session, isPending: isLoadingSession } =
    authClient.useSession();
  const [error, action, isPending] = useActionState(updateProfile, null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const { user } = session || {};
  const { sitterBio, name, image } = user || {};
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.image) {
      setImagePreviewUrl(user.image);
    }
  }, [user?.image]);

  if (!session) {
    return <div>Please log in to edit your profile.</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreviewUrl(objectUrl);
    }
  };

  const handleReset = () => {
    setImagePreviewUrl(image || null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  if (isLoadingSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="font-semibold mb-4">Profile</h1>
      <form action={action}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input defaultValue={name} required name="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="sitterBio">About you</FieldLabel>
            <Textarea
              defaultValue={sitterBio || ""}
              name="sitterBio"
              placeholder="Share your story with pet parents here..."
              required
            />
            {error && (
              <p className="text-destructive text-sm">
                {error.errors?.sitterBio}
              </p>
            )}
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
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="reset" onClick={handleReset}>
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
