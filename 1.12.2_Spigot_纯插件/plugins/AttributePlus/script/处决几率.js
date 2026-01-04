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
    Utils.registerOtherAttribute("处决伤害转储", 0.0, "executionDamageTransfer");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算处决的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "处决几率", handle) - Attr.getRandomValue(entity, "处决躲避", handle));
    var executionPercent = Attr.getRandomValue(attacker, "处决觉醒", handle) / 100;
    // 有效伤害减免系数
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 20 : 100 - Attr.getRandomValue(entity, "伤害减免", handle);
    // 有效阶段防御
    var stage_reduction = 1.0;
    if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        var stage_reduction = (Attr.getRandomValue(entity, "阶段防御", handle) > Attr.getRandomValue(attacker, "阶段攻击", handle)) ? 0.01 : 1.0;
    }
    var data_attacker = Attr.getData(attacker, handle);
    AttributeAPI.takeSourceAttribute(data_attacker, "处决转储");
	if(chance) {
		// 触发
        // 计算暴击率
	    var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
        // 计算元素暴率率
	    var yuansu_crit_chance = Attr.chance(Attr.getRandomValue(attacker, "元素暴率", handle) - Attr.getRandomValue(entity, "元素躲暴", handle));
        // 计算破甲效果值
        var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                 ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	    pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue;
        // 获取处决防御
        var defense = (Attr.getRandomValue(entity, "处决防御", handle) * ( (Attr.getRandomValue(attacker, "破甲判断", handle) == 1) ? (1 - pojiavalue) : 1 ));
        // 计算基础伤害
        var damage1 = ((Attr.getRandomValue(attacker, "处决伤害", handle) - defense) > 0) ? (Attr.getRandomValue(attacker, "处决伤害", handle) - defense) : 0;
        // 百分比伤害
        var damage2 = entity.getHealth() * (0.05 + executionPercent) * real_reduction / 100 * stage_reduction;
        var is_yuansu_crit = false;
        // 是否储存
        var is_chucun = false;
        if (Attr.getRandomValue(attacker, "储存判断", handle)) {
            is_chucun = true;
        }
        // 触发元素暴率
        if (yuansu_crit_chance) {
            is_yuansu_crit = true;
        }
        // 触发暴击
        if (crit_chance || is_yuansu_crit) {
            if (is_yuansu_crit) {
                // 元素暴率
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"元素暴伤",handle) - Attr.getRandomValue(entity,"元素暴抗",handle) ) / 100 * damage1 > damage1 ?
                ( 100 + Attr.getRandomValue(attacker,"元素暴伤",handle) - Attr.getRandomValue(entity,"元素暴抗",handle) ) / 100 * damage1 : damage1;
            } else {
                // 计算暴击倍率
                var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage1 > damage1 ?
                ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage1 : damage1;
            }
            Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
            if (Utils.hasCooling("处决冷却组", attacker, 6.0)) {
                if (is_chucun) {
                    AttributeAPI.addSourceAttribute(data_attacker, "处决转储", Arrays.asList("处决伤害转储: +" + damage2.toFixed(0)));
                }
                AttributeAPI.attackTo(entity, attacker, damage2.toFixed(0)); 
                if (is_yuansu_crit) {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§d§l元素暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0) + "§a§l并造成了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§d§l元素暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0)+ "§a§l并受到了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§c§l暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0) + "§a§l并造成了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§c§l暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0)+ "§a§l并受到了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                }
            } else {
                if (is_yuansu_crit) {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§d§l元素暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§d§l元素暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0));
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§c§l暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§c§l暴击§r§a§l,伤害为§c§l" + (crit_damage_value * real_reduction / 100 * stage_reduction).toFixed(0));
                }
            }
        } else {
            Attr.addDamage(attacker, damage1.toFixed(0), handle);
            if (Utils.hasCooling("处决冷却组", attacker, 6.0)) {
                if (is_chucun) {
                    AttributeAPI.addSourceAttribute(data_attacker, "处决转储", Arrays.asList("处决伤害转储: +" + damage2.toFixed(0)));
                }
                AttributeAPI.attackTo(entity, attacker, damage2.toFixed(0)); 
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100 * stage_reduction).toFixed(0) + "§a§l并造成了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100 * stage_reduction).toFixed(0)+ "§a§l并受到了§f§l" + damage2.toFixed(0) + "§a§l的额外伤害");
            } else {
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100 * stage_reduction).toFixed(0));
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§4§l处决§r§a§l,伤害为§c§l" + (damage1 * real_reduction / 100 * stage_reduction).toFixed(0));
            }
		}
    }
    return chance
}
