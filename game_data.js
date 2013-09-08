var SKILL = new Object();

//スキル種別
SKILL.TYPE = new Object();
SKILL.TYPE.HP = 0;  //HPダメージ・回復

//スキル対象範囲
SKILL.RANGE = Object();
SKILL.RANGE.SINGLE = 0;
SKILL.RANGE.ALL = 1;

var game_data = {
    monsters : [
        {
            name : "ネコオーガ",
            hp : 200,
            skill : [1, 1, 1, 1]
        }
    ],
    skills : [
        {
            
        },
        {
            name : "ネコパンチ",
            type : SKILL.TYPE.HP,
            range : SKILL.RANGE.SINGLE,
            power : 10,
            pp : 40
        }
    ]
};