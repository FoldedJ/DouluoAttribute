var priority = 137
var combatPower = 50.0
var attributeName = "百分比伤害"
var attributeType = "ATTACK"
var placeholder = "percent_damage"

function onLoad(attr) {
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算斩杀触发的条件
    if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        // 获取对方的最大生命值
        var max_health = entity.getMaxHealth();
        // 获取自己的百分比伤害
        var percent_damage = Attr.getRandomValue(attacker, "百分比伤害", handle);
        var damage = max_health * (percent_damage / 100.0);
        if (percent_damage < 100) {
            AttributeAPI.attackTo(entity, attacker, damage);
            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§b§l百分比伤害§a§l，伤害为§b§l" + damage.toFixed(0));
        } else {
            AttributeAPI.attackTo(entity, attacker, damage);
            entity.sendMessage("§7[§c战斗提示§7] §a§l你已被§b§l秒杀");
        }
    }
    return true
}
