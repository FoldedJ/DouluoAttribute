var priority = 33
var combatPower = 1.0
var attributeName = "处决伤害加成"
var attributeType = "UPDATE"
var placeholder = "execution_attack_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的处决伤害加成
	var attackAdditionValue = Attr.getRandomValue(entity, "处决伤害加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "处决伤害加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "处决伤害加成属性源", Arrays.asList("处决伤害: " + attackAdditionValue +"(%)"));
	}	
	return false;
}