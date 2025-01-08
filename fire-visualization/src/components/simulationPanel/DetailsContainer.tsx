import { Button, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reduxStore";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ReactNode, useState } from "react";
import { getObjectsInSector } from "../../utils/configuration/getObjectsInSector";
import { Camera, isCamera } from "../../model/camera";
import { FireBrigade } from "../../model/FireBrigade";
import { ForesterPatrol, isForesterPatrol } from "../../model/ForesterPatrol";
import { Sensor, isSensor } from "../../model/sensor";
import RenderSimulationItem from "./RenderSimulationItem";

type Props = {

}

const DetailsContainer = (props: Props) => {

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
         <Button variant="contained" sx={{ width: '150px' }} onClick={handleClickOpen}>Details</Button>

         <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth='sm'
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
               Sector {currentSectorId} Details
            </DialogTitle>
            <DialogContent>
               {/* <DialogContentText id="alert-dialog-description">
                  Let Google help apps determine location. This means sending anonymous
                  location data to Google, even when no apps are running.
               </DialogContentText> */}
               {([["Sensors", mapConfiguration.sensors], ["Cameras", mapConfiguration.cameras], ["Fire Brigades", mapConfiguration.fireBrigades], ["Forester Patrols", mapConfiguration.foresterPatrols]] as [string, (Sensor | Camera | FireBrigade | ForesterPatrol)[]][]).map(element => (
                  <>
                     <Divider>{element[0]}</Divider>
                     <List>
                        {getObjectsInSector(mapConfiguration.sectors[currentSectorId - 1], element[1]).map(obj => (
                           <ListItem
                              sx={{
                                 height: 1,
                                 cursor: 'pointer',
                                 display: 'inline-flex',
                                 justifyContent: 'space-between',
                                 p: '2px',
                                 borderRadius: '4px',
                                 transition: 'all 0.25s',
                                 '&:hover': {
                                    bgcolor: 'secondary.lighter',
                                 },
                              }}
                           >
                              {/* {renderItem(obj)} */}
                              <RenderSimulationItem object={obj} />
                           </ListItem>
                        ))}
                     </List>
                  </>
               ))}


            </DialogContent>
            <DialogActions>

               <Button onClick={handleClose} variant="contained" color='error'>
                  Close
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
};

export default DetailsContainer;