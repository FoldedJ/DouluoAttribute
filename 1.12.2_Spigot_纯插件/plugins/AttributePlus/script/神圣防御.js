var priority = 109
var combatPower = 5.0
var attributeName = "神圣防御"
var attributeType = "DEFENSE"
var placeholder = "holyDefense"

function onLoad(Attr) {
	return Attr
}

function runDefense(Attr, entity, attacker, handle){
    // 获取双方的神圣属性
    var holy_damage = Attr.getRandomValue(attacker, "神圣伤害", handle);
    var holy_defense = Attr.getRandomValue(entity, "神圣防御", handle);
    if (holy_defense >= holy_damage) {
        entity.sendMessage("§7[§c战斗提示§7] §a你的神防高于对方神伤，抵挡了本次攻击，减少量为 §c§l" + holy_damage.toFixed(0));
    } else {
        entity.sendMessage("§7[§c战斗提示§7] §a你抵挡了本次神伤的部分，减少量为 §c§l" + holy_defense.toFixed(0));
    }
}