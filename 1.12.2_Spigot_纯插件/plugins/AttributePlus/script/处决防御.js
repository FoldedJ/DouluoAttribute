var priority = 110
var combatPower = 5.0
var attributeName = "处决防御"
var attributeType = "DEFENSE"
var placeholder = "executionDefense"

function onLoad(Attr) {
	return Attr
}

function runDefense(Attr, entity, attacker, handle){
    // 获取双方的处决属性
    var execution_damage = Attr.getRandomValue(attacker, "处决伤害", handle);
    var execution_defense = Attr.getRandomValue(entity, "处决防御", handle);
    if (execution_defense >= execution_damage) {
        entity.sendMessage("§7[§c战斗提示§7] §a你的神防高于对方神伤，抵挡了本次攻击，减少量为 §c§l" + execution_damage.toFixed(0));
    } else {
        entity.sendMessage("§7[§c战斗提示§7] §a你抵挡了本次神伤的部分，减少量为 §c§l" + execution_defense.toFixed(0));
    }
    return true;    
}