import { Button, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Camera, isCamera } from "../../model/camera";
import { FireBrigade } from "../../model/FireBrigade";
import { ForesterPatrol, isForesterPatrol } from "../../model/ForesterPatrol";
import { Sensor, isSensor } from "../../model/sensor";
import FireBrigadeDialog from "./FireBrigade/FireBrigadeDialog";
import MoveBrigadeToBaseButton from "./FireBrigade/MoveToBaseButton";
import MoveForestPatrolToBaseButton from "./ForestPatrol/MoveToBaseButton";
import ForestPatrolDialog from "./ForestPatrol/ForestPatrolDialog";


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
            <MoveForestPatrolToBaseButton forestPatrolID={object.foresterPatrolId}/>
            <ForestPatrolDialog forestPatrolID={object.foresterPatrolId} />
         </>
      );
   } else {
      
      return (
         <>
            <Typography sx={{ width: 50 }}>ID: {object.fireBrigadeId}</Typography>
            <Typography>State: {object.state}</Typography>            
            <MoveBrigadeToBaseButton fireBrigadeID={object.fireBrigadeId}/>
            <FireBrigadeDialog fireBrigadeID={object.fireBrigadeId} />
         </>
      );
   }
};
