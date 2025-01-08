import json

from simulation.forest_map import ForestMap
from simulation.rabbitmq.message_store import MessageStore
from simulation.agent_state import AGENT_STATE
from simulation.agent import Agent
from simulation.agent_manager.message_generator import *
from simulation.fire_brigades.fire_brigade import FireBrigade
from simulation.forester_patrols.forester_patrol import ForesterPatrol
from simulation.agent_manager.order import *
from simulation.agent_manager.action_type import *

class AgentManager:

    def __init__(self, map : ForestMap, storage : MessageStore):
        self._map = map
        self._storage = storage

        self._brigades = {
            fire_brigade.fire_brigade_id: fire_brigade
            for fire_brigade in map._fire_brigades
        }

        self._patrols = {
            patrol.forester_patrol_id: patrol
            for patrol in map._forester_patrols
        }

        self._agents = {
            agent: map.find_sector(agent.location)
            for agent in map._fire_brigades + map._forester_patrols
        }


    @property
    def brigades(self):
        return self._brigades
    
    @property
    def patrols(self):
        return self._patrols
    
    @property
    def agents(self):
        return self._agents
    
    def _get_queue_name(agent: Agent):
        return "Fire brigades state topic" if isinstance(agent, FireBrigade) else "Forester patrol state topic"
    
    def update_state(self, agent: Agent):
        if agent.state == AGENT_STATE.TRAVELLING:
            if(self.update_position(agent)):
                if(agent.destination == agent.base_location):
                    agent.set_state_available()
                    self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_available(agent))
                else:
                    agent.set_state_executing()
                    if isinstance(agent, FireBrigade):
                        self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_extinguishing(agent))
                    elif isinstance(agent, ForesterPatrol):
                        self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_patrolling(agent, self.agents[agent]))
                    agent.increment_agents_in_sector(self.agents[agent]) 
        elif agent.state == AGENT_STATE.EXECUTING:
            if(agent.is_task_finished(self.agents[agent])):
                if(isinstance(agent, FireBrigade)):
                    self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_extinguished(agent))
                agent.set_state_available()
                self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_available(agent))

    def _calculate_step(self, target: float, current: float, delta: float) -> float:
        if target > current:
            return min(delta, target - current)
        elif target < current:
            return max(-delta, target - current)
        return 0

    def update_position(self, agent : Agent) -> bool:
        agent.location.latitude += self._calculate_step(agent.destination.latitude, agent.location.latitude, 0.1)
        agent.location.longitude +=  self._calculate_step(agent.destination.longitude, agent.location.longitude, 0.1)

        self.agents[agent] = self._map.find_sector(agent.location)

        self._storage.add_message_to_sent(self._get_queue_name(agent), generate_traveling_message(agent))

        return (
             abs(agent.destination.latitude - agent.location.latitude) <= 0.1 and
             abs(agent.destination.longitude - agent.location.longitude) <= 0.1
         )

    def update_agents_states(self):
        for agent in self.agents.keys():
            self.update_state(agent)

    
    def process_order(self, order: Order):
        if isinstance(order, FireBrigadeOrder):
            
            brigade = self.brigades.get(order._fire_brigade_id)

            if order._action == FIREBRIGADE_ACTION.GO_TO_BASE:
                brigade.change_destination(brigade.base_location)
                
            elif order._action == FIREBRIGADE_ACTION.EXTINGUISH:
                brigade.change_destination(order._location)

        elif isinstance(order, ForesterPatrolOrder):
            patrol = self.patrols.get(order._forester_patrol_id)

            if order._action == FORESTERPATROL_ACTION.GO_TO_BASE:
                patrol.change_destination(patrol.base_location)
            
            elif order._action == FORESTERPATROL_ACTION.PATROL:
                patrol.change_destination(order._location)
                
    
    def start_processing_orders(self):
        while True:
            message = self._storage.get_received_message("Fire brigades state topic")
            if message is not None:
                json_message = json.loads(message)
                if json_message["action"] == "FIREBRIGADE_ACTION.GO_TO_BASE":
                    action = FIREBRIGADE_ACTION.GO_TO_BASE
                else:
                    action = FIREBRIGADE_ACTION.EXTINGUISH
                    location = Location(json_message["location"]["latitude"], json_message["location"]["longitude"])
                order = FireBrigadeOrder(fire_brigade_id=json_message["fireBrigadeId"], action=action, location=location)
                self.process_order(order)
            
            message = self._storage.get_received_message("Forester patrol state topic")
            if message is not None:
                json_message = json.loads(message)
                if json_message["action"] == "FORESTERPATROL_ACTION.GO_TO_BASE":
                    action = FORESTERPATROL_ACTION.GO_TO_BASE
                else:
                    action = FORESTERPATROL_ACTION.PATROL
                    location = Location(json_message["location"]["latitude"], json_message["location"]["longitude"])
                order = ForesterPatrolOrder(forester_patrol_id=["foresterPatrolId"], action=action, location=location)
                self.process_order(order)

    