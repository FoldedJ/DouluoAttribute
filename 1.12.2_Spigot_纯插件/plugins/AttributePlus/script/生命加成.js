var priority = 78
var combatPower = 1.0
var attributeName = "生命加成"
var attributeType = "UPDATE"
var placeholder = "health_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的生命加成
	var attackAdditionValue = Attr.getRandomValue(entity, "生命加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "生命加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "生命加成属性源", Arrays.asList("生命上限: " + attackAdditionValue +"(%)"));
	}	
	return false;
}