var priority = 205
var combatPower = 1.0
var attributeName = "技能伤害"
var attributeType = "ATTACK"
var placeholder = "skilldamage"

function onLoad(attr){
    return attr
}

function runAttack(Attr, attacker, entity, handle){
    // 有效伤害减免
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "伤害减免", handle) / 100);
    var damage = Attr.getRandomValue(attacker, "技能伤害", handle);
    if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        Attr.addDamage(attacker, damage.toFixed(0), handle);
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l技能伤害§r§a§l,伤害为§b§l" + (damage * real_reduction).toFixed(0))
    }
    return false
}