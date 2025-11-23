var priority = 180
var combatPower = 1.0 
var attributeName = "神圣击杀触发" 
var attributeType = "KILLER" 
var placeholder = "killerTrigger" 


function onLoad(Attr){ 
  return Attr 
} 


function runKiller(Attr, killer, entity, handle) { 
  var data = Attr.getData(killer, handle) 
  var date2 = Attr.getData(entity, handle) 

  // 检查 data 是否为 null
  if (data != null) {
    AttributeAPI.takeSourceAttribute(data, "神圣击杀"); 
  }
  if (date2 != null) {
    AttributeAPI.takeSourceAttribute(date2, "神圣觉醒"); 
  }
  return true
}