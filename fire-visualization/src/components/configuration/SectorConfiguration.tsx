import { FC } from 'react';
import {
  ConfigArrayForm,
  ConfigFormDropDown,
  ConfigFormTextField,
  ConfigGridContainer,
  ItemFormPartProps,
} from './configuration';
import { getDefaultSector, Sector, SectorTypes } from '../../model/sector';
import { useFormikContext } from 'formik';
import { Configuration } from '../../model/configuration/configuration';
import { Directions } from '../../model/geography';
import { Booleanify } from '../../utils/Booleanify';
import { Typography } from '@mui/material';

const objectName = 'sectors';

export const SectorFormPart: FC<ItemFormPartProps<Sector>> = ({ readonly, obj: sector }) => {
  const { values } = useFormikContext<Configuration>();

  const sectorIdx = values.sectors.findIndex((sec) => sec.sectorId === sector.sectorId);
  if (sectorIdx === -1) {
    console.error(`SectorFormPart couldn't find index in the sector list for sector:`, sector);
    return (
      <Typography variant={'body1'}>Sector {sector.sectorId} - couldn&apos;t find this sector in the list</Typography>
    );
  }

  return (
    <ConfigGridContainer>
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'sectorId'}
        idx={sectorIdx}
        readOnly={true}
        type={'number'}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'row'}
        idx={sectorIdx}
        readOnly={true}
        type={'number'}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'column'}
        idx={sectorIdx}
        readOnly={true}
        type={'number'}
      />
      <ConfigFormDropDown
        objectName={objectName}
        allVariants={SectorTypes}
        propertyName={'sectorType'}
        idx={sectorIdx}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.sectorType}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'initialState.temperature'}
        idx={sectorIdx}
        type={'number'}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.initialState.temperature}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'initialState.windSpeed'}
        idx={sectorIdx}
        type={'number'}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.initialState.windSpeed}
      />
      <ConfigFormDropDown
        allVariants={Directions}
        objectName={objectName}
        propertyName={'initialState.windDirection'}
        idx={sectorIdx}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.initialState.windDirection}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'initialState.airHumidity'}
        idx={sectorIdx}
        type={'number'}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.initialState.airHumidity}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'initialState.plantLitterMoisture'}
        idx={sectorIdx}
        type={'number'}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.initialState.plantLitterMoisture}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'initialState.co2Concentration'}
        idx={sectorIdx}
        type={'number'}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.initialState.co2Concentration}
      />
      <ConfigFormTextField
        objectName={objectName}
        propertyName={'initialState.pm2_5Concentration'}
        idx={sectorIdx}
        type={'number'}
        readOnly={typeof readonly === 'boolean' ? readonly : readonly.initialState.pm2_5Concentration}
      />
    </ConfigGridContainer>
  );
};

type SectorsFormPartProps = {
  readonly: boolean | Booleanify<Sector>;
};

export const SectorsFormPart: FC<SectorsFormPartProps> = ({ readonly }) => {
  const { values } = useFormikContext<Configuration>();

  return (
    <ConfigArrayForm
      name={'sectors'}
      ChildForm={SectorFormPart}
      defaultObj={getDefaultSector()}
      data={values.sectors}
      readonly={readonly}
    />
  );
};
