var priority = 106
var combatPower = 5.0
var attributeName = "雷电防御"
var attributeType = "DEFENSE"
var placeholder = "lightningDefense"

function onLoad(Attr) {
	return Attr
}

function runDefense(Attr, entity, attacker, handle){
    // 获取双方的雷电属性
    var lightning_damage = Attr.getRandomValue(attacker, "雷电伤害", handle);
    var lightning_defense = Attr.getRandomValue(entity, "雷电防御", handle);
    if (lightning_defense >= lightning_damage) {
        entity.sendMessage("§7[§c战斗提示§7] §a你的雷防高于对方雷伤，抵挡了本次攻击，减少量为 §c§l" + lightning_damage.toFixed(0));
    } else {
        entity.sendMessage("§7[§c战斗提示§7] §a你抵挡了本次雷伤的部分，减少量为 §c§l" + lightning_defense.toFixed(0));
    }
}