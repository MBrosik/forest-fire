import { ConfigArrayForm, ConfigFormTextField, ConfigGridContainer, ItemFormPartProps } from '../configuration';
import { Camera, getDefaultCamera } from '../../../model/camera';
import { useFormikContext } from 'formik';
import { Configuration } from '../../../model/configuration/configuration';
import { FC } from 'react';
import { Typography } from '@mui/material';
import { Booleanify } from '../../../utils/Booleanify';

const objectName = 'cameras';

export const CameraFormPart: FC<ItemFormPartProps<Camera>> = ({ readonly, obj: camera }) => {
  const { values } = useFormikContext<Configuration>();

  const cameraIdx = values.cameras.findIndex((cam) => cam.cameraId === camera.cameraId);
  if (cameraIdx === -1) {
    console.error(`CameraFormPart couldn't find index in the camera list for camera:`, camera);
    return (
      <Typography variant={'body1'}>Camera {camera.cameraId} - couldn&apos;t find this camera in the list</Typography>
    );
  }

  return (
    <>
      <Typography variant={'body1'}>Camera {camera.cameraId}</Typography>
      <ConfigGridContainer>
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'cameraId'}
          idx={cameraIdx}
          readOnly={true}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'range'}
          idx={cameraIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.range}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'location.longitude'}
          idx={cameraIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.location.longitude}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'location.latitude'}
          idx={cameraIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.location.latitude}
        />
      </ConfigGridContainer>
    </>
  );
};

type CamerasFormPartProps = {
  readonly: boolean | Booleanify<Camera>;
  currentSectorId: number;
};

export const CamerasFormPart: FC<CamerasFormPartProps> = ({ readonly, currentSectorId }) => {
  const { values } = useFormikContext<Configuration>();

  const camerasInSector = Configuration.getCamerasForSectorId(values, currentSectorId);

  return (
    <ConfigArrayForm
      name={objectName}
      ChildForm={CameraFormPart}
      defaultObj={getDefaultCamera()}
      data={camerasInSector}
      readonly={readonly}
    />
  );
};
