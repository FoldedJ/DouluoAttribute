/*
已知bug：
1.玩家在被毒素攻击死亡后，如果对方的毒素攻击还未结束，在玩家0.5秒内复活时，会受到一次毒素
maybe it has been fixed, but who fking cares?
*/
var priority = 106
var combatPower = 5.0
var attributeName = "毒素几率"
var attributeType = "ATTACK"
var placeholder = "poisonRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("毒素伤害", 10.0, "poisonDamage");
    Utils.registerOtherAttribute("毒素伤害段", 500.0, "poisonTickDamage");
    Utils.registerOtherAttribute("毒素防御", 5.0, "poisonDefense");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 有效伤害减免系数
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 20 : 100 - Attr.getRandomValue(entity, "伤害减免", handle);
    // 计算毒素的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "毒素几率", handle));
    // 获取毒素伤害段
    var poison_tick_damage = Attr.getRandomValue(attacker, "毒素伤害段", handle);

	if(chance) {
		if (Utils.hasCooling("毒素冷却组", attacker, 2.0)) {
            // 计算暴击率
	        var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
            // 计算基础毒素伤害
            var damage = ((Attr.getRandomValue(attacker, "毒素伤害", handle) - Attr.getRandomValue(entity, "毒素防御", handle)) > 0) ? 
            (Attr.getRandomValue(attacker, "毒素伤害", handle) - Attr.getRandomValue(entity, "毒素防御", handle)) * real_reduction / 100 : 0;

            var data = Attr.getData(entity, handle);
            var counter = data.counter.getCounter("毒素触发", "DEATH");
            var counterValue = counter.updateValue(1, 0);

            // 计算最终伤害
            if (crit_chance) {
                // 计算暴击伤害
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击伤害",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage > damage ?
	            ( 100 + Attr.getRandomValue(attacker,"暴击伤害",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage : damage;
                for (var i = 0; i < poison_tick_damage + 2; ++i) {
                    AttributeAPI.runEntityTask(500 * i, "毒素暴击任务" + (i + 10000 * counterValue), attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead() || entity.getKiller() == null) {
                            return;
                        }   
                        AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                        attacker.sendMessage("§7[§c系统§7] §b你触发了一次§2§l毒素§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
                        entity.sendMessage("§7[§c系统§7] §b你受到了一次§2§l毒素§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
                        // 如果被击杀
                        if (entity.isDead() || entity.getKiller() == null) {
                            return;
                        }   
                    })
                }
            } else {
                for (var i = 0; i < poison_tick_damage + 2; ++i) {
                    AttributeAPI.runEntityTask(500 * i, "毒素任务" + i, attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                        AttributeAPI.attackTo(entity, attacker, damage.toFixed(0));
                        attacker.sendMessage("§7[§c系统§7] §b你触发了一次§2§l毒素§r§b,伤害为§e§l" + damage.toFixed(0));
                        entity.sendMessage("§7[§c系统§7] §b你受到了一次§2§l毒素§r§b,伤害为§e§l" + damage.toFixed(0));
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                    })
                }
            }
        }
	}
    return chance
}
