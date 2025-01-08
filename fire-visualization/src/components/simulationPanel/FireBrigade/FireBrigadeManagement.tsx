import { Box, Button, Divider, List, ListItem, Typography } from "@mui/material";
import RenderSimulationItem from "../RenderSimulationItem";
import { FireBrigade } from "../../../model/FireBrigade";
import { mock } from "node:test";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reduxStore";
import { useMemo } from "react";
import { getObjectsInSector } from "../../../utils/configuration/getObjectsInSector";

export default function FireBrigadeManagement() {
   const {
      configuration: mapConfiguration,
      currentSectorId,
      fileSystemNode,
   } = useSelector((state: RootState) => state.mapConfiguration);

   if (currentSectorId === null) {
      return null;
   }

   const filteredBrigades = getObjectsInSector(mapConfiguration.sectors[currentSectorId - 1], mapConfiguration.fireBrigades);

   return (
      <Box>
         <Divider><Typography variant="h2">Fire Brigades</Typography></Divider>
         <List>
            {filteredBrigades.map((obj) => (
               <ListItem
                  sx={{
                     height: 1,
                     cursor: 'pointer',
                     display: 'inline-flex',
                     justifyContent: 'space-between',
                     p: '2px',
                     borderRadius: '4px',
                     transition: 'all 0.25s',
                     width: '500px',
                     '&:hover': {
                        bgcolor: 'secondary.lighter',
                     },
                  }}
               >
                  <RenderSimulationItem object={obj} />
               </ListItem>
            ))}
         </List>
         {/* <Button variant="contained" color="primary">Move here</Button> */}
      </Box>
   )
}