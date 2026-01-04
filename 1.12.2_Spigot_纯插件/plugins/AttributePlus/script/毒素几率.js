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
    Utils.registerOtherAttribute("毒素伤害转储", 0.0, "poisonDamageStore");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 有效伤害减免系数
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 20 : 100 - Attr.getRandomValue(entity, "伤害减免", handle);
    // 有效阶段防御
    var stage_reduction = 1.0;
    if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        var stage_reduction = (Attr.getRandomValue(entity, "阶段防御", handle) > Attr.getRandomValue(attacker, "阶段攻击", handle)) ? 0.01 : 1.0;
    }
    // 自己的有效伤害减免系数
    var my_real_reduction = (Attr.getRandomValue(attacker, "伤害减免", handle) >= 80) ? 20 : 100 - Attr.getRandomValue(attacker, "伤害减免", handle);
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
	
    var data = Attr.getData(entity, handle);
    var data_attacker = Attr.getData(attacker, handle);
    // 是否触发了储存
    var is_chucun = false;
    if (Attr.getRandomValue(attacker, "储存判断", handle)) {
        is_chucun = true;
    }
    AttributeAPI.takeSourceAttribute(data_attacker, "毒素转储");

    if(chance) {
        if (Utils.hasCooling("毒素冷却组", attacker, 2.0)) {
            // 计算暴击率
	        var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
            // 计算元素暴率率
            var yuansu_crit_chance = Attr.chance(Attr.getRandomValue(attacker, "元素暴率", handle) - Attr.getRandomValue(entity, "元素躲暴", handle));
            // 计算破甲效果值
            var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                            ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	        pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue; 
            // 获取毒素防御
            var defense = (Attr.getRandomValue(entity, "毒素防御", handle) * ( (Attr.getRandomValue(attacker, "破甲判断", handle) == 1) ? (1 - pojiavalue) : 1 ));
            // 计算基础毒素伤害
            var damage = ((Attr.getRandomValue(attacker, "毒素伤害", handle) - defense) > 0) ? 
            (Attr.getRandomValue(attacker, "毒素伤害", handle) - defense) * real_reduction / 100  * stage_reduction : 0;

            var counter = data.counter.getCounter("毒素触发", "DEATH");
            var counterValue = counter.updateValue(1, 0);
            var is_yuansu_crit = false;
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
                // 全是整数
                if (res == 1) {
                    // 储存毒素伤害
                    if (is_chucun) {
                        AttributeAPI.addSourceAttribute(data_attacker, "毒素转储", Arrays.asList("毒素伤害转储: +" + (crit_damage_value * (poison_tick_damage + 2)).toFixed(0)));
                    }
                    var flag = 0;
                    for (var i = 0; i < poison_tick_damage_ceil + 2; ++i) {
                        AttributeAPI.runEntityTask(250 * i, "毒素暴击任务" + (i + 10000 * counterValue), attacker, false, function() {
                        if (flag == 1) {
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
                        // 计算反弹的几率
                        var rebound_chance = Attr.chance(Attr.getRandomValue(entity, "反弹几率", handle) - Attr.getRandomValue(attacker, "反弹躲避", handle));
                        // 计算反弹的倍率
                        var rebound_multi = Math.max( (Attr.getRandomValue(entity, "反弹倍率", handle) - Attr.getRandomValue(attacker, "反弹抵抗", handle)) / 100 , 0);
                        // 如果被击杀
                        if (entity.getHealth() <= crit_damage_value.toFixed(0)) {
                            AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                            if (is_yuansu_crit) {
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                            } else {
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                            }
                            flag = 1;
                            if (rebound_chance) {
                                var rebound_damage = ((crit_damage_value * rebound_multi) * my_real_reduction / 100);
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            }
                            return;
                        }
                        AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                        if (is_yuansu_crit) {
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                        } else {
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                        }
                        // 反弹
                        if (rebound_chance) {
                            var rebound_damage = ((crit_damage_value * rebound_multi) * my_real_reduction / 100);
                            if (attacker.getHealth() <= rebound_damage.toFixed(0)) {
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                flag = 1;
                                return;
                            }
                            AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                        }
                    })
                    }
                } else {
                    // 储存毒素伤害
                    if (is_chucun) {
                        AttributeAPI.addSourceAttribute(data_attacker, "毒素转储", Arrays.asList("毒素伤害转储: +" + (crit_damage_value * (poison_tick_damage + 2)).toFixed(0)));
                    }
                    var flag2 = 0;
                    // 需要进行一次残差打击
                    for (var i = 0; i < poison_tick_damage_ceil + 2; ++i) {
                        if (i < poison_tick_damage_ceil + 1) {
                            AttributeAPI.runEntityTask(250 * i, "毒素暴击任务" + (i + 10000 * counterValue), attacker, false, function() {
                            if (flag2 == 1) {
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
                            // 计算反弹的几率
                            var rebound_chance = Attr.chance(Attr.getRandomValue(entity, "反弹几率", handle) - Attr.getRandomValue(attacker, "反弹躲避", handle));
                            // 计算反弹的倍率
                            var rebound_multi = Math.max( (Attr.getRandomValue(entity, "反弹倍率", handle) - Attr.getRandomValue(attacker, "反弹抵抗", handle)) / 100 , 0);
                            // 如果被击杀
                            if (entity.getHealth() <= crit_damage_value.toFixed(0)) {
                                AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                                if (is_yuansu_crit) {
                                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                } else {
                                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                    entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                }
                                flag2 = 1;
                                if (rebound_chance) {
                                    var rebound_damage = ((crit_damage_value * rebound_multi) * my_real_reduction / 100);
                                    AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                    entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                }
                                return;
                            }
                            AttributeAPI.attackTo(entity, attacker, crit_damage_value.toFixed(0));
                            if (is_yuansu_crit) {
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                            } else {
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + crit_damage_value.toFixed(0));
                            }
                            // 反弹
                            if (rebound_chance) {
                                var rebound_damage = ((crit_damage_value * rebound_multi) * my_real_reduction / 100);
                                if (attacker.getHealth() <= rebound_damage.toFixed(0)) {
                                    AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                    entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                    flag2 = 1;
                                    return;
                                }
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            }
                            })
                        } else {
                            AttributeAPI.runEntityTask(250 * poison_tick_damage_ceil + 2, "毒素暴击任务" + (poison_tick_damage_ceil + 2 + 10000 * counterValue), attacker, false, function() {
                            if (flag2 == 1) {
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
                            // 计算反弹的几率
                            var rebound_chance = Attr.chance(Attr.getRandomValue(entity, "反弹几率", handle) - Attr.getRandomValue(attacker, "反弹躲避", handle));
                            // 计算反弹的倍率
                            var rebound_multi = Math.max( (Attr.getRandomValue(entity, "反弹倍率", handle) - Attr.getRandomValue(attacker, "反弹抵抗", handle)) / 100 , 0);
                            if (rebound_chance) {
                                var rebound_damage = ((crit_damage_value * rebound_multi * res) * my_real_reduction / 100);
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            }
                            AttributeAPI.attackTo(entity, attacker, (crit_damage_value * res).toFixed(0));
                            if (is_yuansu_crit) {
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + (crit_damage_value * res).toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§d§l元素暴击§r§a§l,伤害为§5§l" + (crit_damage_value * res).toFixed(0));
                            } else {
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + (crit_damage_value * res).toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§c§l暴击§r§a§l,伤害为§5§l" + (crit_damage_value * res).toFixed(0));
                            }
                            })
                        }
                    }
                }
            } else {
                // 储存毒素伤害
                if (is_chucun) {
                    AttributeAPI.addSourceAttribute(data_attacker, "毒素转储", Arrays.asList("毒素伤害转储: +" + (damage * (poison_tick_damage + 2)).toFixed(0)));
                }
                // 没暴击
                // 全是整数
                if (res == 1) {
                    var flag3 = 0;
                    for (var i = 0; i < poison_tick_damage_ceil + 2; ++i) {
                        AttributeAPI.runEntityTask(250 * i, "毒素任务" + (i + 10000 * counterValue), attacker, false, function() {
                        if (flag3 == 1) {
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
                        // 计算反弹的几率
                        var rebound_chance = Attr.chance(Attr.getRandomValue(entity, "反弹几率", handle) - Attr.getRandomValue(attacker, "反弹躲避", handle));
                        // 计算反弹的倍率
                        var rebound_multi = Math.max( (Attr.getRandomValue(entity, "反弹倍率", handle) - Attr.getRandomValue(attacker, "反弹抵抗", handle)) / 100 , 0);
                        // 如果被击杀
                        if (entity.getHealth() <= damage.toFixed(0)) {
                            AttributeAPI.attackTo(entity, attacker, damage.toFixed(0));
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                            flag3 = 1;
                            if (rebound_chance) {
                                var rebound_damage = ((damage * rebound_multi) * my_real_reduction / 100);
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            }
                            return;
                        }                           
                        AttributeAPI.attackTo(entity, attacker, damage.toFixed(0));
                        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                        // 反弹
                        if (rebound_chance) {
                            var rebound_damage = ((damage * rebound_multi) * my_real_reduction / 100);
                            if (attacker.getHealth() <= rebound_damage.toFixed(0)) {
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                flag3 = 1;
                                return;
                            }
                            AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                        }
                        })
                    }
                } else {
                    // 储存毒素伤害
                    if (is_chucun) {
                        AttributeAPI.addSourceAttribute(data_attacker, "毒素转储", Arrays.asList("毒素伤害转储: +" + (damage * (poison_tick_damage + 2)).toFixed(0)));
                    }
                    var flag4 = 0;
                    // 需要进行一次残差打击
                    for (var i = 0; i < poison_tick_damage_ceil + 2; ++i) {
                        if (i < poison_tick_damage_ceil + 1) {
                            AttributeAPI.runEntityTask(250 * i, "毒素任务" + (i + 10000 * counterValue), attacker, false, function() {
                            if (flag4 == 1) {
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
                            // 计算反弹的几率
                            var rebound_chance = Attr.chance(Attr.getRandomValue(entity, "反弹几率", handle) - Attr.getRandomValue(attacker, "反弹躲避", handle));
                            // 计算反弹的倍率
                            var rebound_multi = Math.max( (Attr.getRandomValue(entity, "反弹倍率", handle) - Attr.getRandomValue(attacker, "反弹抵抗", handle)) / 100 , 0);
                            // 如果被击杀
                            if (entity.getHealth() <= damage.toFixed(0)) {
                                AttributeAPI.attackTo(entity, attacker, damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                                flag4 = 1;
                                if (rebound_chance) {
                                    var rebound_damage = ((damage * rebound_multi) * my_real_reduction / 100);
                                    AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                    entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                }
                                return;
                            } 
                            AttributeAPI.attackTo(entity, attacker, damage.toFixed(0));
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + damage.toFixed(0));
                            if (rebound_chance) {
                                var rebound_damage = ((damage * rebound_multi) * my_real_reduction / 100);
                                if (attacker.getHealth() <= rebound_damage.toFixed(0)) {
                                    AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                    attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                    entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                    flag4 = 1;
                                    return;
                                }
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            }
                            })
                        } else {
                            AttributeAPI.runEntityTask(250 * poison_tick_damage_ceil + 2, "毒素任务" + (poison_tick_damage_ceil + 2 + 10000 * counterValue), attacker, false, function() {
                            if (flag4 == 1) {
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
                            // 计算反弹的几率
                            var rebound_chance = Attr.chance(Attr.getRandomValue(entity, "反弹几率", handle) - Attr.getRandomValue(attacker, "反弹躲避", handle));
                            // 计算反弹的倍率
                            var rebound_multi = Math.max( (Attr.getRandomValue(entity, "反弹倍率", handle) - Attr.getRandomValue(attacker, "反弹抵抗", handle)) / 100 , 0);
                            if (rebound_chance) {
                                var rebound_damage = ((damage * rebound_multi * res) * my_real_reduction / 100);
                                AttributeAPI.attackTo(attacker, entity, rebound_damage.toFixed(0));
                                attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                                entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + rebound_damage.toFixed(0));
                            }
                            AttributeAPI.attackTo(entity, attacker, (damage * res).toFixed(0));
                            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§5§l毒素§r§a§l,伤害为§5§l" + (damage * res).toFixed(0));
                            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§5§l毒素§r§a§l,伤害为§5§l" + (damage * res).toFixed(0));
                            })
                        }
                    }
                }
            }
        }
	}
    return chance
}
