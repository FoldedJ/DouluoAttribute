var priority = 108
var combatPower = 5.0
var attributeName = "毒素防御"
var attributeType = "DEFENSE"
var placeholder = "poisonDefense"

function onLoad(Attr) {
	return Attr
}

function runDefense(Attr, entity, attacker, handle){
    // 获取双方的毒素属性
    var poison_damage = Attr.getRandomValue(attacker, "毒素伤害", handle);
    var poison_defense = Attr.getRandomValue(entity, "毒素防御", handle);
    if (poison_defense >= poison_damage) {
        entity.sendMessage("§7[§c战斗提示§7] §a你的毒防高于对方毒伤，抵挡了本次攻击，减少量为 §c§l" + poison_damage.toFixed(0));
    } else {
        entity.sendMessage("§7[§c战斗提示§7] §a你抵挡了本次毒伤的部分，减少量为 §c§l" + poison_defense.toFixed(0));
    }
}