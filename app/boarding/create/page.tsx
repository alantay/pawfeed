"use client";
import { createBoardingSession } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useActionState, useState } from "react";

interface ActionState {
  success: boolean; // Remove the '?' - make it mandatory
  errors?: {
    ownerName?: string[];
    petNames?: string[];
    checkIn?: string[];
    checkOut?: string[];
  };
  formErrors?: string[]; // Add this to match Zod's flatten output
  fields?: {
    ownerName: string;
    petNames: string[];
    checkIn: string;
    checkOut: string;
  };
}
// 2. Use this complete object as the initial state
const initialState: ActionState = {
  success: false,
  errors: {},
  formErrors: [],
  fields: {
    ownerName: "",
    petNames: [""],
    checkIn: "",
    checkOut: "",
  },
};
export default function createBoardingPage() {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [petNames, setPetNames] = useState<string[]>([""]);
  const [error, action, pending] = useActionState(
    createBoardingSession,
    initialState,
  );

  const handleReset = () => {
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
  };

  const addPet = () => setPetNames([...petNames, ""]);

  const removePet = (index: number) => {
    if (petNames.length > 1) {
      const newPetNames = [...petNames];
      newPetNames.splice(index, 1);
      setPetNames(newPetNames);
    }
  };
  const handlePetNameChange = (index: number, value: string) => {
    const newPetNames = [...petNames];
    newPetNames[index] = value;
    setPetNames(newPetNames);
  };

  return (
    <main className="flex min-h-screen w-full flex-col max-w-3xl mx-auto p-12">
      <h1 className="text-2xl mb-4">Create Boarding</h1>
      <form action={action}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="ownerName">Owner's name</FieldLabel>
            <Input
              defaultValue={error.fields?.ownerName}
              required
              name="ownerName"
              className="max-w-120"
            />
          </Field>
          <Field className="w-44">
            <FieldLabel htmlFor="date-picker-simple">Check-In Date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  data-empty={!checkInDate}
                  className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {checkInDate ? (
                    format(checkInDate, "PPP")
                  ) : (
                    <span>Pick check-in date</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  defaultMonth={checkInDate}
                />
              </PopoverContent>
            </Popover>
            <input
              type="hidden"
              name="checkIn"
              value={checkInDate?.toISOString() || ""}
            />
          </Field>
          <Field className="w-44">
            <FieldLabel htmlFor="date-picker-simple">Check-Out Date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  data-empty={!checkOutDate}
                  className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {checkOutDate ? (
                    format(checkOutDate, "PPP")
                  ) : (
                    <span>Pick check-out date</span>
                  )}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) =>
                    date < new Date() ||
                    (checkInDate !== undefined && date < checkInDate)
                  }
                  defaultMonth={checkOutDate}
                />
              </PopoverContent>
            </Popover>
            <input
              type="hidden"
              name="checkOut"
              value={checkOutDate?.toISOString() || ""}
            />
          </Field>
          <div>
            {petNames.map((pn, index) => {
              return (
                <div key={index}>
                  <Field className="mb-4 ">
                    <FieldLabel htmlFor={`petName-${index}`}>
                      Pet {index + 1} name
                    </FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        value={pn}
                        onChange={(e) =>
                          handlePetNameChange(index, e.target.value)
                        }
                        required
                        id={`petName-${index}`}
                        name="petNames"
                        className="max-w-120"
                      />
                      <Button
                        type="button"
                        variant={"ghost"}
                        onClick={() => removePet(index)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </Field>
                  {index === petNames.length - 1 ? (
                    <Button type="button" onClick={addPet}>
                      <PlusIcon />
                      Add pet
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>

          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="reset" onClick={handleReset}>
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </main>
  );
}
