import { useFormikContext } from 'formik';
import { FC } from 'react';
import { FireBrigade } from '../../../model/FireBrigade';

export const FireBrigadeForm: FC = () => {
  const { values: _ } = useFormikContext<FireBrigade>();

  return <></>;
};
