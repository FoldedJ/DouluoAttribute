var priority = 1500
var combatPower = 5.0
var attributeName = "破甲几率"
var attributeType = "ATTACK"
var placeholder = "pojiaRate"

function onLoad(attr) {
    Utils.registerOtherAttribute("破甲效果", 10.0, "pojiaEffect");
    Utils.registerOtherAttribute("破甲判断", 1.0, "ispojia");
    Utils.registerOtherAttribute("破甲抵抗", 1.0, "pojiaResist");
    return attr
}

function runAttack(Attr, attacker, entity, handle) {
    // 计算破甲的几率
	var chance = Attr.chance(Attr.getRandomValue(attacker, "破甲几率", handle));
    var data = Attr.getData(attacker, handle)
    AttributeAPI.takeSourceAttribute(data, "破甲属性效果");
	if(chance) {
        // 获取当前对方是否处于破甲状态
        // 添加削弱效果
        AttributeAPI.addSourceAttribute(data, "破甲属性效果", Arrays.asList("破甲判断: +1"));
            attacker.sendMessage("§7[§c战斗提示§7] §a§l你触发了一次§3§l破甲§r§a§l," + "§a§l并削弱了对方的防御");
            entity.sendMessage("§7[§c战斗提示§7] §a§l你受到了一次§3§l破甲§r§a§l," + "§a§l并被削弱了防御");
        }
        AttributeAPI.runEntityTask(2000, "破甲恢复任务", attacker, false, function(){
            // 恢复防御
            AttributeAPI.takeSourceAttribute(data, "破甲属性效果");
		})
    return chance
}