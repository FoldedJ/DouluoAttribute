var priority = 73
var combatPower = 1.0
var attributeName = "暴击几率"
var attributeType = "ATTACK"
var placeholder = "critchance"

function onLoad(attr){
    Utils.registerOtherAttribute("暴击倍率", 1.0, "critdamage_attack")
    Utils.registerOtherAttribute("暴击躲避", 1.0, "critchance_defense")
    Utils.registerOtherAttribute("暴击抵抗", 1.0, "critdamage_defense")
    Utils.registerOtherAttribute("元素暴率", 1.0, "yuansu_baoji")
    Utils.registerOtherAttribute("元素暴伤", 1.0, "yuansu_baoshang")
    Utils.registerOtherAttribute("元素躲暴", 1.0, "yuansu_duobao")
    Utils.registerOtherAttribute("元素暴抗", 1.0, "yuansu_baokang")
    attr.setSkipFilter(true)
    return attr
}

function runAttack(Attr, attacker, entity, handle){
    // 有效伤害减免
    var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 0.2 : (1 - Attr.getRandomValue(entity, "伤害减免", handle) / 100);
    // 有效阶段防御
    var stage_reduction = 1.0;
    if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        var stage_reduction = (Attr.getRandomValue(entity, "阶段防御", handle) > Attr.getRandomValue(attacker, "阶段攻击", handle)) ? 0.01 : 1.0;
    }
    var pojiavalue = ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) > 0 ?
                     ((Attr.getRandomValue(attacker, "破甲效果", handle) - Attr.getRandomValue(entity, "破甲抵抗", handle)) / 100) : 0;
	pojiavalue = pojiavalue > 0.6 ? 0.6 : pojiavalue;
    // 获取物理防御
    var defense = (Attr.getRandomValue(entity, "物理防御", handle) * ( (Attr.getRandomValue(attacker, "破甲判断", handle) == 1) ? (1 - pojiavalue) : 1 ));

    var damage = ((Attr.getRandomValue(attacker, "物理伤害", handle) - defense) > 0) ? (Attr.getRandomValue(attacker, "物理伤害", handle) - defense) : 0;
    // 计算暴击率
    var critchance = Attr.chance(Attr.getRandomValue(attacker, "暴击几率", handle) - Attr.getRandomValue(entity, "暴击躲避", handle))
    // 计算暴击倍率
    var finaldamage = ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage > damage ?
    ( 100 + Attr.getRandomValue(attacker,"暴击倍率",handle) - Attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage : damage
    
    
    if (critchance) {
        Attr.setDamage(attacker, finaldamage.toFixed(0), handle)
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§c§l暴击§r§a§l,伤害为§c§l"+(finaldamage * real_reduction * stage_reduction).toFixed(0))  
        entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§c§l暴击§r§a§l,伤害为§c§l"+(finaldamage * real_reduction * stage_reduction).toFixed(0))  
    } else {
        Attr.setDamage(attacker, damage.toFixed(0), handle)
    }

    if (Utils.isType(entity, Arrays.asList(EntityType.PLAYER))) {
        Attr.addDamage(attacker, (Attr.getRandomValue(attacker,  "玩家伤害", handle)).toFixed(0), handle);
    } else {
        Attr.addDamage(attacker, (Attr.getRandomValue(attacker,  "怪物伤害", handle)).toFixed(0), handle);
    }


    return critchance
}