import json
import logging

from simulation.forest_map import ForestMap
from simulation.rabbitmq.message_store import MessageStore
from simulation.agent_state import AGENT_STATE
from simulation.agent import Agent
from simulation.agent_manager.message_generator import *
from simulation.fire_brigades.fire_brigade import FireBrigade
from simulation.forester_patrols.forester_patrol import ForesterPatrol
from simulation.agent_manager.order import *
from simulation.agent_manager.action_type import *

logger = logging.getLogger(__name__)

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

        logger.warning("AgentManager class has been created.")
        for brigade in self.brigades.values():
            logger.warning(f"Brigade {brigade.fire_brigade_id} has been added!")
        for patrol in self.patrols.values():
            logger.warning(f"Patrol {patrol.forester_patrol_id} has been added!")

    @property
    def brigades(self):
        return self._brigades
    
    @property
    def patrols(self):
        return self._patrols
    
    @property
    def agents(self):
        return self._agents
    
    def _get_queue_name(self, agent: Agent):
        return "Fire brigades state topic" if isinstance(agent, FireBrigade) else "Forester patrol state topic"
    
    def update_state(self, agent: Agent):
        logger.warning(f"Updating state for agent {agent.getId}, current state: {agent.state}")
        if agent.state == AGENT_STATE.TRAVELLING:
            if self.update_position(agent):
                agent._location = agent.destination
                if agent.destination == agent.base_location:
                    logger.warning(f"Agent {agent.getId} returned to base.")
                    agent.set_state_available()
                    self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_available(agent))
                else:
                    logger.warning(f"Agent {agent.getId} reached task destination.")
                    agent.set_state_executing()
                    if isinstance(agent, FireBrigade):
                        self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_extinguishing(agent))
                    elif isinstance(agent, ForesterPatrol):
                        self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_patrolling(agent, self.agents[agent]))
                    agent.increment_agents_in_sector(self.agents[agent]) 
        elif agent.state == AGENT_STATE.EXECUTING:
            if agent.is_task_finished(self.agents[agent]):
                logger.warning(f"Agent {agent.getId} completed its task.")
                if isinstance(agent, FireBrigade):
                    sector = self._map.find_sector(agent.location)
                    self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_extinguished(agent, sector))
                agent.set_state_available()
                self._storage.add_message_to_sent(self._get_queue_name(agent), generate_message_available(agent))

    def _calculate_step(self, target: float, current: float, delta: float) -> float:
        return min(delta, target - current) if target > current else max(-delta, target - current) if target < current else 0

    def update_position(self, agent : Agent) -> bool:
        logger.warning(f"Updating position for agent {agent.getId}. Current location: {agent.location}")
        agent.location.latitude += self._calculate_step(agent.destination.latitude, agent.location.latitude, 0.005)
        agent.location.longitude += self._calculate_step(agent.destination.longitude, agent.location.longitude, 0.005)

        self.agents[agent] = self._map.find_sector(agent.location)

        self._storage.add_message_to_sent(self._get_queue_name(agent), generate_traveling_message(agent))

        at_destination = (
            abs(agent.destination.latitude - agent.location.latitude) <= 0.001 and
            abs(agent.destination.longitude - agent.location.longitude) <= 0.001
            # logger.warning(f"Agent {agent.getId} reached location {agent.location.latitude}, {agent.location.longtitude}.")
        )
        if at_destination:
            logger.warning(f"Agent {agent.getId} reached destination {agent.destination}.")
        return at_destination

    def update_agents_states(self):
        logger.warning("Updating states for all agents.")
        for agent in self.agents.keys():
            self.update_state(agent)

    def process_order(self, order: Order):
        logger.warning(f"Processing order: {order}")
        if isinstance(order, FireBrigadeOrder):
            brigade = self.brigades.get(order._fire_brigade_id)
            if brigade is None:
                logger.warning(f"No fire brigade found with ID {order._fire_brigade_id}.")
                return

            if order._action == FIREBRIGADE_ACTION.GO_TO_BASE:
                logger.warning(f"Order received: Brigade {order._fire_brigade_id} returning to base.")
                brigade.change_destination(brigade.base_location)
            elif order._action == FIREBRIGADE_ACTION.EXTINGUISH:
                logger.warning(f"Order received: Brigade {order._fire_brigade_id} extinguishing fire at {order._location}.")
                brigade.set_state_travelling(order._location)

        elif isinstance(order, ForesterPatrolOrder):
            patrol = self.patrols.get(order._forester_patrol_id)
            if patrol is None:
                logger.warning(f"No forester patrol found with ID {order._forester_patrol_id}.")
                return

            if order._action == FORESTERPATROL_ACTION.GO_TO_BASE:
                logger.warning(f"Order received: Patrol {order._forester_patrol_id} returning to base.")
                patrol.change_destination(patrol.base_location)
            elif order._action == FORESTERPATROL_ACTION.PATROL:
                logger.warning(f"Order received: Patrol {order._forester_patrol_id} patrolling location {order._location}.")
                patrol.set_state_travelling(order._location)

    def start_processing_orders(self):
        logger.warning("Starting order processing loop.")
        while True:
            message = self._storage.get_received_message("Fire brigades action queue")
            if message is not None:
                logger.warning(f"Message received from Fire brigades queue: {message}")
                # logger.warning(type(message))
                # logger.warning(message["fireBrigadeId"])
                json_message = message
                if json_message["action"] == "FIREBRIGADE_ACTION.GO_TO_BASE":
                    action = FIREBRIGADE_ACTION.GO_TO_BASE
                    location = None
                else:
                    action = FIREBRIGADE_ACTION.EXTINGUISH
                    location = Location(json_message["location"]["latitude"], json_message["location"]["longitude"])
                order = FireBrigadeOrder(fire_brigade_id=json_message["fireBrigadeId"], action=action, location=location)
                self.process_order(order)

            message = self._storage.get_received_message("Forester patrol action queue")
            if message is not None:
                logger.warning(f"Message received from Forester patrol queue: {message}")
                json_message = message
                if json_message["action"] == "FORESTERPATROL_ACTION.GO_TO_BASE":
                    action = FORESTERPATROL_ACTION.GO_TO_BASE
                    location = None
                else:
                    action = FORESTERPATROL_ACTION.PATROL
                    location = Location(json_message["location"]["latitude"], json_message["location"]["longitude"])
                order = ForesterPatrolOrder(forester_patrol_id=json_message["foresterPatrolId"], action=action, location=location)
                self.process_order(order)

    