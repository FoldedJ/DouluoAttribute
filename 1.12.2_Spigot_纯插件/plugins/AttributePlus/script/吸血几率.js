var priority = 150
var combatPower = 10.0
var attributeName = "吸血几率"
var attributeType = "ATTACK"
var placeholder = "vamRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("吸血倍率", 10.0, "vamDamage");
    Utils.registerOtherAttribute("吸血躲避", 10.0, "vamDodge");
    Utils.registerOtherAttribute("吸血抵抗", 10.0, "vamResist");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算吸血几率
    var chance = Attr.chance(Attr.getRandomValue(attacker, "吸血几率", handle) - Attr.getRandomValue(entity, "吸血躲避", handle));
	if(chance) {
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
        // 获取本次攻击的伤害
        var damage = Attr.getDamage(attacker, handle);
        // 计算吸血量
        var heal_amount = (current_health + damage * vam_damage_value > max_health) ? max_health : (current_health + damage * vam_damage_value);
        // 吸血
        attacker.setHealth(heal_amount);
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§4§l吸血§r§a§l,恢复了§2§l" + (damage * vam_damage_value).toFixed(0) + " §a§l点生命值");
	}
    return chance
}
