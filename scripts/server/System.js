const system = server.registerSystem(0, 0)

let skippedTicks = 0 // todo: something more reliable than waiting 5 seconds

system.initialize = function () {

	// todo: filter only players
	simple_query = this.registerQuery();

	this.listenForEvent("minecraft:entity_death", entity_death);
	this.listenForEvent("minecraft:player_placed_block", entity_placed_block);
	this.listenForEvent("minecraft:block_destruction_started", block_destruction_started);
	this.listenForEvent("minecraft:entity_attack", entity_attack)

	let loggerData = system.createEventData("minecraft:script_logger_config");
	loggerData.data.log_information = true;
	loggerData.data.log_warnings = true;
	loggerData.data.log_errors = true;
	system.broadcastEvent("minecraft:script_logger_config", loggerData);
}


system.update = function () {
	if (skippedTicks >= 50) {
		GameController.Update(system.getEntitiesFromQuery(simple_query).filter(entity => entity.__identifier__ == "minecraft:player"))
	} else {
		skippedTicks++
    }
}

system.shutdown = function () {
}

function entity_death(eventData) {
	GameController.EntityDied(eventData.data.entity, eventData.data.killer)
}

function entity_placed_block(eventData) {
	GameController.EntityPlacedBlock(eventData.data.player, eventData.data.block_position)
}

function block_destruction_started(eventData) {
	GameController.EntityTriedToDestroyBlock(eventData.data.player, eventData.data.block_position)
}

function entity_attack(eventData) {
	GameController.EntityAttack(eventData.data.entity, eventData.data.target)
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

this.NullifyDamageFromTag = function (entity, tag) {
	let damageSensorComponent = system.getComponent(entity, "minecraft:damage_sensor");
	if (damageSensorComponent == null) {
		damageSensorComponent = system.createComponent(entity, "minecraft:damage_sensor");
	}
	damageSensorComponent.data.push({
		"on_damage": {
			"filters": {
				"test": "has_tag",
				"subject": "other",
				"value": tag
			}
		},
		"deals_damage": false
	})
	system.applyComponentChanges(entity, damageSensorComponent);
}

this.ClearNullifiedDamage = function (entity) {
	system.applyComponentChanges(entity, system.createComponent(entity, "minecraft:damage_sensor"));
}