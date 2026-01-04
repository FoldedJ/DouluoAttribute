var priority = 120
var combatPower = 5.0
var attributeName = "神圣几率"
var attributeType = "ATTACK"
var placeholder = "holyRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("神圣伤害", 10.0, "holyDamage");
    Utils.registerOtherAttribute("神圣判断", 1.0, "isholy");
    Utils.registerOtherAttribute("神圣防御", 5.0, "holyDefense");
    Utils.registerOtherAttribute("神圣躲避", 5.0, "holyDodge");
    Utils.registerOtherAttribute("神圣觉醒", 5.0, "holyEffect");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算神圣的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "神圣几率", handle) - Attr.getRandomValue(entity, "神圣躲避", handle));
    // 触发神圣
	if(chance) {
        // 有效伤害减免
        var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "伤害减免", handle) / 100);
        // 有效阶段防御
        var stage_reduction = 1.0;
        if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
            var stage_reduction = (Attr.getRandomValue(entity, "阶段防御", handle) > Attr.getRandomValue(attacker, "阶段攻击", handle)) ? 0.01 : 1.0;
        }
        // 计算破甲效果值
        var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                        ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	    pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue; 
        // 获取神圣防御
        var defense = (Attr.getRandomValue(entity, "神圣防御", handle) * ( (Attr.getRandomValue(attacker, "破甲判断", handle) == 1) ? (1 - pojiavalue) : 1 ));
        // 计算基础伤害
        var damage = ((Attr.getRandomValue(attacker, "神圣伤害", handle) - defense) > 0) ? (Attr.getRandomValue(attacker, "神圣伤害", handle) - defense) : 0;
        // 计算暴击率
	    var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
        // 计算元素暴率率
        var yuansu_crit_chance = Attr.chance(Attr.getRandomValue(attacker, "元素暴率", handle) - Attr.getRandomValue(entity, "元素躲暴", handle));
        // 获取神圣觉醒
        var holy_effect = Attr.getRandomValue(attacker, "神圣觉醒", handle) / 100;
        var is_yuansu_crit = false;
        if (Utils.hasCooling("神圣冷却组", attacker, 15.0)) {
            // 触发元素暴率
            if (yuansu_crit_chance) {
                is_yuansu_crit = true;
            }
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
                Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
                if (is_yuansu_crit) {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§e§l神圣§d§l元素暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0) + "§a§l,并削弱了对方的防御");
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§e§l神圣§d§l元素暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0) + "§a§l,并被削弱了防御");
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§e§l神圣§c§l暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0) + "§a§l,并削弱了对方的防御");
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§e§l神圣§c§l暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0) + "§a§l,并被削弱了防御");
                }
            } else {
                Attr.addDamage(attacker, damage.toFixed(0), handle);
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§e§l神圣§r§a§l,伤害为§e§l" + (damage * real_reduction * stage_reduction).toFixed(0) + "§a§l,并削弱了对方的防御");
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§e§l神圣§r§a§l,伤害为§e§l" + (damage * real_reduction * stage_reduction).toFixed(0) + "§a§l,并被削弱了防御");
            }
            var data = Attr.getData(entity, handle)
            var data2 = Attr.getData(attacker, handle)
            // 获取当前对方是否处于神圣状态
            var isholy = Attr.getRandomValue(entity, "神圣判断", handle);
            if (isholy == 0) {
                // 计算削弱值
                var defense_value = Attr.getRandomValue(entity, "物理防御", handle) / (1 + Attr.getRandomValue(entity, "防御加成", handle) / 100) * (0.1 + holy_effect)
                var true_defense_value = Attr.getRandomValue(entity, "斗天真防", handle) / (1 + Attr.getRandomValue(entity, "斗天真防加成", handle) / 100) * (0.1 + holy_effect)
                var lightning_defense_value = Attr.getRandomValue(entity, "雷霆防御", handle) / (1 + Attr.getRandomValue(entity, "雷霆防御加成", handle) / 100) * (0.1 + holy_effect)
                var poison_defense_value = Attr.getRandomValue(entity, "毒素防御", handle) / (1 + Attr.getRandomValue(entity, "毒素防御加成", handle) / 100) * (0.1 + holy_effect)
                var execution_defense_value = Attr.getRandomValue(entity, "处决防御", handle) / (1 + Attr.getRandomValue(entity, "处决防御加成", handle) / 100) * (0.1 + holy_effect)
                var holy_defense_value = Attr.getRandomValue(entity, "神圣防御", handle) / (1 + Attr.getRandomValue(entity, "神圣防御加成", handle) / 100) * (0.1 + holy_effect)
                // 添加削弱效果
                AttributeAPI.addSourceAttribute(data, "神圣觉醒", Arrays.asList("物理防御: -" + defense_value.toFixed(2), 
                                                                            "斗天真防: -" + true_defense_value.toFixed(2),
                                                                            "雷霆防御: -" + lightning_defense_value.toFixed(2),
                                                                            "毒素防御: -" + poison_defense_value.toFixed(2),
                                                                            "处决防御: -" + execution_defense_value.toFixed(2),
                                                                            "神圣防御: -" + holy_defense_value.toFixed(2),
                                                                            "神圣判断: +1"));
                AttributeAPI.addSourceAttribute(data2, "神圣击杀", Arrays.asList("神圣击杀触发: +1"));
            }
            AttributeAPI.runEntityTask(10000, "神圣任务", entity, false, function(){
                // 恢复物理防御
                AttributeAPI.takeSourceAttribute(data, "神圣觉醒");
		    })
        } else {
            // 触发元素暴率
            if (yuansu_crit_chance) {
                is_yuansu_crit = true;
            }
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
                Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
                if (is_yuansu_crit) {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§e§l神圣§d§l元素暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§e§l神圣§d§l元素暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                } else {
                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§e§l神圣§c§l暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§e§l神圣§c§l暴击§r§a§l,伤害为§e§l" + (crit_damage_value * real_reduction * stage_reduction).toFixed(0));
                }
            } else {
                Attr.addDamage(attacker, damage.toFixed(0), handle);
                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§e§l神圣§r§a§l,伤害为§e§l" + (damage * real_reduction * stage_reduction).toFixed(0));
                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§e§l神圣§r§a§l,伤害为§e§l" + (damage * real_reduction * stage_reduction).toFixed(0));
            }
        }
	}
    return chance
}