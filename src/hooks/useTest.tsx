import { useEffect } from "react";
import { UseFormReset } from "react-hook-form";

interface FormValues {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  postcode: string;
  city: string;
  phone: string;
  country: string;
  state: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTest = (reset:any) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      reset({
        email: "mythcihuman28@gmail.com",
        first_name: "Sanchit Jain",
        last_name: "TEST ORDER",
        address_1: "A1-154,Sushant lok 2 ,Sector 55 , Gurgaon",
        address_2: "Near orchids International school , gurgaon" as
          | string
          | undefined, // cast to optional type
        postcode: "122011",
        city: "Gurgaon",
        phone: "9650296375",
        country: "india" as "india" | "usa" | "uk", // must include required fields
        state: "", // if you don't have a value yet, empty string is fine
      });
    }
  }, [reset]);
};
