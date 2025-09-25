var priority = 58
var combatPower = 1.0
var attributeName = "雷霆防御加成"
var attributeType = "UPDATE"
var placeholder = "lightningDefense_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的雷霆防御加成
	var attackAdditionValue = Attr.getRandomValue(entity, "雷霆防御加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "雷霆防御加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "雷霆防御加成属性源", Arrays.asList("雷霆防御: " + attackAdditionValue +"(%)"));
	}	
	return false;
}