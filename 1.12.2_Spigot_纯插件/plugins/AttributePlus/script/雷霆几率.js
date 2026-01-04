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
	Utils.registerOtherAttribute("雷霆范围", 10.0, "lightningRange");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
	var chance = Attr.chance(Attr.getRandomValue(attacker, "雷霆几率", handle) - Attr.getRandomValue(entity, "雷霆躲避", handle));
	// 触发
    if(chance) {
        // 有效伤害减免(已经除以了100)
        var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "伤害减免", handle) / 100);
        // 有效阶段防御
        var stage_reduction = 1.0;
        if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
            var stage_reduction = (Attr.getRandomValue(entity, "阶段防御", handle) > Attr.getRandomValue(attacker, "阶段攻击", handle)) ? 0.01 : 1.0;
        }
        // 计算暴击率
	    var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
        // 计算元素暴率率
        var yuansu_crit_chance = Attr.chance(Attr.getRandomValue(attacker, "元素暴率", handle) - Attr.getRandomValue(entity, "元素躲暴", handle));
        // 获取雷霆觉醒
        var final_damage_multiplier = Attr.getRandomValue(attacker, "雷霆觉醒", handle) / 100;
        // 计算破甲效果值
        var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                        ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	    pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue; 
        // 获取雷霆防御
        var defense = (Attr.getRandomValue(entity, "雷霆防御", handle) * ( (Attr.getRandomValue(attacker, "破甲判断", handle) == 1) ? (1 - pojiavalue) : 1 ));
        // 计算基础雷霆伤害
        var damage = ((Attr.getRandomValue(attacker, "雷霆伤害", handle) - defense) > 0) ? (Attr.getRandomValue(attacker, "雷霆伤害", handle) - defense) : 0;
		// 获取雷霆范围
        var lightningRange = Attr.getRandomValue(attacker, "雷霆范围", handle);
        var is_yuansu_crit = false;
        // 触发元素暴率
        if (yuansu_crit_chance) {
            is_yuansu_crit = true;
        }
        // 计算最终伤害
        if (crit_chance || is_yuansu_crit) {
            if (is_yuansu_crit) {
                // 元素暴率
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"元素暴伤",handle) - Attr.getRandomValue(entity,"元素暴抗",handle) ) / 100 * damage > damage ?
                ( 100 + Attr.getRandomValue(attacker,"元素暴伤",handle) - Attr.getRandomValue(entity,"元素暴抗",handle) ) / 100 * damage : damage;
            } else {
                // 计算暴击倍率
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage > damage ?
                ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage : damage;
            }
            if (Utils.hasCooling("雷霆冷却组", attacker, 6.0)) {
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                Attr.addDamage(attacker, (crit_damage_value * (1.05 + final_damage_multiplier)).toFixed(0), handle);
                if (is_yuansu_crit) {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§d§l元素暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§d§l元素暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * stage_reduction).toFixed(0));
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * stage_reduction).toFixed(0));
                }
                // 获取实体列表
                var entities = Utils.getNearbyEntities(attacker, 2 + lightningRange, 2 + lightningRange, 2 + lightningRange, false);
                for (size in entities) {
                    if ((entities[size] != entity) && !Utils.isType(entities[size], Arrays.asList(EntityType.PLAYER))) {
                        entities[size].getWorld().strikeLightningEffect(entities[size].getLocation());
                        AttributeAPI.attackTo(entities[size], attacker, (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0));
                        if (is_yuansu_crit) {
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§d§l元素暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0) + "§a§l,并攻击了周围" + (2 + lightningRange) + "§a§l格内的所有敌人");
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§d§l元素暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0));
                        } else {
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0) + "§a§l,并攻击了周围" + (2 + lightningRange) + "§a§l格内的所有敌人");
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * (1.05 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0));
                        }
                    }
                }
            } else {
                Attr.addDamage(attacker, (crit_damage_value).toFixed(0), handle);
                if (is_yuansu_crit) {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§d§l元素暴击§r§a§l,伤害为§9§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§d§l元素暴击§r§a§l,伤害为§9§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§c§l暴击§r§a§l,伤害为§9§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                }
            }
        } else {
            if (Utils.hasCooling("雷霆冷却组", attacker, 6.0)) {
                entity.getWorld().strikeLightningEffect(entity.getLocation());
                Attr.addDamage(attacker, (damage * (1.2 + final_damage_multiplier)).toFixed(0), handle);
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * (1.2 + final_damage_multiplier) * real_reduction * stage_reduction).toFixed(0));
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * (1.2 + final_damage_multiplier) * real_reduction * stage_reduction).toFixed(0));
                // 获取实体列表
                var entities = Utils.getNearbyEntities(attacker, 2 + lightningRange, 2 + lightningRange, 2 + lightningRange, false);
                for (size in entities) {
                    if ((entities[size] != entity) && !Utils.isType(entities[size], Arrays.asList(EntityType.PLAYER))) {
                        // 获取雷霆范围
                        entities[size].getWorld().strikeLightningEffect(entities[size].getLocation());
                        AttributeAPI.attackTo(entities[size], attacker, (damage * (1.2 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0)); 
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * (1.2 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0) + "§a§l,并攻击了周围" + (2 + lightningRange) + "§a§l格内的所有敌人");
                        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * (1.2 + final_damage_multiplier) * real_reduction * 0.1 * stage_reduction).toFixed(0));
                    }
                }
            } else {
                Attr.addDamage(attacker, damage.toFixed(0), handle);
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * real_reduction * stage_reduction).toFixed(0));
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§9§l雷霆§r§a§l,伤害为§9§l" + (damage * real_reduction * stage_reduction).toFixed(0));
            }
        }
	}
    return chance
}