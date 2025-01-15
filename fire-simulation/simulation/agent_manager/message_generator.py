from datetime import datetime

from simulation.agent import Agent
from simulation.sectors.sector import Sector
from simulation.fire_brigades.fire_brigade import FireBrigade
from simulation.fire_brigades.fire_brigade_state import FIREBRIGADE_STATE
from simulation.forester_patrols.forester_patrol import ForesterPatrol
from simulation.forester_patrols.forest_patrols_state import FORESTERPATROL_STATE
from simulation.sectors.fire_state import FireState

def generate_traveling_message(agent: Agent):

    if isinstance(agent, FireBrigade):

        return {
                "fireBrigadeId": agent.fire_brigade_id,
                "state": FIREBRIGADE_STATE.TRAVELLING.name,
                "timestamp": datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
                "location": {
                    "longitude": agent.location.longitude,
                    "latitude": agent.location.latitude
                }
            }
    
    elif isinstance(agent, ForesterPatrol):
        return  {
                "foresterPatrolId": agent.forester_patrol_id,
                "state": FORESTERPATROL_STATE.TRAVELLING.name,
                "timestamp": datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
                "location": {
                    "longitude": agent.location.longitude,
                    "latitude": agent.location.latitude
                }
            }
    
def generate_message_available(agent : Agent):
    if isinstance(agent, FireBrigade):
        return {
            "fireBrigadeId": agent.fire_brigade_id,
            "state": FIREBRIGADE_STATE.AVAILABLE.name,
            "timestamp": datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
            "location": {
                "longitude": agent.location.longitude,
                "latitude": agent.location.latitude
            }
        }
    
    elif isinstance(agent, ForesterPatrol):

        return {
            "foresterPatrolId" : agent.forester_patrol_id,
            "state" : FORESTERPATROL_STATE.AVAILABLE.name,
            "timestamp" : datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
            "location": {
                "longitude" : agent.location.longitude,
                "latitude" : agent.location.latitude
            }
        }
    
def generate_message_extinguished(agent : Agent, sector: Sector):
    if isinstance(agent, FireBrigade):
        return  {
            "fireBrigadeId": agent.fire_brigade_id,
            "state": FIREBRIGADE_STATE.AVAILABLE.name,
            "fireState": sector.fire_state.name,
            "timestamp": datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
            "location": {
                "longitude" : agent.location.longitude,
                "latitude" : agent.location.latitude
            }
        }
    
def generate_message_extinguishing(agent : Agent):
    if isinstance(agent, FireBrigade):
        return  {
            "fireBrigadeId": agent.fire_brigade_id,
            "state": FIREBRIGADE_STATE.EXTINGUISHING.name,
            "timestamp": datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
            "location": {
                "longitude" : agent.location.longitude,
                "latitude" : agent.location.latitude
            }
        }

def generate_message_patrolling(agent : Agent, sector : Sector):
    if isinstance(agent, ForesterPatrol):
        return {
            "foresterPatrolId" : agent.forester_patrol_id,
            "state" : FORESTERPATROL_STATE.PATROLLING.name,
            "timestamp" : datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
            "location": {
                "longitude" : agent.location.longitude,
                "latitude" : agent.location.latitude
            },
            "sectorState": sector.fire_state.name
        }