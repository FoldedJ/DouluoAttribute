var priority = 120
var combatPower = 5.0
var attributeName = "破甲几率"
var attributeType = "ATTACK"
var placeholder = "pojiaRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("破甲效果", 10.0, "pojiaEffect");
    Utils.registerOtherAttribute("破甲判断", 1.0, "ispojia");
    Utils.registerOtherAttribute("破甲抵抗", 1.0, "pojiaResist");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算破甲的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "破甲几率", handle));
    var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                     ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue;
    var ispojia = Attr.getRandomValue(entity, "破甲判断", handle);
    var data = Attr.getData(entity, handle)
    if (ispojia == 1) {
        AttributeAPI.takeSourceAttribute(data, "破甲属性效果");
    }
	if(chance) {
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§3§l破甲§r§a§l," + "§a§l并削弱了对方的防御");
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§3§l破甲§r§a§l," + "§a§l并被削弱了防御");
        // 获取当前对方是否处于破甲状态
        
        if (ispojia == 0) {
            // 计算削弱值
            var defense_value = Attr.getRandomValue(entity, "物理防御", handle) * pojiavalue
            var true_defense_value = Attr.getRandomValue(entity, "斗天真防", handle) * pojiavalue
            var lightning_defense_value = Attr.getRandomValue(entity, "雷霆防御", handle) * pojiavalue
            var poison_defense_value = Attr.getRandomValue(entity, "毒素防御", handle) * pojiavalue
            var execution_defense_value = Attr.getRandomValue(entity, "处决防御", handle) * pojiavalue
            var holy_defense_value = Attr.getRandomValue(entity, "神圣防御", handle) * pojiavalue
            // 添加削弱效果
            AttributeAPI.addSourceAttribute(data, "破甲属性效果", Arrays.asList("物理防御: -" + defense_value.toFixed(0), 
                                                                            "斗天真防: -" + true_defense_value.toFixed(0),
                                                                            "雷霆防御: -" + lightning_defense_value.toFixed(0),
                                                                            "毒素防御: -" + poison_defense_value.toFixed(0),
                                                                            "处决防御: -" + execution_defense_value.toFixed(0),
                                                                            "神圣防御: -" + holy_defense_value.toFixed(0),
                                                                            "破甲判断: +1"));
        }
	}
    return chance
}