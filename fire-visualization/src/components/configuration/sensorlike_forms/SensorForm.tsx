import { useFormikContext } from 'formik';
import { FC } from 'react';
import { Sensor, SensorTypes } from '../../../model/sensor';
import { ConfigFormDropDown } from '../configuration';

export const SensorForm: FC = () => {
  const { values: _ } = useFormikContext<Sensor>();

  return (
    <ConfigFormDropDown
      allVariants={SensorTypes}
      propertyName={'sensorType'}
      readOnly={false}
    />
  );
};
