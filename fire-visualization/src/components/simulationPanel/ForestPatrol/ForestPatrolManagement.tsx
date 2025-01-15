import { Box, Button, Divider, List, ListItem, Typography } from "@mui/material";
import RenderSimulationItem from "../RenderSimulationItem";
import { FireBrigade } from "../../../model/FireBrigade";
import { mock } from "node:test";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/reduxStore";
import { useMemo } from "react";
import { getObjectsInSector } from "../../../utils/configuration/getObjectsInSector";

export default function ForestPatrolManagement() {
   const {
      configuration: mapConfiguration,
      currentSectorId,
      fileSystemNode,
   } = useSelector((state: RootState) => state.mapConfiguration);

   if (currentSectorId === null) {
      return null;
   }

   const forestPatrols = getObjectsInSector(mapConfiguration.sectors[currentSectorId - 1], mapConfiguration.foresterPatrols);

   return (
      <Box>
         <Divider><Typography variant="h2">Forest Patrols</Typography></Divider>
         <List>
            {forestPatrols.map((obj, ind) => (
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
                  key={ind}
               >
                  <RenderSimulationItem object={obj} />
               </ListItem>
            ))}
         </List>        
      </Box>
   )
}