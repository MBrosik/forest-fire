import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/reduxStore";
import { sendBrigadeOrForesterMoveToBaseOrder } from "../../../store/reducers/serverCommunicationReducers";

type Props = {
   forestPatrolID: number;
}
export default function MoveToBaseButton(props: Props) {
   const dispatch: AppDispatch = useDispatch();
   
   const handleClick = () => {
      dispatch(sendBrigadeOrForesterMoveToBaseOrder(props.forestPatrolID, "forester"));
   }

   return (
      <Button variant="contained" color="secondary" onClick={handleClick}>Move to Base</Button>
   )
}