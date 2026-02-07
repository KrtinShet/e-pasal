'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Select, type SelectProps } from '../select';

type RHFSelectProps = Omit<SelectProps, 'name'> & {
  name: string;
};

export function RHFSelect({ name, helperText, ...other }: RHFSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          error={error ? error.message : undefined}
          helperText={!error ? helperText : undefined}
          {...other}
        />
      )}
    />
  );
}
