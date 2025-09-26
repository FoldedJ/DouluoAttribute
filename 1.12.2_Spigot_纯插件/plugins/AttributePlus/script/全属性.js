var priority = 1500
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
		AttributeAPI.addSourceAttribute(data, "全属性属性源", Arrays.asList("物理伤害: " + attackAdditionValue +"(%)",
                                                                            "怪物伤害: " + attackAdditionValue +"(%)",  
                                                                            "玩家伤害: " + attackAdditionValue +"(%)",
                                                                            "暴击几率: " + attackAdditionValue +"(%)",
                                                                            "暴击伤害: " + attackAdditionValue +"(%)",
                                                                            "吸血几率: " + attackAdditionValue +"(%)",
                                                                            "吸血倍率: " + attackAdditionValue +"(%)",
                                                                            "命中几率: " + attackAdditionValue +"(%)",
                                                                            "吸血倍率: " + attackAdditionValue +"(%)",
                                                                            "命中几率: " + attackAdditionValue +"(%)",
                                                                            "斗天真伤: " + attackAdditionValue +"(%)",
                                                                            "雷霆几率: " + attackAdditionValue +"(%)",
                                                                            "雷霆伤害: " + attackAdditionValue +"(%)",
                                                                            "毒素几率: " + attackAdditionValue +"(%)",
                                                                            "毒素伤害: " + attackAdditionValue +"(%)",
                                                                            "处决几率: " + attackAdditionValue +"(%)",
                                                                            "处决伤害: " + attackAdditionValue +"(%)",
                                                                            "神圣几率: " + attackAdditionValue +"(%)",
                                                                            "神圣伤害: " + attackAdditionValue +"(%)",
                                                                            "生命上限: " + attackAdditionValue +"(%)",
                                                                            "防御力: " + attackAdditionValue +"(%)",
                                                                            "暴击躲避: " + attackAdditionValue +"(%)",
                                                                            "暴击抵抗: " + attackAdditionValue +"(%)",
                                                                            "吸血躲避: " + attackAdditionValue +"(%)",
                                                                            "吸血抵抗: " + attackAdditionValue +"(%)",
                                                                            "闪避几率: " + attackAdditionValue +"(%)",
                                                                            "斗天真防: " + attackAdditionValue +"(%)",
                                                                            "雷霆防御: " + attackAdditionValue +"(%)",
                                                                            "毒素防御: " + attackAdditionValue +"(%)",
                                                                            "处决防御: " + attackAdditionValue +"(%)",
                                                                            "神圣防御: " + attackAdditionValue +"(%)",
                                                                            "每秒回血: " + attackAdditionValue +"(%)",
                                                                            "斩杀几率: " + attackAdditionValue +"(%)",
                                                                            "破甲几率: " + attackAdditionValue +"(%)",
                                                                            "破甲效果: " + attackAdditionValue +"(%)",
                                                                            "撕裂: " + attackAdditionValue +"(%)",
                                                                            "韧性: " + attackAdditionValue +"(%)"));
	}	
	return false;
}