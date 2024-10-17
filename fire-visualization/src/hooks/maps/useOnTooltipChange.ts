import { useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { eventEmitter } from '../../utils/eventEmitter';

export const useOnTooltipChange = (setTooltipCallback: Dispatch<SetStateAction<ReactNode>>) => {
  useEffect(
    () => {
      const onTooltipChange = (tooltip: ReactNode) => setTooltipCallback(tooltip);

      eventEmitter.addListener('onTooltipChange', onTooltipChange);

      return () => {
        eventEmitter.removeListener('onTooltipChange', onTooltipChange);
      };
    },
    // ON PURPOSE:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
