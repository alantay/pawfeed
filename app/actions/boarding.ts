"use server";
import { db } from "@/db";
import { boardingSession } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { boardingSchema } from "@/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
    console.log("oooo", formData.get("ownerName"));
    // result.error contains the type-safe validation errors
    const flattenedErrors = z.flattenError(parsedData.error);
    return {
      success: false,
      errors: flattenedErrors.fieldErrors, // Specific field errors
      formErrors: flattenedErrors.formErrors, // Top-level errors (like your date comparison)
      fields: {
        ownerName: formData.get("ownerName") as string,
        petNames: formData.getAll("petNames") as string[],
        checkIn: formData.get("checkIn") as string,
        checkOut: formData.get("checkOut") as string,
      },
    };
  }

  const { ownerName, checkIn, checkOut, petNames } = parsedData.data;

  const [inserted] = await db
    .insert(boardingSession)
    .values({
      sitterId: session.user.id,
      ownerName,
      checkIn,
      checkOut,
      petNames,
    })
    .returning({ id: boardingSession.id });
  revalidatePath("/");

  redirect(`/boarding/${inserted.id}`);
}
