/*
已知bug：
1.玩家在被毒素攻击死亡后，如果对方的毒素攻击还未结束，在玩家0.5秒内复活时，会受到一次毒素
*/
var priority = 103
var combatPower = 5.0
var attributeName = "毒素几率"
var attributeType = "ATTACK"
var placeholder = "poisonRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("毒素伤害", 10.0, "poisonDamage");
    Utils.registerOtherAttribute("毒素伤害段", 500.0, "poisonTickDamage");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算毒素的几率
	var rate = Attr.getRandomValue(attacker, "毒素几率", handle);
	var chance = Attr.chance(rate);
    // 获取毒素伤害段
    var poison_tick_damage = Attr.getRandomValue(attacker, "毒素伤害段", handle);

	if(chance) {
		if (Utils.hasCooling("毒素冷却组", attacker, 2.0)) {
            // 获取自己的毒素伤害
            var poison_damage = Attr.getRandomValue(attacker, "毒素伤害", handle);
            // 获取对方的毒素防御
            var poison_defense = Attr.getRandomValue(entity, "毒素防御", handle);
            // 获取自己的暴击几率
            var crit_rate = Attr.getRandomValue(attacker, "暴击几率", handle);
            // 获取对方的暴击闪避
            var crit_dodge = Attr.getRandomValue(entity, "暴击闪避", handle);
            // 计算暴击几率
            var crit_rate_final = ((crit_rate - crit_dodge) > 0) ? (crit_rate - crit_dodge) : 0;
            // 计算暴击几率是否触发
            var crit_chance = Attr.chance(crit_rate_final);
            // 计算最终伤害
            var damage = ((poison_damage - poison_defense) > 0) ? (poison_damage - poison_defense) : 0;

            var data = Attr.getData(entity, handle);
            var counter = data.counter.getCounter("毒素触发", "DEATH");
            var counterValue = counter.updateValue(1, 0);

            // 计算最终伤害
            if (crit_chance) {
                // 获取对方的暴击抵抗
                var crit_resist = Attr.getRandomValue(entity, "暴击抵抗", handle);                
                // 获取自己的暴伤倍率
                var crit_damage = Attr.getRandomValue(attacker, "暴伤倍率", handle);
                // 计算暴击伤害
                var crit_hit = ((crit_damage - crit_resist) / 100 > 0) ? (crit_damage - crit_resist) / 100 : 0;
                var crit_damage_value = damage * (1 + crit_hit);
                for (var i = 0; i < poison_tick_damage + 2; ++i) {
                    AttributeAPI.runEntityTask(500 * i, "毒素暴击任务" + (i + 10000 * counterValue), attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                        AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                        attacker.sendMessage("§7[§c系统§7] §b你触发了一次§2§l毒素§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
                        entity.sendMessage("§7[§c系统§7] §b你受到了一次§2§l毒素§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
                    })
                }
            } else {
                for (var i = 0; i < poison_tick_damage + 2; ++i) {
                    AttributeAPI.runEntityTask(500 * i, "毒素任务" + i, attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                        Attr.addDamage(attacker, damage.toFixed(0), handle);
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                        attacker.sendMessage("§7[§c系统§7] §b你触发了一次§2§l毒素§r§b,伤害为§e§l" + damage.toFixed(0));
                        entity.sendMessage("§7[§c系统§7] §b你受到了一次§2§l毒素§r§b,伤害为§e§l" + damage.toFixed(0));
                    })
                }
            }
        }
	}
    return chance
}
