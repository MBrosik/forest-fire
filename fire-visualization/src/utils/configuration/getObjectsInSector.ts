import { Camera, isCamera } from "../../model/camera";
import { FireBrigade } from "../../model/FireBrigade";
import { ForesterPatrol } from "../../model/ForesterPatrol";
import { MapObject } from "../../model/generalTypes";
import { Sector } from "../../model/sector";
import { isSensor, Sensor } from "../../model/sensor";


export function getObjectsInSector<T extends MapObject>(sector: Sector, sensors: T[]): T[] {
   const lon_min = sector.contours[0][0];
   const lon_max = sector.contours[2][0];
   const lat_min = sector.contours[0][1];
   const lat_max = sector.contours[2][1];

   return sensors.filter(sensor => {
      if (isSensor(sensor) || isCamera(sensor)) {
         return (
            lon_min <= sensor.location.longitude &&
            sensor.location.longitude <= lon_max &&
            lat_min <= sensor.location.latitude &&
            sensor.location.latitude <= lat_max
         );
      } else {
         return (
            lon_min <= sensor.currentLocation.longitude &&
            sensor.currentLocation.longitude <= lon_max &&
            lat_min <= sensor.currentLocation.latitude &&
            sensor.currentLocation.latitude <= lat_max
         );
      }
   });
}