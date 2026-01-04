var priority = 800   // 优先级
var combatPower = 10 // 战力
var attributeName = "反弹几率"
var attributeType = "DEFENSE"
var placeholder = "rebound_chance"

function onLoad(attr) {
    Utils.registerOtherAttribute("反弹躲避", 5.0, "dodgeRebound");
    Utils.registerOtherAttribute("反弹倍率", 5.0, "reboundMultiplier");
    Utils.registerOtherAttribute("反弹抵抗", 5.0, "resistRebound");
    return attr
}
function runDefense(Attr, entity, attacker, handle){
    // 获取对方的伤害
	var attackerDamage = Attr.getDamage(attacker, handle);
    // 有效伤害减免
    var real_reduction = (Attr.getRandomValue(attacker, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(attacker, "伤害减免", handle) / 100);
    // 计算反弹几率
    var chance = Attr.chance(Attr.getRandomValue(entity, "反弹几率", handle) - Attr.getRandomValue(attacker, "反弹躲避", handle));
    if (chance) {
        var multi = Math.max( (Attr.getRandomValue(entity, "反弹倍率", handle) - Attr.getRandomValue(attacker, "反弹抵抗", handle)) / 100 , 0);
        var damage = ((attackerDamage * multi) * real_reduction);
        AttributeAPI.attackTo(attacker, entity, damage.toFixed(0));
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l反弹§r§a§l,伤害为§b§l" + damage.toFixed(0));
        entity.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§b§l反弹§r§a§l,伤害为§b§l" + damage.toFixed(0));
    }
    return chance
}