var priority = 15
var combatPower = 1.0
var attributeName = "全属性"
var attributeType = "UPDATE"
var placeholder = "full_ap"

function onLoad(Attr) {
	Attr.setSkipFilter(true)
	return Attr;
}

function run(Attr, entity, handle) {
    // 获取自己的全属性
	var attackAdditionValue = Attr.getRandomValue(entity, "全属性", handle);
	var data = Attr.getData(entity, handle);

    AttributeAPI.takeSourceAttribute(data, "全属性属性源");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "全属性属性源", Arrays.asList("伤害加成: " + attackAdditionValue,
                                                                            "暴击几率: " + attackAdditionValue +"(%)",
                                                                            "暴击倍率: " + attackAdditionValue +"(%)",
                                                                            "吸血几率: " + attackAdditionValue +"(%)",
                                                                            "吸血倍率: " + attackAdditionValue +"(%)",
                                                                            "命中几率: " + attackAdditionValue +"(%)",
                                                                            "吸血倍率: " + attackAdditionValue +"(%)",
                                                                            "命中几率: " + attackAdditionValue +"(%)",
                                                                        
                                                                            "雷霆几率: " + attackAdditionValue +"(%)",
                                                                       
                                                                            "毒素几率: " + attackAdditionValue +"(%)",
                                                                        
                                                                            "处决几率: " + attackAdditionValue +"(%)",
                                                                        
                                                                            "神圣几率: " + attackAdditionValue +"(%)",
                                                                        
                                                                            "生命加成: " + attackAdditionValue,
                                                                            "防御加成: " + attackAdditionValue,
                                                                            "暴击躲避: " + attackAdditionValue +"(%)",
                                                                            "暴击抵抗: " + attackAdditionValue +"(%)",
                                                                            "吸血躲避: " + attackAdditionValue +"(%)",
                                                                            "吸血抵抗: " + attackAdditionValue +"(%)",
                                                                            "闪避几率: " + attackAdditionValue +"(%)",
                                                                            "斗天真防加成: " + attackAdditionValue,
                                                                            "雷霆防御加成: " + attackAdditionValue,
                                                                            "毒素防御加成: " + attackAdditionValue,
                                                                            "处决防御加成: " + attackAdditionValue,
                                                                            "神圣防御加成: " + attackAdditionValue,
                                                                            "生命恢复: " + attackAdditionValue +"(%)",
                                                                            "破甲几率: " + attackAdditionValue +"(%)",
                                                                            "破甲效果: " + attackAdditionValue +"(%)"));
	}	
	return false;
}