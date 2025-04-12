import { Box, Button, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";


const RecommendedDecisions = () => {
   return (
      <Box>
         <Divider><Typography variant="h2">Recommended Decision</Typography> </Divider>         
         <List sx={{display: 'grid', gridTemplateColumns: '1fr'}}>
            <ListItem sx={{display: 'grid', width:"100%", gridTemplateColumns: '400px 100px 100px', gap:5}}>               
               <Typography>Action 1</Typography>
               <Button variant="contained" color="success">Apply</Button>
               <Button variant="contained" color="error">Cancel</Button>
            </ListItem>
            <ListItem sx={{display: 'grid',  gridTemplateColumns: '400px 100px 100px', gap:5}}>               
               <Typography>Action 2 </Typography>
               <Button variant="contained" color="success">Apply</Button>
               <Button variant="contained" color="error">Cancel</Button>
            </ListItem>
         </List>         
      </Box>
   );
};

export default RecommendedDecisions;