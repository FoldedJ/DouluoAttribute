/*
以下属性暂不考虑加入全属性：
1. 斗天觉醒、雷霆觉醒、毒素觉醒、神圣觉醒、处决觉醒：过于强大
2. 雷霆范围：无获取途径
3. 斩杀几率、斩杀百分比：过于强大
4. 撕裂、韧性：未使用
*/
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
    AttributeAPI.takeSourceAttribute(data, "破甲属性效果");

	if(attackAdditionValue > 0) {
		AttributeAPI.addSourceAttribute(data, "全属性属性源", Arrays.asList( // 攻击类属性
                                                                            "暴击几率: " + attackAdditionValue +"(%)",
                                                                            "暴击倍率: " + attackAdditionValue +"(%)",
                                                                            "吸血几率: " + attackAdditionValue +"(%)",
                                                                            "吸血倍率: " + attackAdditionValue +"(%)",
                                                                            "命中几率: " + attackAdditionValue +"(%)",
                                                                            "伤害加成: " + attackAdditionValue,
                                                                            // 防御类属性
                                                                            "生命恢复: " + attackAdditionValue +"(%)",
                                                                            "生命加成: " + attackAdditionValue,
                                                                            "防御加成: " + attackAdditionValue,
                                                                            "暴击躲避: " + attackAdditionValue +"(%)",
                                                                            "暴击抵抗: " + attackAdditionValue +"(%)",
                                                                            "吸血躲避: " + attackAdditionValue +"(%)",
                                                                            "吸血抵抗: " + attackAdditionValue +"(%)",
                                                                            "闪避几率: " + attackAdditionValue +"(%)",
                                                                            "伤害减免: " + attackAdditionValue +"(%)",
                                                                            // 元素属性
                                                                            "斗天真伤加成: " + attackAdditionValue,
                                                                            "斗天真防加成: " + attackAdditionValue,
                                                                            "雷霆几率: " + attackAdditionValue +"(%)",
                                                                            "雷霆躲避: " + attackAdditionValue +"(%)",
                                                                            "雷霆伤害加成: " + attackAdditionValue,
                                                                            "雷霆防御加成: " + attackAdditionValue,
                                                                            "毒素几率: " + attackAdditionValue +"(%)",
                                                                            "毒素躲避: " + attackAdditionValue +"(%)",
                                                                            "毒素伤害加成: " + attackAdditionValue,
                                                                            "毒素防御加成: " + attackAdditionValue,
                                                                            "神圣几率: " + attackAdditionValue +"(%)",
                                                                            "神圣躲避: " + attackAdditionValue +"(%)",
                                                                            "神圣伤害加成: " + attackAdditionValue,
                                                                            "神圣防御加成: " + attackAdditionValue,
                                                                            "处决几率: " + attackAdditionValue +"(%)",
                                                                            "处决躲避: " + attackAdditionValue +"(%)",
                                                                            "处决伤害加成: " + attackAdditionValue,
                                                                            "处决防御加成: " + attackAdditionValue,                                                                           
                                                                            // 其他属性
                                                                            "破甲几率: " + attackAdditionValue +"(%)",
                                                                            "破甲效果: " + attackAdditionValue +"(%)",
                                                                            "破甲抵抗: " + attackAdditionValue +"(%)",
                                                                            "魂环掉率: " + attackAdditionValue +"(%)",
                                                                            "魂骨掉率: " + attackAdditionValue +"(%)",
                                                                            "魂灵掉率: " + attackAdditionValue +"(%)",                                                                        
                                                                            "魂灵经验加成: " + attackAdditionValue +"(%)",
                                                                            "移动速度: " + attackAdditionValue +"(%)",
                                                                            "经验加成: " + attackAdditionValue +"(%)",                                                                           
                                                                            "反弹几率: " + attackAdditionValue +"(%)",
                                                                            "反弹躲避: " + attackAdditionValue +"(%)",                                                                           
                                                                            "反弹倍率: " + attackAdditionValue +"(%)",
                                                                            "反弹抵抗: " + attackAdditionValue +"(%)"));
	}	
	return false;
}