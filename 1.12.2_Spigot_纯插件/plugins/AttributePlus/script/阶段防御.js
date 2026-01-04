var priority = 1005  // 优先级
var combatPower = 100 // 战力
var attributeName = "阶段防御"
var attributeType = "DEFENSE"
var placeholder = "stageDefense"

function onLoad(attr) {
    Utils.registerOtherAttribute("阶段攻击", 100.0, "stageAttack");
    return attr
}
function runDefense(Attr, entity, attacker, handle){
    // 获取对方的伤害
	var attackerDamage = Attr.getDamage(attacker, handle);
    var stage_defense = Attr.getRandomValue(entity, "阶段防御", handle);
    var stage_attack = Attr.getRandomValue(attacker, "阶段攻击", handle);
    // 触发
    if (stage_defense > stage_attack) {
        var damage = attackerDamage * 0.99;
        Attr.takeDamage(attacker, damage.toFixed(0), handle);	
    }
    return false
}