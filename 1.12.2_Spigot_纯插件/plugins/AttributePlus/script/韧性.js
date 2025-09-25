var priority = 63
var combatPower = 1.0
var attributeName = "韧性"
var attributeType = "UPDATE"
var placeholder = "resilience"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的韧性
	var attackAdditionValue = Attr.getRandomValue(entity, "韧性", handle);
    // 计算增加的伤害减免的数值
    attackAdditionValue = attackAdditionValue >= 100 ? 10 : attackAdditionValue * 0.1;
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "韧性属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "韧性属性源", Arrays.asList("伤害减免: " + attackAdditionValue));
	}	
	return false;
}