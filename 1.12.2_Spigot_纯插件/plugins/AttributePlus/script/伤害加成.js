var priority = 77
var combatPower = 1.0
var attributeName = "伤害加成"
var attributeType = "UPDATE"
var placeholder = "attack_addition"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的伤害加成
	var attackAdditionValue = Attr.getRandomValue(entity, "伤害加成", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "伤害加成属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "伤害加成属性源", Arrays.asList("雷霆伤害: " + attackAdditionValue +"(%)",
                                                                            "毒素伤害: " + attackAdditionValue +"(%)",      
                                                                            "处决伤害: " + attackAdditionValue +"(%)",
                                                                            "神圣伤害: " + attackAdditionValue +"(%)",
                                                                            "斗天真伤: " + attackAdditionValue +"(%)",
                                                                            "物理伤害: " + attackAdditionValue +"(%)",
                                                                            "怪物伤害: " + attackAdditionValue +"(%)",
                                                                            "玩家伤害: " + attackAdditionValue +"(%)"));
	}	
	return false;
}