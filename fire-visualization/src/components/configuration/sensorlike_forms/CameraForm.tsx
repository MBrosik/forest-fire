import { FC } from 'react';
import { Camera } from '../../../model/camera';
import { useFormikContext } from 'formik';
import { ConfigFormTextField } from '../configuration';

export const CameraForm: FC = () => {
  const { values: _ } = useFormikContext<Camera>();

  return (
    <ConfigFormTextField
      propertyName={'range'}
      type={'number'}
    />
  );
};
