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
    Utils.registerOtherAttribute("毒素觉醒", 500.0, "poisonTickDamage");
    Utils.registerOtherAttribute("毒素防御", 5.0, "poisonDefense");
    Utils.registerOtherAttribute("毒素躲避", 5.0, "poisonDodge");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 有效伤害减免系数
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 20 : 100 - Attr.getRandomValue(entity, "伤害减免", handle);
    // 计算毒素的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "毒素几率", handle) - Attr.getRandomValue(entity, "毒素躲避", handle));
    // 获取毒素觉醒
    var poison_tick_damage = Attr.getRandomValue(attacker, "毒素觉醒", handle);
    // 向上取整毒素觉醒
    var poison_tick_damage_ceil = Math.ceil(Attr.getRandomValue(attacker, "毒素觉醒", handle));
    // 向下取整毒素觉醒
    var poison_tick_damage_floor = Math.floor(Attr.getRandomValue(attacker, "毒素觉醒", handle));
    // 计算残差系数
    var res = (poison_tick_damage_floor == poison_tick_damage) ? 1 : poison_tick_damage - poison_tick_damage_floor;
	if(chance) {
		if (Utils.hasCooling("毒素冷却组", attacker, 2.0)) {
            // 计算暴击率
	        var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
            // 计算破甲效果值
            var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                            ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	        pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue; 
            // 获取毒素防御
            var defense = (Attr.getRandomValue(entity, "毒素防御", handle) * ( (Attr.getRandomValue(attacker, "破甲判断", handle) == 1) ? (1 - pojiavalue) : 1 ));
            // 计算基础毒素伤害
            var damage = ((Attr.getRandomValue(attacker, "毒素伤害", handle) - defense) > 0) ? 
            (Attr.getRandomValue(attacker, "毒素伤害", handle) - defense) * real_reduction / 100 : 0;

            var data = Attr.getData(entity, handle);
            var counter = data.counter.getCounter("毒素触发", "DEATH");
            var counter2 = data.counter.getCounter("毒素触发2", "DEATH");
            var counterValue = counter.updateValue(1, 0);
            var counterValue2 = counter2.updateValue(1, 0);

            // 计算最终伤害
            if (crit_chance) {
                // 计算暴击倍率
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage > damage ?
	            ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage : damage;
                // 全是整数
                if (res == 1) {
                    for (var i = 0; i < poison_tick_damage_ceil + 2; ++i) {
                    AttributeAPI.runEntityTask(500 * i, "毒素暴击任务" + (i + 10000 * counterValue), attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead() || entity.getKiller() == null) {
                            return;
                        }
                        // 计算吸血几率
                        var xixue_chance = Attr.chance(Attr.getRandomValue(attacker, "吸血几率", handle) - Attr.getRandomValue(entity, "吸血躲避", handle));
                        // 获取自己的最大生命值
                        var max_health = attacker.getMaxHealth();
                        // 获取自己当前的生命值
                        var current_health = attacker.getHealth();
                        // 获取自己的吸血倍率
                        var vam_damage = Attr.getRandomValue(attacker, "吸血倍率", handle);
                        // 获取对方的吸血抵抗
                        var vam_resist = Attr.getRandomValue(entity, "吸血抵抗", handle);
                        // 计算吸血伤害
                        var vam_damage_value = ((vam_damage - vam_resist) / 100 > 0) ? (vam_damage - vam_resist) / 100 : 0;
                        var heal_amount = (current_health + crit_damage_value * vam_damage_value * 0.5 > max_health) ? max_health : (current_health + crit_damage_value * vam_damage_value * 0.5);  
                        if (xixue_chance) {
                            // 吸血
                            attacker.setHealth(heal_amount);
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l吸血§r§a§l,恢复了§2§l" + (crit_damage_value * vam_damage_value * 0.5).toFixed(0) + " §a§l点生命值");
                        }
                        AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                        // 如果被击杀
                        if (entity.isDead() || entity.getKiller() == null) {
                            return;
                        }   
                    })
                    }
                } else {
                    // 需要进行一次残差打击
                    for (var i = 0; i < poison_tick_damage_ceil + 1; ++i) {
                        AttributeAPI.runEntityTask(500 * i, "毒素暴击任务" + (i + 10000 * counterValue), attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead() || entity.getKiller() == null) {
                            return;
                        } 
                        // 计算吸血几率
                        var xixue_chance = Attr.chance(Attr.getRandomValue(attacker, "吸血几率", handle) - Attr.getRandomValue(entity, "吸血躲避", handle));
                        // 获取自己的最大生命值
                        var max_health = attacker.getMaxHealth();
                        // 获取自己当前的生命值
                        var current_health = attacker.getHealth();
                        // 获取自己的吸血倍率
                        var vam_damage = Attr.getRandomValue(attacker, "吸血倍率", handle);
                        // 获取对方的吸血抵抗
                        var vam_resist = Attr.getRandomValue(entity, "吸血抵抗", handle);
                        // 计算吸血伤害
                        var vam_damage_value = ((vam_damage - vam_resist) / 100 > 0) ? (vam_damage - vam_resist) / 100 : 0;
                        var heal_amount = (current_health + crit_damage_value * vam_damage_value * 0.5 > max_health) ? max_health : (current_health + crit_damage_value * vam_damage_value * 0.5);  
                        if (xixue_chance) {
                            // 吸血
                            attacker.setHealth(heal_amount);
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l吸血§r§a§l,恢复了§2§l" + (crit_damage_value * vam_damage_value * 0.5).toFixed(0) + " §a§l点生命值");
                        } 
                        AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                        // 如果被击杀
                        if (entity.isDead() || entity.getKiller() == null) {
                            return;
                        }   
                        })
                    }
                    AttributeAPI.runEntityTask(500 * poison_tick_damage_ceil + 2, "毒素暴击任务" + (poison_tick_damage_ceil + 2 + 10000 * counterValue), attacker, false, function() {
                    // 如果被击杀
                    if (entity.isDead() || entity.getKiller() == null) {
                        return;
                    }
                    // 计算吸血几率
                    var xixue_chance = Attr.chance(Attr.getRandomValue(attacker, "吸血几率", handle) - Attr.getRandomValue(entity, "吸血躲避", handle));
                    // 获取自己的最大生命值
                    var max_health = attacker.getMaxHealth();
                    // 获取自己当前的生命值
                    var current_health = attacker.getHealth();
                    // 获取自己的吸血倍率
                    var vam_damage = Attr.getRandomValue(attacker, "吸血倍率", handle);
                    // 获取对方的吸血抵抗
                    var vam_resist = Attr.getRandomValue(entity, "吸血抵抗", handle);
                    // 计算吸血伤害
                    var vam_damage_value = ((vam_damage - vam_resist) / 100 > 0) ? (vam_damage - vam_resist) / 100 : 0;
                    var heal_amount = (current_health + (crit_damage_value * res) * vam_damage_value * 0.5 > max_health) ? max_health : (current_health + (crit_damage_value * res) * vam_damage_value * 0.5);  
                    if (xixue_chance) {
                        // 吸血
                        attacker.setHealth(heal_amount);
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l吸血§r§a§l,恢复了§2§l" + ((crit_damage_value * res) * vam_damage_value * 0.5).toFixed(0) + " §a§l点生命值");
                    } 
                    AttributeAPI.attackTo(entity, attacker, (crit_damage_value * res).toFixed(0));
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + (crit_damage_value * res).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + (crit_damage_value * res).toFixed(0));
                    // 如果被击杀
                    if (entity.isDead() || entity.getKiller() == null) {
                        return;
                    }   
                    })
                }
            } else {
                // 没暴击
                // 全是整数
                if (res == 1) {
                    for (var i = 0; i < poison_tick_damage_ceil + 2; ++i) {
                    AttributeAPI.runEntityTask(500 * i, "毒素任务" + (i + 10000 * counterValue2), attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }
                        // 计算吸血几率
                        var xixue_chance = Attr.chance(Attr.getRandomValue(attacker, "吸血几率", handle) - Attr.getRandomValue(entity, "吸血躲避", handle));
                        // 获取自己的最大生命值
                        var max_health = attacker.getMaxHealth();
                        // 获取自己当前的生命值
                        var current_health = attacker.getHealth();
                        // 获取自己的吸血倍率
                        var vam_damage = Attr.getRandomValue(attacker, "吸血倍率", handle);
                        // 获取对方的吸血抵抗
                        var vam_resist = Attr.getRandomValue(entity, "吸血抵抗", handle);
                        // 计算吸血伤害
                        var vam_damage_value = ((vam_damage - vam_resist) / 100 > 0) ? (vam_damage - vam_resist) / 100 : 0;
                        var heal_amount = (current_health + damage * vam_damage_value * 0.5 > max_health) ? max_health : (current_health + damage * vam_damage_value * 0.5);  
                        if (xixue_chance) {
                            // 吸血
                            attacker.setHealth(heal_amount);
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l吸血§r§a§l,恢复了§2§l" + (damage * vam_damage_value * 0.5).toFixed(0) + " §a§l点生命值");
                        }                           
                        AttributeAPI.attackTo(entity, attacker, damage.toFixed(0));
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                        })
                    }
                } else {
                    // 需要进行一次残差打击
                    for (var i = 0; i < poison_tick_damage_ceil + 1; ++i) {
                        AttributeAPI.runEntityTask(500 * i, "毒素任务" + (i + 10000 * counterValue2), attacker, false, function() {
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }  
                        // 计算吸血几率
                        var xixue_chance = Attr.chance(Attr.getRandomValue(attacker, "吸血几率", handle) - Attr.getRandomValue(entity, "吸血躲避", handle));
                        // 获取自己的最大生命值
                        var max_health = attacker.getMaxHealth();
                        // 获取自己当前的生命值
                        var current_health = attacker.getHealth();
                        // 获取自己的吸血倍率
                        var vam_damage = Attr.getRandomValue(attacker, "吸血倍率", handle);
                        // 获取对方的吸血抵抗
                        var vam_resist = Attr.getRandomValue(entity, "吸血抵抗", handle);
                        // 计算吸血伤害
                        var vam_damage_value = ((vam_damage - vam_resist) / 100 > 0) ? (vam_damage - vam_resist) / 100 : 0;
                        var heal_amount = (current_health + damage * vam_damage_value * 0.5 > max_health) ? max_health : (current_health + damage * vam_damage_value * 0.5);  
                        if (xixue_chance) {
                            // 吸血
                            attacker.setHealth(heal_amount);
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l吸血§r§a§l,恢复了§2§l" + (damage * vam_damage_value * 0.5).toFixed(0) + " §a§l点生命值");
                        }  
                        AttributeAPI.attackTo(entity, attacker, damage.toFixed(0));
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                        // 如果被击杀
                        if (entity.isDead()) {
                            return;
                        }   
                        })
                    }
                    AttributeAPI.runEntityTask(500 * poison_tick_damage_ceil + 2, "毒素任务" + poison_tick_damage_ceil + 2, attacker, false, function() {
                    // 如果被击杀
                    if (entity.isDead()) {
                        return;
                    }
                    // 计算吸血几率
                    var xixue_chance = Attr.chance(Attr.getRandomValue(attacker, "吸血几率", handle) - Attr.getRandomValue(entity, "吸血躲避", handle));
                    // 获取自己的最大生命值
                    var max_health = attacker.getMaxHealth();
                    // 获取自己当前的生命值
                    var current_health = attacker.getHealth();
                    // 获取自己的吸血倍率
                    var vam_damage = Attr.getRandomValue(attacker, "吸血倍率", handle);
                    // 获取对方的吸血抵抗
                    var vam_resist = Attr.getRandomValue(entity, "吸血抵抗", handle);
                    // 计算吸血伤害
                    var vam_damage_value = ((vam_damage - vam_resist) / 100 > 0) ? (vam_damage - vam_resist) / 100 : 0;
                    var heal_amount = (current_health + (damage * res) * vam_damage_value * 0.5 > max_health) ? max_health : (current_health + (damage * res) * vam_damage_value * 0.5);  
                    if (xixue_chance) {
                        // 吸血
                        attacker.setHealth(heal_amount);
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l吸血§r§a§l,恢复了§2§l" + ((damage * res) * vam_damage_value * 0.5).toFixed(0) + " §a§l点生命值");
                    }  
                    AttributeAPI.attackTo(entity, attacker, (damage * res).toFixed(0));
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + (damage * res).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + (damage * res).toFixed(0));
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
