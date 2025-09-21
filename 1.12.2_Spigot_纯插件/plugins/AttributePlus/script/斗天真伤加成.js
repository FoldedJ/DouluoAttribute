var priority = 31
var combatPower = 1.0
var attributeName = "斗天真伤加成"
var attributeType = "UPDATE"
var placeholder = "true_attack_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的真伤加成
	var attackAdditionValue = Attr.getRandomValue(entity, "斗天真伤加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "斗天真伤加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "斗天真伤加成属性源", Arrays.asList("斗天真伤: " + attackAdditionValue +"(%)"));
	}	
	return false;
}