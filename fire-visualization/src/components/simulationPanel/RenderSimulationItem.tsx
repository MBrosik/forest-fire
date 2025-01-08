import { Button, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Camera, isCamera } from "../../model/camera";
import { FireBrigade } from "../../model/FireBrigade";
import { ForesterPatrol, isForesterPatrol } from "../../model/ForesterPatrol";
import { Sensor, isSensor } from "../../model/sensor";
import FireBrigadeDialog from "./FireBrigade/FireBrigadeDialog";

type Props = {
   object: Sensor | Camera | FireBrigade | ForesterPatrol;  
}

export default function RenderSimulationItem({object}: Props): ReactNode {
   if (isSensor(object)) {
      return (
         <>
            <Typography sx={{ width: 50 }}>ID: {object.sensorId}</Typography>
            <Typography>Type: {object.sensorType}</Typography>
         </>
      );
   } else if (isCamera(object)) {
      return (
         <>
            <Typography sx={{ width: 50 }}>ID: {object.cameraId}</Typography>
            <Typography>Range: {object.range}</Typography>
         </>
      );
   } else if (isForesterPatrol(object)) {
      return (
         <>
            <Typography sx={{ width: 50 }}>ID: {object.foresterPatrolId}</Typography>
            <Typography>State: {object.state}</Typography>
         </>
      );
   } else {
      
      return (
         <>
            <Typography sx={{ width: 50 }}>ID: {object.fireBrigadeId}</Typography>
            <Typography>State: {object.state}</Typography>
            {/* <Button variant="contained" color="primary">Move</Button> */}
            <FireBrigadeDialog />
         </>
      );
   }
};
