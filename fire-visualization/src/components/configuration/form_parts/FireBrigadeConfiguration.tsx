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
import { FireBrigade, FireBrigadeStates, getDefaultFireBrigade } from '../../../model/FireBrigade';
import { Typography } from '@mui/material';
import { Booleanify } from '../../../utils/Booleanify';

const objectName = 'fireBrigades';

export const FireBrigadeFormPart: FC<ItemFormPartProps<FireBrigade>> = ({ readonly, obj: fireBrigade }) => {
  const { values } = useFormikContext<Configuration>();

  const fireBrigadeIdx = values.fireBrigades.findIndex(
    (fireBrig) => fireBrig.fireBrigadeId === fireBrigade.fireBrigadeId,
  );
  if (fireBrigadeIdx === -1) {
    console.error(`FireBrigadeFormPart couldn't find index in the fire brigade list for fire brigade:`, fireBrigade);
    return (
      <Typography variant={'body1'}>
        Fire brigade {fireBrigade.fireBrigadeId} - couldn&apos;t find this fire brigade in the list
      </Typography>
    );
  }

  return (
    <>
      <Typography variant={'body1'}>Fire brigade {fireBrigade.fireBrigadeId}</Typography>
      <ConfigGridContainer>
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'fireBrigadeId'}
          idx={fireBrigadeIdx}
          type={'number'}
          readOnly={true}
        />
        <ConfigFormDropDown
          objectName={objectName}
          propertyName={'state'}
          idx={fireBrigadeIdx}
          allVariants={FireBrigadeStates}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.state}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'baseLocation.longitude'}
          idx={fireBrigadeIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.baseLocation.longitude}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'baseLocation.latitude'}
          idx={fireBrigadeIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.baseLocation.latitude}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'currentLocation.longitude'}
          idx={fireBrigadeIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.currentLocation.longitude}
        />
        <ConfigFormTextField
          objectName={objectName}
          propertyName={'currentLocation.latitude'}
          idx={fireBrigadeIdx}
          type={'number'}
          readOnly={typeof readonly === 'boolean' ? readonly : readonly.currentLocation.latitude}
        />
      </ConfigGridContainer>
    </>
  );
};

type FireBrigadesFormPartProps = {
  readonly: boolean | Booleanify<FireBrigade>;
};

export const FireBrigadesFormPart: FC<FireBrigadesFormPartProps> = ({ readonly }) => {
  const { values } = useFormikContext<Configuration>();

  return (
    <ConfigArrayForm
      name={'fireBrigades'}
      ChildForm={FireBrigadeFormPart}
      defaultObj={getDefaultFireBrigade()}
      data={values.fireBrigades}
      readonly={readonly}
    />
  );
};
