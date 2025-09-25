var priority = 61
var combatPower = 1.0
var attributeName = "处决防御加成"
var attributeType = "UPDATE"
var placeholder = "executionDefense_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的处决防御加成
	var attackAdditionValue = Attr.getRandomValue(entity, "处决防御加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "处决防御加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "处决防御加成属性源", Arrays.asList("处决防御: " + attackAdditionValue +"(%)"));
	}	
	return false;
}