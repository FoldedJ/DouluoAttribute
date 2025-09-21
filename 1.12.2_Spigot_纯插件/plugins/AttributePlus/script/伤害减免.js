var priority = 1004   // 优先级
var combatPower = 100 // 战力
var attributeName = "伤害减免"
var attributeType = "DEFENSE"
var placeholder = "damage_reduction"

function onLoad(attr) {
    return attr
}
function runDefense(Attr, entity, attacker, handle){
    // 获取对方的伤害
	var attackerDamage = Attr.getDamage(attacker, handle);
    // 有效伤害减免
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 80 : Attr.getRandomValue(entity, "伤害减免", handle);
	var damage = attackerDamage * real_reduction / 100;
	Attr.takeDamage(attacker, damage.toFixed(0), handle);	
    return false
}