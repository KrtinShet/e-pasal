'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Switch, type SwitchProps } from '../switch';

type RHFSwitchProps = Omit<SwitchProps, 'name' | 'checked'> & {
  name: string;
  helperText?: React.ReactNode;
};

export function RHFSwitch({ name, helperText, ...other }: RHFSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Switch
          {...field}
          checked={field.value}
          error={error ? error.message : undefined}
          {...other}
        />
      )}
    />
  );
}
