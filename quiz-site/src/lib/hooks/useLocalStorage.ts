/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { z } from "zod";
export function UseLocalStorageGet(
  name: string,
  initialFunction: (arg0: any) => void,
  schema: z.ZodObject<any, any, any>
) {
  type Schema = z.infer<typeof schema>;
  useEffect(() => {
    const data = localStorage.getItem(name);
    if (data) {
      try {
        const parsedData = JSON.parse(data) as Schema;
        if (parsedData) {
          try {
            initialFunction(parsedData);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [name, initialFunction, schema]);
}

export function UseLocalStorageSet(name: string, path: string) {
  const getValuesRef = useRef<null | ((path: string) => null)>(null);
  useEffect(() => {
    const cleanup = () => {
      if (getValuesRef.current) {
        const stringifiedData = JSON.stringify(getValuesRef.current(path));
        localStorage.setItem(name, stringifiedData);
      }
    };
    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [name, path]);

  function setValues(getValues: () => any) {
    getValuesRef.current = getValues;
  }
  return setValues;
}
