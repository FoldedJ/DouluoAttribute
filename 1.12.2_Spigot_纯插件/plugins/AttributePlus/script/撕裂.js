var priority = 131
var combatPower = 5.0
var attributeName = "撕裂"
var attributeType = "ATTACK"
var placeholder = "tear"

function onLoad(attr) {
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算撕裂的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "撕裂", handle));
    // 韧性减免系数
    var resilience = (Attr.getRandomValue(entity, "韧性", handle) >= 100) ? 20 : 100 - Attr.getRandomValue(entity, "韧性", handle) * 0.8;
	if(chance) {
		// 触发
        // 百分比伤害
        var damage = entity.getHealth() * 0.05 * resilience / 100;
        // 计算最终伤害
        AttributeAPI.attackTo(entity, attacker, damage.toFixed(0)); 
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§6§l撕裂");
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§6§l撕裂");
	}
    return chance
}
