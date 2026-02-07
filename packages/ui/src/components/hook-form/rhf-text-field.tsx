'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Input, type InputProps } from '../input';

type RHFTextFieldProps = InputProps & {
  name: string;
};

export function RHFTextField({ name, helperText, type, ...other }: RHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          {...field}
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={error ? error.message : undefined}
          helperText={!error ? (helperText as string) : undefined}
          {...other}
        />
      )}
    />
  );
}
