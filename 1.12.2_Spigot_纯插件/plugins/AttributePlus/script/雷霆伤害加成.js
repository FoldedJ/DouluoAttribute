var priority = 30
var combatPower = 1.0
var attributeName = "雷霆伤害加成"
var attributeType = "UPDATE"
var placeholder = "lighting_attack_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的雷霆伤害加成
	var attackAdditionValue = Attr.getRandomValue(entity, "雷霆伤害加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "雷霆伤害加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "雷霆伤害加成属性源", Arrays.asList("雷霆伤害: " + attackAdditionValue +"(%)"));
	}	
	return false;
}