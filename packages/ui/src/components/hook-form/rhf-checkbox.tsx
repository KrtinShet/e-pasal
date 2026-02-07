'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox, type CheckboxProps } from '../checkbox';

type RHFCheckboxProps = Omit<CheckboxProps, 'name' | 'checked'> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFCheckbox({ name, helperText, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Checkbox
          {...field}
          checked={field.value}
          error={error ? error.message : undefined}
          {...other}
        />
      )}
    />
  );
}
