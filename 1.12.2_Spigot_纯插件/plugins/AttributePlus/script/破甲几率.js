var priority = 102
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
    var data = Attr.getData(attacker, handle)
    AttributeAPI.takeSourceAttribute(data, "破甲属性效果");
	if(chance) {
        // 获取当前对方是否处于破甲状态
        // 计算削弱值
        var defense_value = (Attr.getRandomValue(attacker, "物理伤害", handle) > 0) ? Attr.getRandomValue(entity, "物理防御", handle) / (1 + Attr.getRandomValue(attacker, "伤害加成", handle) / 100) * pojiavalue : 0
        var true_defense_value = (Attr.getRandomValue(attacker, "斗天真伤", handle) > 0) ? Attr.getRandomValue(entity, "斗天真防", handle) / (1 + (Attr.getRandomValue(attacker, "斗天真伤加成", handle) + Attr.getRandomValue(attacker, "伤害加成", handle)) / 100) * pojiavalue : 0
        var lightning_defense_value = (Attr.getRandomValue(attacker, "雷霆伤害", handle) > 0) ? Attr.getRandomValue(entity, "雷霆防御", handle) / (1 + (Attr.getRandomValue(attacker, "雷霆伤害加成", handle) + Attr.getRandomValue(attacker, "伤害加成", handle)) / 100) * pojiavalue : 0
        var poison_defense_value = (Attr.getRandomValue(attacker, "毒素伤害", handle) > 0) ? Attr.getRandomValue(entity, "毒素防御", handle) / (1 + (Attr.getRandomValue(attacker, "毒素伤害加成", handle) + Attr.getRandomValue(attacker, "伤害加成", handle)) / 100) * pojiavalue : 0
        var execution_defense_value = (Attr.getRandomValue(attacker, "处决伤害", handle) > 0) ? Attr.getRandomValue(entity, "处决防御", handle) / (1 + (Attr.getRandomValue(attacker, "处决伤害加成", handle) + Attr.getRandomValue(attacker, "伤害加成", handle)) / 100) * pojiavalue : 0
        var holy_defense_value = (Attr.getRandomValue(attacker, "神圣伤害", handle) > 0) ? Attr.getRandomValue(entity, "神圣防御", handle) / (1 + (Attr.getRandomValue(attacker, "神圣伤害加成", handle) + Attr.getRandomValue(attacker, "伤害加成", handle)) / 100) * pojiavalue : 0
        // 添加削弱效果
        AttributeAPI.addSourceAttribute(data, "破甲属性效果", Arrays.asList("物理伤害: +" + defense_value.toFixed(2), 
                                                                            "斗天真伤: +" + true_defense_value.toFixed(2),
                                                                            "雷霆伤害: +" + lightning_defense_value.toFixed(2),
                                                                            "毒素伤害: +" + poison_defense_value.toFixed(2),
                                                                            "处决伤害: +" + execution_defense_value.toFixed(2),
                                                                            "神圣伤害: +" + holy_defense_value.toFixed(2),
                                                                            "破甲判断: +1"));
            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§3§l破甲§r§a§l," + "§a§l并削弱了对方的防御");
            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§3§l破甲§r§a§l," + "§a§l并被削弱了防御");
        }
        AttributeAPI.runEntityTask(2000, "破甲恢复任务", attacker, false, function(){
            // 恢复防御
            AttributeAPI.takeSourceAttribute(data, "破甲属性效果");
		})
    return chance
}