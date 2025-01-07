import { useSelector } from "react-redux";
import { RootState } from "../../../store/reduxStore";
import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, Divider, List, ListItem, DialogActions } from "@mui/material";
import { Camera } from "../../../model/camera";
import { FireBrigade } from "../../../model/FireBrigade";
import { ForesterPatrol } from "../../../model/ForesterPatrol";
import { Sensor } from "../../../model/sensor";
import { getObjectsInSector } from "../../../utils/configuration/getSensorsInSector";
import RenderSimulationItem from "../RenderSimulationItem";
import { MapWrapper } from "../../maps/MapWrapper";
import { MainMap } from "../../maps/MainMap";

export default function FireBrigadeDialog() {

   const {
      configuration: mapConfiguration,
      currentSectorId,
      fileSystemNode,
   } = useSelector((state: RootState) => state.mapConfiguration);

   const [open, setOpen] = useState(false);

   const handleClickOpen = () => {
      setOpen(true);
   };

   const handleClose = () => {
      setOpen(false);
   };

   if (currentSectorId === null) {
      return null;
   }

   return (
      <>
         <Button variant="contained" sx={{ width: '150px' }} onClick={handleClickOpen}>Move</Button>

         <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth='sm'
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
               Move Brigade
            </DialogTitle>
            <DialogContent>
               <MapWrapper>
                  <MainMap />
               </MapWrapper>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} variant="contained" color='error'>
                  Close
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
}