'use client';

import { FormProvider as Form } from 'react-hook-form';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

type Props<T extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export function FormProvider<T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  methods,
}: Props<T>) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
