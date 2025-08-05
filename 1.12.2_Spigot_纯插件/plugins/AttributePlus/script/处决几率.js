var priority = 101
var combatPower = 5.0
var attributeName = "处决几率"
var attributeType = "ATTACK"
var placeholder = "executionRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("处决伤害", 10.0, "executionDamage");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算处决的几率
	var rate = Attr.getRandomValue(attacker, "处决几率", handle);
	var chance = Attr.chance(rate);

	if(chance) {
		if (Utils.hasCooling("处决冷却组", attacker, 5.0)) {
			//触发
            // 获取自己的处决伤害
            var execution_damage = Attr.getRandomValue(attacker, "处决伤害", handle);
            // 获取对方的处决防御
            var execution_defense = Attr.getRandomValue(entity, "处决防御", handle);
            // 获取自己的暴击几率
            var crit_rate = Attr.getRandomValue(attacker, "暴击几率", handle);
            // 获取对方的暴击闪避
            var crit_dodge = Attr.getRandomValue(entity, "暴击闪避", handle);
            // 计算暴击几率
            var crit_rate_final = ((crit_rate - crit_dodge) > 0) ? (crit_rate - crit_dodge) : 0;
            // 计算暴击几率是否触发
            var crit_chance = Attr.chance(crit_rate_final);
            // 计算基础伤害
            damage1 = ((execution_damage - execution_defense) > 0) ? (execution_damage - execution_defense) : 0;
            // 获取对方的生命值
            var health = entity.getHealth();
            // 百分比伤害
            damage2 = health * 0.1;
            // 计算最终伤害
            if (crit_chance) {
                // 获取自己的暴伤倍率
                var crit_damage = Attr.getRandomValue(attacker, "暴伤倍率", handle);
                // 获取对方的暴击抵抗
                var crit_resist = Attr.getRandomValue(entity, "暴击抵抗", handle);
                // 计算暴击伤害
                var crit_hit = ((crit_damage - crit_resist) / 100 > 0) ? (crit_damage - crit_resist) / 100 : 0;
                var crit_damage_value = damage1 * (1 + crit_hit);
                Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
                AttributeAPI.attackTo(entity, attacker, damage2.toFixed(0)); 
                attacker.sendMessage("§7[§c系统§7] §b你触发了一次§4§l处决§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0) + "§b并造成了§e" + damage2.toFixed(0) + "§b的额外伤害");
                entity.sendMessage("§7[§c系统§7] §b你受到了一次§4§l处决§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0)+ "§b并造成了§e" + damage2.toFixed(0) + "§b的额外伤害");
            } else {
                Attr.addDamage(attacker, damage1.toFixed(0), handle);
                AttributeAPI.attackTo(entity, attacker, damage2.toFixed(0)); 
                attacker.sendMessage("§7[§c系统§7] §b你触发了一次§4§l处决§r§b,伤害为§e§l" + damage1.toFixed(0) + "§b并造成了§e" + damage2.toFixed(0) + "§b的额外伤害");
                entity.sendMessage("§7[§c系统§7] §b你受到了一次§4§l处决§r§b,伤害为§e§l" + damage1.toFixed(0)+ "§b并造成了§e" + damage2.toFixed(0) + "§b的额外伤害");
            }
		}
	}
    return chance
}
