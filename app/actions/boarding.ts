"use server";
import { db } from "@/db";
import { boardingSession } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { boardingSchema } from "@/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

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
    petNames: formData.getAll("petNames"), // This captures the array
  });

  console.log({ parsedData });
  if (!parsedData.success) {
    // result.error contains the type-safe validation errors
    const flattenedErrors = z.flattenError(parsedData.error);
    return {
      success: false,
      errors: flattenedErrors.fieldErrors, // Specific field errors
      formErrors: flattenedErrors.formErrors, // Top-level errors (like your date comparison)
    };
  }

  const { ownerName, checkIn, checkOut, petNames } = parsedData.data;

  await db.insert(boardingSession).values({
    sitterId: session.user.id,
    ownerName,
    checkIn,
    checkOut,
    petNames,
  });
  revalidatePath("/");
  return { success: true };
}
