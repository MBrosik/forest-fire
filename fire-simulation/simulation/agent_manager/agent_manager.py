from simulation.forest_map import ForestMap
from simulation.rabbitmq.message_store import MessageStore
from simulation.agent_state import AGENT_STATE
from simulation.agent import Agent
from simulation.agent_manager.message_generator import *
from simulation.fire_brigades.fire_brigade import FireBrigade
from simulation.forester_patrols.forester_patrol import ForesterPatrol

class AgentManager:

    def __init__(self, map : ForestMap, storage : MessageStore):
        self._map = map
        self._storage = storage

        self._brigades = {
            fire_brigade: map.find_sector(fire_brigade.location)
            for fire_brigade in map._fire_brigades
        }

        self._patrols = {
            patrol: map.find_sector(patrol.location)
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

    