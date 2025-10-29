var priority = 73
var combatPower = 1.0
var attributeName = "暴击几率"
var attributeType = "ATTACK"
var placeholder = "critchance"

function onLoad(attr){
    Utils.registerOtherAttribute("暴击倍率", 1.0, "critdamage_attack")
    Utils.registerOtherAttribute("暴击躲避", 1.0, "critchance_defense")
    Utils.registerOtherAttribute("暴击抵抗", 1.0, "critdamage_defense")
    attr.setSkipFilter(true)
    return attr
}

function runAttack(attr, attacker, entity, handle){
    // 获取物理伤害
    var damage = ((attr.getRandomValue(attacker, "物理伤害", handle) - attr.getRandomValue(entity, "物理防御", handle)) > 0) ? (attr.getRandomValue(attacker, "物理伤害", handle) - attr.getRandomValue(entity, "物理防御", handle)) : 0;
    // 计算暴击率
    var critchance = attr.chance(attr.getRandomValue(attacker, "暴击几率", handle) - attr.getRandomValue(entity, "暴击躲避", handle))
    // 计算暴击倍率
    var finaldamage = ( 100 + attr.getRandomValue(attacker,"暴击倍率",handle) - attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage > damage ?
    ( 100 + attr.getRandomValue(attacker,"暴击倍率",handle) - attr.getRandomValue(entity,"暴击抵抗",handle) ) / 100 * damage : damage
    
    
    if (critchance) {
        attr.setDamage(attacker, finaldamage.toFixed(0), handle)
        attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§c§l暴击§r§a§l,伤害为§c§l"+finaldamage.toFixed(0))    
    }

    return critchance
}