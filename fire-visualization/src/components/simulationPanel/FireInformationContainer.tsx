import { useSelector } from "react-redux";
import { RootState } from "../../store/reduxStore";
import { Box, Typography } from "@mui/material";

export default function FireInformationContainer() {
   const {
      configuration: mapConfiguration,
      currentSectorId,
      fileSystemNode,
   } = useSelector((state: RootState) => state.mapConfiguration);

   // if (currentSectorId === null) {
   //    return null;
   // }

   return (
      <Box sx={{paddingTop: 2, paddingBottom: 2}}>         
         <Typography>Fire class: 3</Typography>
         <Typography>Chance to put on the fire: 70% </Typography>         
      </Box>
   );
}