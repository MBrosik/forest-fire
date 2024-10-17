import { useFormikContext } from 'formik';
import { FC } from 'react';
import { ForesterPatrol } from '../../../model/ForesterPatrol';

export const ForesterPatrolForm: FC = () => {
  const { values: _ } = useFormikContext<ForesterPatrol>();

  return <></>;
};
