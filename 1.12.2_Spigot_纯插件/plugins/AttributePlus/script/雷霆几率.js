var priority = 104
var combatPower = 5.0
var attributeName = "雷霆几率"
var attributeType = "ATTACK"
var placeholder = "lightningRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("雷霆伤害", 10.0, "lightningDamage");
    Utils.registerOtherAttribute("雷霆防御", 10.0, "lightningDefense");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
	var chance = Attr.chance(Attr.getRandomValue(attacker, "雷霆几率", handle));

	if(chance) {
		if (Utils.hasCooling("雷霆冷却组", attacker, 5.0)) {
			// 触发
            // 计算暴击率
	        var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
            // 计算基础雷霆伤害
            var damage = ((Attr.getRandomValue(attacker, "雷霆伤害", handle) - Attr.getRandomValue(entity, "雷霆防御", handle)) > 0) ? (Attr.getRandomValue(attacker, "雷霆伤害", handle) - Attr.getRandomValue(entity, "雷霆防御", handle)) : 0;
            // 计算最终伤害
            if (crit_chance) {
                // 计算暴击伤害
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击伤害",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage > damage ?
	            ( 100 + Attr.getRandomValue(attacker,"暴击伤害",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage : damage;
                Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                attacker.sendMessage("§7[§c系统§7] §b你触发了一次§9§l雷霆§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
                entity.sendMessage("§7[§c系统§7] §b你受到了一次§9§l雷霆§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
            } else {
                Attr.addDamage(attacker, damage.toFixed(0), handle);
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                // attacker.sendMessage("§7[§c系统§7] §b你触发了一次§9§l雷霆§r§b,伤害为§e§l" + damage.toFixed(0));
                // entity.sendMessage("§7[§c系统§7] §b你受到了一次§9§l雷霆§r§b,伤害为§e§l" + damage.toFixed(0));
            }
		}
	}
    return chance
}
