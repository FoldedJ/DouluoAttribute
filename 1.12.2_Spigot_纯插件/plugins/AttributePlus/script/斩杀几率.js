var priority = 100
var combatPower = 50.0
var attributeName = "斩杀几率"
var attributeType = "ATTACK"
var placeholder = "killRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("斩杀百分比", 100.0, "killPercent");
    Utils.registerOtherAttribute("斩杀伤害", 100.0, "killDamage");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算斩杀触发的条件
    if (!Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        // 获取对方的生命值
        var health = entity.getHealth();
        // 获取对方的最大生命值
        var max_health = entity.getMaxHealth();
        // 获取自己的斩杀百分比
        var kill_percent = Attr.getRandomValue(attacker, "斩杀百分比", handle);
        if (health <= (max_health * kill_percent) / 100) {
            // 计算斩杀的几率
            var chance = Attr.chance(Attr.getRandomValue(attacker, "斩杀几率", handle));
            if (chance) {
                // 计算斩杀伤害
                var kill_damage = health;
                AttributeAPI.attackTo(entity, attacker, kill_damage.toFixed(0));
                attacker.sendMessage("§7[§c系统§7] §b你触发了一次§c§l斩杀");
            }
        }
    }
    return chance
}
