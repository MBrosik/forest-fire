import { Field, FieldArray } from 'formik';
import { FC, ReactNode } from 'react';
import { Button, Grid, MenuItem, Select, Stack, TextField } from '@mui/material';
import { labelize } from '../../utils/labelize';
import { Booleanify } from '../../utils/Booleanify';

// ON PURPOSE:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FormPartProps<T> {}

export interface ItemFormPartProps<T> extends FormPartProps<T> {
  readonly: boolean | Booleanify<T>;
  obj: T;
}

export interface ConfigArrayFormProps<T> {
  name: string;
  ChildForm: FC<ItemFormPartProps<T>>;
  defaultObj: T;
  data: T[];
  readonly: boolean | Booleanify<T>;
}

export interface ConfigFormFieldProps {
  propertyName: string;
  objectName?: string;
  idx?: number;
  readOnly?: boolean;
}

export interface ConfigFormTextFieldProps extends ConfigFormFieldProps {
  type?: 'text' | 'number';
}

const conditionalConcat = (delimiter: string, ...parts: (string | undefined)[]): string | undefined => {
  const result = parts.flatMap((part) => (part ? [part] : [])).join(delimiter);
  return result.length === 0 ? undefined : result;
};

const constructId = (propertyName: string, objectName?: string, idx?: number) => {
  const result = conditionalConcat('-', objectName, propertyName, idx?.toString());
  return result ?? '';
};

const constructName = (propertyName: string, objectName?: string, idx?: number): string => {
  const indexingPostfix = idx != undefined ? `[${idx}]` : undefined;
  const result = conditionalConcat('.', conditionalConcat('', objectName, indexingPostfix), propertyName);
  return result ?? '';
};

export const ConfigFormTextField: FC<ConfigFormTextFieldProps> = (props) => {
  return (
    <Field
      as={TextField}
      id={constructId(props.propertyName, props.objectName, props.idx)}
      name={constructName(props.propertyName, props.objectName, props.idx)}
      label={labelize(props.propertyName)}
      disabled={props.readOnly}
      type={props.type ?? 'text'}
    />
  );
};

export interface ConfigFormDropDownProps extends ConfigFormFieldProps {
  allVariants: readonly string[];
}

export const ConfigFormDropDown: FC<ConfigFormDropDownProps> = (props) => {
  return (
    <Field
      as={Select}
      id={constructId(props.propertyName, props.objectName, props.idx)}
      name={constructName(props.propertyName, props.objectName, props.idx)}
      label={labelize(props.propertyName)}
      disabled={props.readOnly}
    >
      {props.allVariants.map((type) => (
        <MenuItem
          value={type}
          key={type}
        >
          {type}
        </MenuItem>
      ))}
    </Field>
  );
};

// NOTE: For some reason extends is needed in order to hint to compiler that <T> is a generic type declaration
export const ConfigArrayForm = <T extends object>({
  name,
  ChildForm,
  defaultObj,
  data,
  readonly,
}: ConfigArrayFormProps<T>) => {
  return (
    <FieldArray name={name}>
      {({ push }) => (
        <Stack spacing={2}>
          {data.map((obj, idx) => (
            <ChildForm
              key={idx}
              obj={obj}
              readonly={readonly}
            />
          ))}
          <Button
            variant={'contained'}
            onClick={() => push(defaultObj)}
          >
            Add
          </Button>
        </Stack>
      )}
    </FieldArray>
  );
};

interface ConfigGridContainerProps {
  children: ReactNode[];
}

export const ConfigGridContainer: FC<ConfigGridContainerProps> = (props) => {
  return (
    <Grid
      container
      spacing={2}
    >
      {props.children.map((child, idx) => (
        <Grid
          item
          xs={4}
          key={idx}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};
