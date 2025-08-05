/* 每个脚本必须先写几个变量，否则属性无法注册 */

/*这里可以先随便设,最后需要去 attribute.yml 按实际情况调整优先级*/
var priority = 13
/*默认的战斗力*/
var combatPower = 5.0
/*默认属性名*/
var attributeName = "溟灭几率"
/*属性类型*/
var attributeType = "ATTACK"
/*属性变量 (%ap_testAttribute%)*/
var placeholder = "yanmie"

/* 每个属性再注册时都会调用该方法，也可以忽略不写 */
function onLoad(attr) {
    /* 溟灭属性需要通过 溟灭伤害 来提供伤害值,所以我们得注册一个 OTHER 的 溟灭伤害 属性 */
    /* 这里注册的属性 attribute.yml 也会生成相对应的配置内容*/
    Utils.registerOtherAttribute("溟灭伤害", 1.0, "yanmieDamage")
    /* 必须返回 attr */
    return attr
}

/* 因为属性是 ATTACK 类型,所以我们需要写 runAttack 方法 */
/* attacker 为攻击者，entity 为被攻击者*/
function runAttack(Attr, attacker, entity, handle) {

	var hChance = Attr.getRandomValue(attacker, "溟灭几率", handle);
	var chance = Attr.chance(hChance);

	if(chance)
	{
        if (chance > 100) chance = 100;
		var damage = Attr.getRandomValue(attacker, "溟灭伤害", handle);

		Attr.addDamage(attacker, damage.toFixed(0), handle);
		// 以下为消息输出, 若不需要可自行删除
		attacker.sendMessage("§7[§c战斗提示§7] §a你触发了一次§6§l溟灭§a,伤害为 §c§l" + damage.toFixed(0));
		entity.sendMessage("§7[§c战斗提示§7] §7你受到了一次§6§l溟灭§7,伤害为 §c§l" + damage.toFixed(0));
	}

    /* true 则会显示提示语 */
    /* false 则不会显示提示语*/
    return chance
}