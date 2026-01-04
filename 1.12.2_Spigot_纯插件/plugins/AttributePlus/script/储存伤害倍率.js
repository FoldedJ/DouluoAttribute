var priority = 1501
var combatPower = 1.0
var attributeName = "储存伤害倍率"
var attributeType = "ATTACK"
var placeholder = "storeDamagePercent"

function onLoad(Attr) {
	return Attr;
}

function runAttack(Attr, attacker, entity, handle){
    // 获取储存伤害倍率
    var storeDamagePercent = Attr.getRandomValue(attacker, "储存伤害倍率", handle) / 100;
    var data = Attr.getData(attacker, handle);
    
    var is_chucun = false;
    if (Attr.getRandomValue(attacker, "储存判断", handle)) {
        is_chucun = true;
    }
    // 储存次数
    var counter = data.counter.getCounter("储存次数", "DEATH");
    // 伤害存储器
    var damageCounter = data.counter.getCounter("伤害存储", "DEATH");
    // 毒素伤害存储器
    var poisonDamageCounter = data.counter.getCounter("毒素伤害存储", "DEATH");
    // 处决伤害存储器
    var executionDamageCounter = data.counter.getCounter("处决伤害存储", "DEATH");
    if (is_chucun) {

        // 获取自己的伤害(不包含毒素)
        var damage = Attr.getDamage(attacker, handle);
        // 计数器加1
        var counterValue = counter.updateValue(1, 0);

        // 更新伤害存储
        var damageCounterValue = damageCounter.updateValue(damage.toFixed(0), 0);
        
        var poison_damage = Attr.getRandomValue(attacker, "毒素伤害转储", handle);

        // 更新毒素伤害存储
        var poisonDamageCounterValue = poisonDamageCounter.updateValue(poison_damage.toFixed(0), 0);

        var execution_damage = Attr.getRandomValue(attacker, "处决伤害转储", handle);

        // 更新处决伤害存储
        var executionDamageCounterValue = executionDamageCounter.updateValue(execution_damage.toFixed(0), 0);
    }
    if (counterValue >= 5) {
    	// 有效伤害减免系数
        var real_reduction = (Attr.getRandomValue(entity, "伤害减免", handle) >= 80) ? 20 : 100 - Attr.getRandomValue(entity, "伤害减免", handle);
        // 有效阶段防御
        var stage_reduction = (Attr.getRandomValue(entity, "阶段防御", handle) > Attr.getRandomValue(attacker, "阶段攻击", handle)) ? 0.01 : 1.0;
        Attr.addDamage(attacker, ((damageCounterValue + poisonDamageCounterValue + executionDamageCounterValue) * storeDamagePercent * real_reduction / 100 * stage_reduction).toFixed(0), handle);
    	attacker.sendMessage("§7[§c战斗提示§7] §a你触发了一次§6§l储存伤害§a,伤害为§6§l" + ((damageCounterValue + poisonDamageCounterValue + executionDamageCounterValue) * storeDamagePercent * real_reduction / 100 * stage_reduction).toFixed(0));
    	entity.sendMessage("§7[§c战斗提示§7] §a你受到了一次§6§l储存伤害§a,伤害为§6§l" + ((damageCounterValue + poisonDamageCounterValue + executionDamageCounterValue) * storeDamagePercent * real_reduction / 100 * stage_reduction).toFixed(0));
        // 次数和伤害重置
    	counter.resetValue();
    	damageCounter.resetValue();
    	poisonDamageCounter.resetValue();
        executionDamageCounter.resetValue();
        AttributeAPI.takeSourceAttribute(data, "储存判断");
        AttributeAPI.takeSourceAttribute(data, "毒素转储");
        AttributeAPI.takeSourceAttribute(data, "处决转储");
    }
    if (counterValue != 0) {
    	AttributeAPI.runEntityTask(5000, "储存伤害任务移除", attacker, false, function(){
            // 次数和伤害重置
            counter.resetValue();
    		damageCounter.resetValue();
    		poisonDamageCounter.resetValue();
            executionDamageCounter.resetValue();
            AttributeAPI.takeSourceAttribute(data, "储存判断");
            AttributeAPI.takeSourceAttribute(data, "毒素转储");
            AttributeAPI.takeSourceAttribute(data, "处决转储");
    	})
    }
	return false;
}