"use server";
import { db } from "@/db";
import { boardingSession, user } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { boardingSchema, profileSchema } from "@/types";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const parsedData = profileSchema.safeParse({
    name: formData.get("name"),
    sitterBio: formData.get("sitterBio"),
    image: formData.get("image"),
  });
  if (!parsedData.success) {
    // result.error contains the type-safe validation errors
    return { errors: parsedData.error.flatten().fieldErrors };
  }
  const toUpdate: any = {
    name: parsedData.data.name,
    sitterBio: parsedData.data.sitterBio,
  };

  const uploadedFile = parsedData.data?.image as File;
  let imageUrl: string | undefined;

  if (uploadedFile && uploadedFile.size > 0) {
    // Logic for Vercel Blob goes here!
    // const blob = await put(...)
    // newImageUrl = blob.url;
    const { url } = await put(uploadedFile.name, uploadedFile, {
      access: "public",
      addRandomSuffix: true,
    });
    imageUrl = url;
  }

  if (imageUrl) {
    toUpdate.image = imageUrl;
  }

  await db.update(user).set(toUpdate).where(eq(user.id, session.user.id));
  revalidatePath("/profile/edit");
  return { success: true };
}

export async function createBoardingSession(
  prevState: any,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const parsedData = boardingSchema.safeParse({
    ownerName: formData.get("ownerName"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
  });

  if (!parsedData.success) {
    // result.error contains the type-safe validation errors
    const flattenedErrors = z.flattenError(parsedData.error);
    return {
      success: false,
      errors: flattenedErrors.fieldErrors, // Specific field errors
      formErrors: flattenedErrors.formErrors, // Top-level errors (like your date comparison)
    };
  }

  const { ownerName, checkIn, checkOut } = parsedData.data;

  await db.insert(boardingSession).values({
    sitterId: session.user.id,
    ownerName,
    checkIn,
    checkOut,
  });
  revalidatePath("/");
  return { success: true };
}
