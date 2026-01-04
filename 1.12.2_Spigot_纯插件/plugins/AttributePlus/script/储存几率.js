/*
当前版本存在bug，有虚无的100点毒素伤害转储
有可能是task未正确释放
换号测试
*/
var priority = 74
var combatPower = 1.0
var attributeName = "储存几率"
var attributeType = "ATTACK"
var placeholder = "store_chance"

function onLoad(Attr) {
    Utils.registerOtherAttribute("储存判断", 1.0, "store_check");   
	return Attr;
}

function runAttack(Attr, attacker, entity, handle){
    var chance = Attr.chance(Attr.getRandomValue(attacker, "储存几率", handle));
    var data = Attr.getData(attacker, handle);
    AttributeAPI.takeSourceAttribute(data, "储存判断");
    if (chance) {
        AttributeAPI.addSourceAttribute(data, "储存判断", Arrays.asList("储存判断: +1"));
    }
	return false;
}