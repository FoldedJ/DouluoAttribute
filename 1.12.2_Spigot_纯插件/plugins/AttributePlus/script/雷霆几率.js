var priority = 104
var combatPower = 5.0
var attributeName = "雷霆几率"
var attributeType = "ATTACK"
var placeholder = "lightningRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("雷霆伤害", 10.0, "lightningDamage");
    Utils.registerOtherAttribute("雷霆防御", 10.0, "lightningDefense");
    Utils.registerOtherAttribute("雷霆躲避", 10.0, "lightningDodge");
    Utils.registerOtherAttribute("雷霆觉醒", 10.0, "lightningFinalDamage");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
	var chance = Attr.chance(Attr.getRandomValue(attacker, "雷霆几率", handle) - Attr.getRandomValue(entity, "雷霆躲避", handle));

	if(chance) {
		if (Utils.hasCooling("雷霆冷却组", attacker, 3.0)) {
			// 触发
            // 有效伤害减免
            var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "伤害减免", handle) / 100);
            // 计算暴击率
	        var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
            var final_damage_multiplier = Attr.getRandomValue(attacker, "雷霆觉醒", handle) / 100;
            // 计算基础雷霆伤害
            var damage = ((Attr.getRandomValue(attacker, "雷霆伤害", handle) - Attr.getRandomValue(entity, "雷霆防御", handle)) > 0) ? (Attr.getRandomValue(attacker, "雷霆伤害", handle) - Attr.getRandomValue(entity, "雷霆防御", handle)) : 0;
            // 计算最终伤害（新增×1.05倍率）
            if (crit_chance) {
                // 计算暴击倍率
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage > damage ?
	            ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage : damage;
                // 伤害×1.05后再保留0位小数
                Attr.addDamage(attacker, (crit_damage_value * (1.05 + final_damage_multiplier)).toFixed(0), handle);
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction).toFixed(0));
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction).toFixed(0));
            } else {
                // 伤害×1.05后再保留0位小数
                Attr.addDamage(attacker, (damage * (1.15 + final_damage_multiplier)).toFixed(0), handle);
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * (1.15 + final_damage_multiplier) * real_reduction).toFixed(0));
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * (1.15 + final_damage_multiplier) * real_reduction).toFixed(0));
            }
		}
	}
    return chance
}