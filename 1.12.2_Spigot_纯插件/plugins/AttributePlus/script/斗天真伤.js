var priority = 105
var combatPower = 5.0
var attributeName = "斗天真伤"
var attributeType = "ATTACK"
var placeholder = "trueDamage"

/* 每个属性再注册时都会调用该方法，也可以忽略不写 */
function onLoad(attr) {
    Utils.registerOtherAttribute("斗天真防", 5.0, "trueDefense");
    Utils.registerOtherAttribute("斗天觉醒", 5.0, "trueAwake");
    Utils.registerOtherAttribute("真伤减免", 5.0, "trueReduction");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 有效伤害减免
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "伤害减免", handle) / 100);
    // 有效阶段防御
    var stage_reduction = 1.0;
    if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        var stage_reduction = (Attr.getRandomValue(entity, "阶段防御", handle) > Attr.getRandomValue(attacker, "阶段攻击", handle)) ? 0.01 : 1.0;
    }
    // 有效真伤
    var true_reduction = (Attr.getRandomValue(entity, "真伤减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "真伤减免", handle) / 100);
    // 计算破甲效果值
    var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                    ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue; 
    // 获取斗天真防
    var defense = (Attr.getRandomValue(entity, "斗天真防", handle) * ( (Attr.getRandomValue(attacker, "破甲判断", handle) == 1) ? (1 - pojiavalue) : 1 ));
    // 计算基础斗天真伤
    var damage = ((Attr.getRandomValue(attacker, "斗天真伤", handle) - defense) > 0) ? (Attr.getRandomValue(attacker, "斗天真伤", handle) - defense) : 0;
    // 计算暴击率
	var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
    // 获取斗天觉醒
    var true_awake = Attr.getRandomValue(attacker, "斗天觉醒", handle) / 100;
    var crit_damage_value = ( 1 + true_awake ) * damage
    if (crit_chance && true_awake > 0) {
        Attr.addDamage(attacker, (crit_damage_value * true_reduction).toFixed(0), handle);
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§f§l斗天真伤§c§l暴击§r§a§l,伤害为§f§l" + (crit_damage_value * real_reduction * true_reduction * stage_reduction).toFixed(0));
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§f§l斗天真伤§c§l暴击§r§a§l,伤害为§f§l" + (crit_damage_value * real_reduction * true_reduction * stage_reduction).toFixed(0));
    } else {
        Attr.addDamage(attacker, (damage * true_reduction).toFixed(0), handle);
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§f§l斗天真伤§r§a§l,伤害为§f§l" + (damage * real_reduction * true_reduction * stage_reduction).toFixed(0));
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§f§l斗天真伤§r§a§l,伤害为§f§l" + (damage * real_reduction * true_reduction * stage_reduction).toFixed(0));
    }
    return (damage > 0);
}