import { FC } from 'react';
import {
  ConfigArrayForm,
  ConfigFormDropDown,
  ConfigFormTextField,
  ConfigGridContainer,
  ItemFormPartProps,
} from '../configuration';
import { useFormikContext } from 'formik';
import { Configuration } from '../../../model/configuration/configuration';
import { getDefaultSensor, Sensor, SensorTypes } from '../../../model/sensor';
import { Typography } from '@mui/material';
import { Booleanify } from '../../../utils/Booleanify';

const objectName = 'sensors';

const SensorFormPart: FC<ItemFormPartProps<Sensor>> = ({ readonly, obj: sensor }) => {
  const { values } = useFormikContext<Configuration>();

  const sensorIdx = values.sensors.findIndex((sen) => sen.sensorId === sensor.sensorId);
  if (sensorIdx === -1) {
    console.error(`SensorFormPart couldn't find index in the sensor list for sensor:`, sensor);
    return (
      <Typography variant={'body1'}>Sensor {sensor.sensorId} - couldn&apos;t find this sensor in the list</Typography>
    );
  }

  return (
    <>
      <Typography variant={'body1'}>Sensor {sensor.sensorId}</Typography>
      <ConfigGridContainer>
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'sensorId'}
          idx={sensorIdx}
          readOnly={true}
        />
        <ConfigFormDropDown
          allVariants={SensorTypes}
          objectName={'sensors'}
          propertyName={'sensorType'}
          idx={sensorIdx}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.sensorType}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'location.longitude'}
          idx={sensorIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.location.longitude}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'location.latitude'}
          idx={sensorIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.location.latitude}
        />
      </ConfigGridContainer>
    </>
  );
};

type SensorsFormPartProps = {
  readonly: boolean | Booleanify<Sensor>;
  currentSectorId: number;
};

export const SensorsFormPart: FC<SensorsFormPartProps> = ({ readonly, currentSectorId }) => {
  const { values } = useFormikContext<Configuration>();

  const sensorsInSector = Configuration.getSensorsForSectorId(values, currentSectorId);

  return (
    <ConfigArrayForm
      name={objectName}
      ChildForm={SensorFormPart}
      defaultObj={getDefaultSensor()}
      data={sensorsInSector}
      readonly={readonly}
    />
  );
};
