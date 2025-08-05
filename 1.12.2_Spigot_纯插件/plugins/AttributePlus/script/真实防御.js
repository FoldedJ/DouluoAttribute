var priority = 107
var combatPower = 5.0
var attributeName = "真防"
var attributeType = "DEFENSE"
var placeholder = "trueDefense"

function onLoad(Attr) {
	return Attr
}

function runDefense(Attr, entity, attacker, handle){
    // 获取双方的真伤真防
    var true_damage = Attr.getRandomValue(attacker, "真伤", handle);
    var true_defense = Attr.getRandomValue(entity, "真防", handle);
    if (true_defense >= true_damage) {
        entity.sendMessage("§7[§c战斗提示§7] §a你的真防高于对方真伤，抵挡了本次攻击，减少量为 §c§l" + true_damage.toFixed(0));
    } else {
        entity.sendMessage("§7[§c战斗提示§7] §a你抵挡了本次真伤的部分，减少量为 §c§l" + true_defense.toFixed(0));
    }
}