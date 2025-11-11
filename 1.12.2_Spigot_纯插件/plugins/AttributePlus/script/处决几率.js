var priority = 107
var combatPower = 5.0
var attributeName = "处决几率"
var attributeType = "ATTACK"
var placeholder = "executionRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("处决伤害", 10.0, "executionDamage");
    Utils.registerOtherAttribute("处决防御", 5.0, "executionDefense");
    Utils.registerOtherAttribute("处决躲避", 5.0, "executionDodge");
    Utils.registerOtherAttribute("处决觉醒", 5.0, "executionPercent");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算处决的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "处决几率", handle) - Attr.getRandomValue(entity, "处决躲避", handle));
    var executionPercent = Attr.getRandomValue(attacker, "处决觉醒", handle) / 100;
    // 有效伤害减免系数
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 20 : 100 - Attr.getRandomValue(entity, "伤害减免", handle);
	if(chance) {
			// 触发
            // 计算暴击率
	        var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
            // 计算基础伤害
            var damage1 = ((Attr.getRandomValue(attacker, "处决伤害", handle) - Attr.getRandomValue(entity, "处决防御", handle)) > 0) ? (Attr.getRandomValue(attacker, "处决伤害", handle) - Attr.getRandomValue(entity, "处决防御", handle)) : 0;
            // 百分比伤害
            var damage2 = entity.getHealth() * (0.05 + executionPercent) * real_reduction / 100;
            // 计算最终伤害
            if (crit_chance) {
                // 计算暴击倍率
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage1 > damage1 ?
	            ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage1 : damage1;
                Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
                if (Utils.hasCooling("处决冷却组", attacker, 3.0)) {
                    AttributeAPI.attackTo(entity, attacker, damage2.toFixed(0)); 
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§c§l暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100).toFixed(0) + "§a§l并造成了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处§c§l决暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100).toFixed(0)+ "§a§l并受到了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§c§l暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处§c§l决暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100).toFixed(0));
                }
            } else {
                Attr.addDamage(attacker, damage1.toFixed(0), handle);
                if (Utils.hasCooling("处决冷却组", attacker, 2.0)) {
                    AttributeAPI.attackTo(entity, attacker, damage2.toFixed(0)); 
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100).toFixed(0) + "§a§l并造成了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100).toFixed(0)+ "§a§l并受到了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100).toFixed(0));
                }
		}
	}
    return chance
}
