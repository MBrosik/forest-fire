import { FC } from 'react';
import { ConfigFormTextField, ConfigGridContainer } from './configuration';
import { Configuration } from '../../model/configuration/configuration';
import { Typography } from '@mui/material';
import { useFormikContext } from 'formik';

export const ForestFormPart: FC = () => {
  const { values } = useFormikContext<Configuration>();

  return (
    <>
      <Typography variant={'body1'}>Forest {values.forestName}</Typography>
      <ConfigGridContainer>
        <ConfigFormTextField propertyName={'forestName'} />
        <ConfigFormTextField
          propertyName={'rows'}
          type={'number'}
        />
        <ConfigFormTextField
          propertyName={'columns'}
          type={'number'}
        />
      </ConfigGridContainer>
    </>
  );
};
