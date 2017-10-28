
export function calcSkillFromURL(url) {
  const skillPonURL = 'https://www.ponz-web.com/skill/'
  if (url.startsWith(skillPonURL)) {
    try{
      const Races = [
        "Invalid", "ニューター", "コグニート",
        "エルモニー", "パンデモス",
      ]
      const Skills = [
        "Invalid", "筋力", "着こなし", "攻撃回避", "生命力",
        "知能", "持久力", "精神力", "集中力", "呪文抵抗力",
        "素手", "刀剣", "こんぼう", "槍", "銃器", "弓", "盾",
        "投げ", "牙", "罠", "キック", "戦闘技術", "酩酊",
        "物まね", "調教", "破壊魔法", "回復魔法", "強化魔法",
        "神秘魔法", "召喚魔法", "死の魔法", "魔法熟練", "自然調和",
        "暗黒命令", "取引", "シャウト", "音楽", "盗み", "ギャンブル",
        "パフォーマンス", "ダンス", "落下耐性", "水泳", "死体回収",
        "包帯", "自然回復", "採掘", "伐採", "収穫", "釣り",
        "解読", "料理", "鍛冶", "醸造", "木工", "裁縫", "薬調合",
        "装飾細工", "複製", "栽培", "美容",
      ]

      const tpl = url.slice(skillPonURL.length+1).split('&')

      // 種族
      const race = Races[Number(tpl[0])]

      // スキル
      var str = tpl[1]
      var skills = {}
      while(str.length != 0)
      {
        var regex = /^(\d{1,2})([a-zA-F]{2})/g
        const m = regex.exec(str)
        if (m === null) {
          throw "Invalid format"
        }
        skills[Skills[Number(m[1])]] = ponHexToInt(m[2])/10.0
        str = str.slice(regex.lastIndex)
      }

      // 名前
      const name = tpl.length === 2 ? '' : decodeURI(tpl[2])
      return { name: name, url: url, race: race, skills: skills }
    } catch (e) {
      return {}
    }
  } else {
    return {}
  }
}

function ponHexToInt(str) {
  return parseInt(String.fromCharCode.apply(null, Array.prototype.map.call(str, c => {
    const code = c.charCodeAt(0)
    if ('a'.charCodeAt(0) <= code && code <= 'j'.charCodeAt(0)) {
      return code-'a'.charCodeAt(0)+'0'.charCodeAt(0)
    } else if ('k'.charCodeAt(0) <= code && code <= 'z'.charCodeAt(0)) {
      return code-'k'.charCodeAt(0)+'a'.charCodeAt(0)
    } else if ('A'.charCodeAt(0) <= code && code <= 'F'.charCodeAt(0)) {
      return code-'A'.charCodeAt(0)+'q'.charCodeAt(0)
    } else {
      throw "Invalid format"
    }
  })), 32)
}
