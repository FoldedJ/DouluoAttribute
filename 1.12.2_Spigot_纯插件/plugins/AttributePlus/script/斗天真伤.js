var priority = 105
var combatPower = 5.0
var attributeName = "斗天真伤"
var attributeType = "ATTACK"
var placeholder = "trueDamage"

/* 每个属性再注册时都会调用该方法，也可以忽略不写 */
function onLoad(attr) {
    Utils.registerOtherAttribute("斗天真防", 5.0, "trueDefense");
    Utils.registerOtherAttribute("斗天觉醒", 5.0, "trueAwake");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 有效伤害减免
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "伤害减免", handle) / 100);
    // 计算基础斗天真伤
    var damage = ((Attr.getRandomValue(attacker, "斗天真伤", handle) - Attr.getRandomValue(entity, "斗天真防", handle)) > 0) ? (Attr.getRandomValue(attacker, "斗天真伤", handle) - Attr.getRandomValue(entity, "斗天真防", handle)) : 0;
    // 计算暴击率
	var crit_chance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle));
    // 获取斗天觉醒
    var true_awake = Attr.getRandomValue(attacker, "斗天觉醒", handle) / 100;
    var crit_damage_value = ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle)) / 100 * damage * true_awake > damage ?
	( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle)) / 100 * damage * true_awake : damage;
    if (crit_chance && true_awake > 0) {
        Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§f§l斗天真伤§c§l暴击§r§a§l,伤害为§f§l" + (crit_damage_value * real_reduction).toFixed(0));
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§f§l斗天真伤§c§l暴击§r§a§l,伤害为§f§l" + (crit_damage_value * real_reduction).toFixed(0));
    } else {
        Attr.addDamage(attacker, damage.toFixed(0), handle);
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§f§l斗天真伤§r§a§l,伤害为§f§l" + (damage * real_reduction).toFixed(0));
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§f§l斗天真伤§r§a§l,伤害为§f§l" + (damage * real_reduction).toFixed(0));
    }
    return (damage > 0);
}