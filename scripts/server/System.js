const system = server.registerSystem(0, 0)

gamePlayer = new GamePlayer()
allEntities = []

system.initialize = function () {

	// todo: filter only players
	simple_query = this.registerQuery();

	this.listenForEvent("minecraft:entity_death", entity_death);
	this.listenForEvent("minecraft:player_placed_block", entity_placed_block);

	let loggerData = system.createEventData("minecraft:script_logger_config");
	loggerData.data.log_information = true;
	loggerData.data.log_warnings = true;
	loggerData.data.log_errors = true;
	system.broadcastEvent("minecraft:script_logger_config", loggerData);
}


system.update = function () {
	allEntities = system.getEntitiesFromQuery(simple_query).filter(entity => entity.__identifier__ == "minecraft:player")
	gamePlayer.Update()
}

system.shutdown = function () {
}

function entity_death(eventData) {
	gamePlayer.EntityDied(eventData.data.entity, eventData.data.killer)
}

function entity_placed_block(eventData) {
	gamePlayer.EntityPlacedBlock(eventData.data.player, eventData.data.block_position)
}

this.Chat = function (message) {
	chatEvent = system.createEventData('minecraft:display_chat_event')
	chatEvent.data.message = message
	system.broadcastEvent('minecraft:display_chat_event', chatEvent)
}

this.SlashCommand = function (command) {
	system.executeCommand(command, commandResultData => {
		console.log(JSON.stringify(commandResultData, null, "    "))
	});
}

this.Find = function (entity) {
	return system.getComponent(entity, "minecraft:position").data
}

this.GetName = function (entity) {
	if (entity.__type__ == "item_entity")
		return entity.__identifier__
	return system.getComponent(entity, "minecraft:nameable").data.name
}

this.GetBlock = function (entity, position) {
	world = system.getComponent(entity, "minecraft:tick_world");
	return system.getBlock(world.data.ticking_area, position);
}

this.GetTags = function (entity) {
	return system.getComponent(entity, "minecraft:tag").data
}