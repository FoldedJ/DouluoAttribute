var priority = 102
var combatPower = 5.0
var attributeName = "神圣几率"
var attributeType = "ATTACK"
var placeholder = "holyRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("神圣伤害", 10.0, "holyDamage");
    Utils.registerOtherAttribute("神圣判断", 1.0, "isholy");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算神圣的几率
	var rate = Attr.getRandomValue(attacker, "神圣几率", handle);
	var chance = Attr.chance(rate);

	if(chance) {
        // 获取自己的神圣伤害
        var holy_damage = Attr.getRandomValue(attacker, "神圣伤害", handle);
        // 获取对方的神圣防御
        var holy_defense = Attr.getRandomValue(entity, "神圣防御", handle);
        // 计算基础伤害
        damage = ((holy_damage - holy_defense) > 0) ? (holy_damage - holy_defense) : 0;
        // 获取自己的暴击几率
        var crit_rate = Attr.getRandomValue(attacker, "暴击几率", handle);
        // 获取对方的暴击闪避
        var crit_dodge = Attr.getRandomValue(entity, "暴击闪避", handle);
        // 计算暴击几率
        var crit_rate_final = ((crit_rate - crit_dodge) > 0) ? (crit_rate - crit_dodge) : 0;
        // 计算暴击几率是否触发
        var crit_chance = Attr.chance(crit_rate_final);
        if (crit_chance) {
            // 获取自己的暴伤倍率
            var crit_damage = Attr.getRandomValue(attacker, "暴伤倍率", handle);
            // 获取对方的暴击抵抗
            var crit_resist = Attr.getRandomValue(entity, "暴击抵抗", handle);
            // 计算暴击伤害
            var crit_hit = ((crit_damage - crit_resist) / 100 > 0) ? (crit_damage - crit_resist) / 100 : 0;
            var crit_damage_value = damage * (1 + crit_hit);
            Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
            attacker.sendMessage("§7[§c系统§7] §b你触发了一次§e§l神圣§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0) + "§b,并削弱了对方的防御");
            entity.sendMessage("§7[§c系统§7] §b你受到了一次§e§l神圣§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0) + "§b,并被削弱了防御");
        } else {
            Attr.addDamage(attacker, damage.toFixed(0), handle);
            attacker.sendMessage("§7[§c系统§7] §b你触发了一次§e§l神圣§r§b,伤害为§e§l" + damage.toFixed(0) + "§b,并削弱了对方的防御");
            entity.sendMessage("§7[§c系统§7] §b你受到了一次§e§l神圣§r§b,伤害为§e§l" + damage.toFixed(0) + "§b,并被削弱了防御");
        }
        // 获取当前对方是否处于神圣状态
        var isholy = Attr.getRandomValue(entity, "神圣判断", handle);
        if (isholy == 0) {
            // 获取对方的防御力(需要适配具体名字)
            var defense = Attr.getRandomValue(entity, "物理防御", handle);
            var true_defense = Attr.getRandomValue(entity, "真防", handle);
            var lightning_defense = Attr.getRandomValue(entity, "雷电防御", handle);
            var poison_defense = Attr.getRandomValue(entity, "毒素防御", handle);
            var execution_defense = Attr.getRandomValue(entity, "处决防御", handle);
            var holy_defense = Attr.getRandomValue(entity, "神圣防御", handle);
            // 获取属性源
            var data = Attr.getData(entity, handle)
            // 计算削弱值
            var defense_value = defense * 0.1
            var true_defense_value = true_defense * 0.1
            var lightning_defense_value = lightning_defense * 0.1
            var poison_defense_value = poison_defense * 0.1
            var execution_defense_value = execution_defense * 0.1
            var holy_defense_value = holy_defense * 0.1
            // 添加削弱效果
            AttributeAPI.addSourceAttribute(data, "神圣效果", Arrays.asList("物理防御: -" + defense_value.toFixed(0), 
                                                                            "真防: -" + true_defense_value.toFixed(0),
                                                                            "雷电防御: -" + lightning_defense_value.toFixed(0),
                                                                            "毒素防御: -" + poison_defense_value.toFixed(0),
                                                                            "处决防御: -" + execution_defense_value.toFixed(0),
                                                                            "神圣防御: -" + holy_defense_value.toFixed(0),
                                                                            "神圣判断: +1"));
        }
        AttributeAPI.runEntityTask(10000, "神圣任务", attacker, false, function(){
            // 恢复防御力
            AttributeAPI.takeSourceAttribute(data, "神圣效果");
		})
	}
    return chance
}