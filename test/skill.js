import assert from 'power-assert'
import { calcSkillFromURL } from '../src/skill'

describe('calcSkillFromURL', () => {
  it('単純なケース', () => {
    const url = 'https://www.ponz-web.com/skill/?3&1jm4gi6sy28se29cA34ew48Ce49Ce51Fi53Fi55Fi56Fi60ym'
    const ret = calcSkillFromURL(url)
    assert.equal(ret.name, '')
    assert.equal(ret.race, 'エルモニー')
    const expected = {
      "筋力": 30.0, "生命力": 20.0, "持久力": 60.0,
      "収穫": 90.0, "釣り": 90.0, "料理": 100.0,
      "醸造": 100.0, "裁縫": 100.0, "薬調合": 100.0,
      "美容": 78.0, "神秘魔法": 58.0, "召喚魔法": 9.0,
      "取引": 15.0
    }
    assert.equal(Object.keys(ret.skills).length, Object.keys(expected).length)
    var keys = Object.keys(ret.skills).sort()
    keys.forEach((key) => {
      assert(key in expected)
      assert.equal(ret.skills[key].toFixed(1), expected[key].toFixed(1))
    })
  })
})
