import { useEffect } from 'react';
import { eventEmitter } from '../../utils/eventEmitter';

export const useOnSectorChange = (onSectorChangeCallback: (sectorId: number | null) => void) => {
  useEffect(
    () => {
      eventEmitter.addListener('onSectorChange', onSectorChangeCallback);

      return () => {
        eventEmitter.removeListener('onSectorChange', onSectorChangeCallback);
      };
    },
    // ON PURPOSE:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
