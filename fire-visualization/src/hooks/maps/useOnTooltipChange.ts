import { useEffect, ReactNode, Dispatch, SetStateAction, useRef } from 'react';
import { eventEmitter } from '../../utils/eventEmitter';
// import { EventEmitter } from 'eventemitter3';

export const useOnTooltipChange = (setTooltipCallback: Dispatch<SetStateAction<ReactNode>>) => {
  // const eventEmitterRef = useRef(new EventEmitter());
  useEffect(
    () => {
      const onTooltipChange = (tooltip: ReactNode) => {
        // console.log('tooltip', tooltip);
        
        setTooltipCallback(tooltip)
      };

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
