var priority = 59
var combatPower = 1.0
var attributeName = "毒素防御加成"
var attributeType = "UPDATE"
var placeholder = "poisonDefense_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的毒素防御加成
	var attackAdditionValue = Attr.getRandomValue(entity, "毒素防御加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "毒素防御加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "毒素防御加成属性源", Arrays.asList("毒素防御: " + attackAdditionValue +"(%)"));
	}	
	return false;
}