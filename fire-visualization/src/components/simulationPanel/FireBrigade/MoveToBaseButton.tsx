import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/reduxStore";
import { sendBrigadeOrForesterMoveToBaseOrder } from "../../../store/reducers/serverCommunicationReducers";

type Props = {
   fireBrigadeID: number;
}
export default function MoveToBaseButton(props: Props) {
   const dispatch: AppDispatch = useDispatch();
   
   const handleClick = () => {
      dispatch(sendBrigadeOrForesterMoveToBaseOrder(props.fireBrigadeID, "brigade"));
   }

   return (
      <Button variant="contained" color="secondary" onClick={handleClick}>Move to Base</Button>
   )
}