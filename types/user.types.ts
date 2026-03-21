import * as z from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const profileSchema = z.object({
  name: z.string().min(3, "Name is required"),
  sitterBio: z.string().min(10, "Bio must be at least 10 characters"),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      {
        message: ".jpg, .jpeg, and .png files are accepted.",
      },
    )
    .optional(),
});

export const boardingSchema = z
  .object({
    ownerName: z.string().min(3, "Name is required"),
    petNames: z
      .array(z.string().trim().min(1, "Pet name cannot be empty"))
      .min(1, "At least one pet name is required"),
    checkIn: z.coerce.date().refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only the date
        return date >= today;
      },
      { message: "Check-in cannot be in the past" },
    ),
    checkOut: z.coerce.date(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out date must be after the check-in date",
    path: ["checkOut"], // This pins the error to the checkOut field in your UI
  });
