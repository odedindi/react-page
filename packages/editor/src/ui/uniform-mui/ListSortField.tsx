import type { IconButtonProps } from '@mui/material/IconButton';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/system';
import type { ReactNode } from 'react';
import React from 'react';
import type { FieldProps } from 'uniforms';
import { connectField, filterDOMProps, joinName, useField } from 'uniforms';

export type ListSortFieldProps = FieldProps<
  unknown,
  IconButtonProps,
  { iconUp?: ReactNode; iconDown?: ReactNode }
>;

function ListSort({
  disabled,
  iconUp = '↑',
  iconDown = '↓',
  name,
  readOnly,
  ...props
}: ListSortFieldProps) {
  const nameParts = joinName(null, name);
  const nameIndex = +nameParts[nameParts.length - 1];
  const parentName = joinName(nameParts.slice(0, -1));

  const parent = useField<{ minCount?: number }, unknown[]>(
    parentName,
    {},
    { absoluteName: true }
  )[0];

  const limitNotReachedUp = !disabled && nameIndex !== 0;

  const limitNotReachedDown =
    !disabled && nameIndex !== parent.value!.length - 1;

  const handleMove = (moveWhere: 'up' | 'down') => {
    if (!readOnly) {
      const value = parent.value!.slice();
      value.splice(nameIndex, 1);
      value.splice(
        moveWhere === 'up' ? nameIndex - 1 : nameIndex + 1,
        0,
        parent.value![nameIndex]
      );
      parent.onChange(value);
    }
  };

  return (
    <Stack>
      <IconButton
        {...filterDOMProps(props)}
        disabled={!limitNotReachedUp}
        onClick={() => handleMove('up')}
        size="large"
      >
        {iconUp}
      </IconButton>
      <IconButton
        {...filterDOMProps(props)}
        disabled={!limitNotReachedDown}
        onClick={() => handleMove('down')}
        size="large"
      >
        {iconDown}
      </IconButton>
    </Stack>
  );
}

export default connectField<ListSortFieldProps>(ListSort, {
  initialValue: false,
  kind: 'leaf',
});
