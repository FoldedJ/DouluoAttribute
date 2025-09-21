var priority = 120
var combatPower = 5.0
var attributeName = "破甲几率"
var attributeType = "ATTACK"
var placeholder = "pojiaRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("破甲效果", 10.0, "pojiaEffect");
    Utils.registerOtherAttribute("破甲判断", 1.0, "ispojia");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算破甲的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "破甲几率", handle));

	if(chance) {
        attacker.sendMessage("§7[§c系统§7] §b你触发了一次§8§l破甲§r§b," + "§b,并削弱了对方的防御");
        entity.sendMessage("§7[§c系统§7] §b你受到了一次§8§l破甲§r§b," + "§b,并被削弱了防御");
        var data = Attr.getData(entity, handle)
        // 获取当前对方是否处于破甲状态
        var ispojia = Attr.getRandomValue(entity, "破甲判断", handle);
        if (ispojia == 0) {
            // 计算削弱值
            var defense_value = Attr.getRandomValue(entity, "防御力", handle) * 0.1
            var true_defense_value = Attr.getRandomValue(entity, "斗天真防", handle) * 0.1
            var lightning_defense_value = Attr.getRandomValue(entity, "雷电防御", handle) * 0.1
            var poison_defense_value = Attr.getRandomValue(entity, "毒素防御", handle) * 0.1
            var execution_defense_value = Attr.getRandomValue(entity, "处决防御", handle) * 0.1
            var holy_defense_value = Attr.getRandomValue(entity, "神圣防御", handle) * 0.1
            // 添加削弱效果
            AttributeAPI.addSourceAttribute(data, "破甲属性效果", Arrays.asList("防御力: -" + defense_value.toFixed(0), 
                                                                            "斗天真防: -" + true_defense_value.toFixed(0),
                                                                            "雷电防御: -" + lightning_defense_value.toFixed(0),
                                                                            "毒素防御: -" + poison_defense_value.toFixed(0),
                                                                            "处决防御: -" + execution_defense_value.toFixed(0),
                                                                            "神圣防御: -" + holy_defense_value.toFixed(0),
                                                                            "破甲判断: +1"));
        }
        AttributeAPI.runEntityTask(10000, "破甲任务", entity, false, function(){
            // 恢复防御力
            AttributeAPI.takeSourceAttribute(data, "破甲属性效果");
		})
	}
    return chance
}