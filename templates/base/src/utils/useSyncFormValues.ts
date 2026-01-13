import { Path, UseFormSetValue, UseFormWatch } from "react-hook-form";

export function setFormValues<T extends object>(
  initialData: Partial<T> | undefined,
  initialValues: Partial<T>,
  setValue: UseFormSetValue<T>
) {
  if (!initialData || !initialValues || !setValue) return;

  Object.keys(initialValues).forEach((key) => {
    const value =
      initialData?.[key as keyof T] ?? initialValues[key as keyof T];
    if (value !== undefined) {
      setValue(key as Path<T>, value as any);
    }
  });
}

/**
 * Watch multiple form fields at once and return them as an object
 * @param watch - React Hook Form's watch function
 * @param keys - Array of field keys to watch
 * @returns Object with field keys as properties and their current values
 */
export const watchFieldValues = <T extends Record<string, any>>(
  watch: UseFormWatch<T>,
  keys: (keyof T)[]
): Partial<T> => {
  const values = watch(keys as Path<T>[]); // Get values as an array
  return keys.reduce((acc, key, index) => {
    acc[key] = values[index];
    return acc;
  }, {} as Partial<T>);
};

export const isValidJsonString = (str: string) => {
  if (!str) {
    return false;
  }
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
