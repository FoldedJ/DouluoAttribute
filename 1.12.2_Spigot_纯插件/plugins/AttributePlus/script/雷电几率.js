var priority = 104
var combatPower = 5.0
var attributeName = "雷电几率"
var attributeType = "ATTACK"
var placeholder = "lightningRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("雷电伤害", 10.0, "lightningDamage");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算雷电的几率
	var rate = Attr.getRandomValue(attacker, "雷电几率", handle);
	var chance = Attr.chance(rate);

	if(chance) {
		if (Utils.hasCooling("雷电冷却组", attacker, 20.0)) {
			// 触发
            // 获取自己的雷电伤害
            var lightning_damage = Attr.getRandomValue(attacker, "雷电伤害", handle);
            // 获取对方的雷电防御
            var lightning_defense = Attr.getRandomValue(entity, "雷电防御", handle);
            // 获取自己的暴击几率
            var crit_rate = Attr.getRandomValue(attacker, "暴击几率", handle);
            // 获取对方的暴击闪避
            var crit_dodge = Attr.getRandomValue(entity, "暴击闪避", handle);
            // 计算暴击几率
            var crit_rate_final = ((crit_rate - crit_dodge) > 0) ? (crit_rate - crit_dodge) : 0;
            // 计算暴击几率是否触发
            var crit_chance = Attr.chance(crit_rate_final);
            // 计算伤害
            damage = ((lightning_damage - lightning_defense) > 0) ? (lightning_damage - lightning_defense) : 0;
            // 计算最终伤害
            if (crit_chance) {
                // 获取自己的暴伤倍率
                var crit_damage = Attr.getRandomValue(attacker, "暴伤倍率", handle);
                // 获取对方的暴击抵抗
                var crit_resist = Attr.getRandomValue(entity, "暴击抵抗", handle);
                // 计算暴击伤害
                var crit_hit = ((crit_damage - crit_resist) / 100 > 0) ? (crit_damage - crit_resist) / 100 : 0;
                var crit_damage_value = damage * (1 + crit_hit);
                Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                attacker.sendMessage("§7[§c系统§7] §b你触发了一次§9§l雷电§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
                entity.sendMessage("§7[§c系统§7] §b你受到了一次§9§l雷电§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
            } else {
                Attr.addDamage(attacker, damage.toFixed(0), handle);
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                attacker.sendMessage("§7[§c系统§7] §b你触发了一次§9§l雷电§r§b,伤害为§e§l" + damage.toFixed(0));
                entity.sendMessage("§7[§c系统§7] §b你受到了一次§9§l雷电§r§b,伤害为§e§l" + damage.toFixed(0));
            }
		}
	}
    return chance
}
