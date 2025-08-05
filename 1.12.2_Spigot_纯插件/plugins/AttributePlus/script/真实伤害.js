var priority = 105
var combatPower = 5.0
var attributeName = "真伤"
var attributeType = "ATTACK"
var placeholder = "trueDamage"

/* 每个属性再注册时都会调用该方法，也可以忽略不写 */
function onLoad(attr) {
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 获取自己的真伤
    var true_damage = Attr.getRandomValue(attacker, "真伤", handle);
    // 获取对方的真防
    var true_defense = Attr.getRandomValue(entity, "真防", handle);
    // 获取自己的暴击几率
    var crit_rate = Attr.getRandomValue(attacker, "暴击几率", handle);
    // 获取对方的暴击闪避
    var crit_dodge = Attr.getRandomValue(entity, "暴击闪避", handle);
    // 计算暴击几率
    var crit_rate_final = ((crit_rate - crit_dodge) > 0) ? (crit_rate - crit_dodge) : 0;
    // 计算暴击几率是否触发
    var crit_chance = Attr.chance(crit_rate_final);

    var damage = ((true_damage - true_defense) > 0) ? (true_damage - true_defense) : 0;
    // 计算最终伤害
    if (crit_chance) {
        // 获取自己的暴伤倍率
        var crit_damage = Attr.getRandomValue(attacker, "暴伤倍率", handle);
        // 获取对方的暴击抵抗
        var crit_resist = Attr.getRandomValue(entity, "暴击抵抗", handle);
        // 计算暴击伤害
        var crit_hit = ((crit_damage - crit_resist) / 100 > 0) ? (crit_damage - crit_resist) / 100 : 0;
        var crit_damage_value = damage * (1 + crit_hit);
        Attr.addDamage(attacker, crit_damage_value.toFixed(0), handle);
        attacker.sendMessage("§7[§c系统§7] §b你触发了一次§f§l真伤§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
        entity.sendMessage("§7[§c系统§7] §b你受到了一次§f§l真伤§c§l暴击§r§b,伤害为§e§l" + crit_damage_value.toFixed(0));
    } else {
        Attr.addDamage(attacker, damage.toFixed(0), handle);
        attacker.sendMessage("§7[§c系统§7] §b你触发了一次§f§l真伤§r§b,伤害为§e§l" + damage.toFixed(0));
        entity.sendMessage("§7[§c系统§7] §b你受到了一次§f§l真伤§r§b,伤害为§e§l" + damage.toFixed(0));
    }
    return (true_damage > 0);
}