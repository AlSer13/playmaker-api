const readline = require('readline');
// const processAllPlayers = require('../processors/processAllPlayers');
// const processTeamfights = require('../processors/processTeamfights');
// const processLogParse = require('../processors/processLogParse');
// const processUploadProps = require('../processors/processUploadProps');
// const processParsedData = require('../processors/processParsedData');
processMetadata = require('./processMetadata');
// const processExpand = require('../processors/processExpand');
// const processDraftTimings = require('../processors/processDraftTimings');


function getParseSchema() {
    return {
        version: 21,
        match_id: 0,
        draft_timings: [],
        teamfights: [],
        objectives: [],
        chat: [],
        radiant_gold_adv: [],
        radiant_xp_adv: [],
        cosmetics: {},
        players: Array(...new Array(10)).map(() =>
            ({
                player_slot: 0,
                obs_placed: 0,
                sen_placed: 0,
                creeps_stacked: 0,
                camps_stacked: 0,
                rune_pickups: 0,
                firstblood_claimed: 0,
                teamfight_participation: 0,
                towers_killed: 0,
                roshans_killed: 0,
                observers_placed: 0,
                stuns: 0,
                max_hero_hit: {
                    value: 0,
                },
                times: [],
                gold_t: [],
                lh_t: [],
                dn_t: [],
                xp_t: [],
                obs_log: [],
                sen_log: [],
                obs_left_log: [],
                sen_left_log: [],
                purchase_log: [],
                kills_log: [],
                buyback_log: [],
                runes_log: [],
                // "pos": {},
                lane_pos: {},
                obs: {},
                sen: {},
                actions: {},
                pings: {},
                purchase: {},
                gold_reasons: {},
                xp_reasons: {},
                killed: {},
                item_uses: {},
                ability_uses: {},
                ability_targets: {},
                damage_targets: {},
                hero_hits: {},
                damage: {},
                damage_taken: {},
                damage_inflictor: {},
                runes: {},
                killed_by: {},
                kill_streaks: {},
                multi_kills: {},
                life_state: {},
                healing: {},
                damage_inflictor_received: {},
                randomed: false,
                repicked: false,
                pred_vict: false,
            })),
    };
}

function createParsedDataBlob(entries, matchId) {
    const meta = processMetadata(entries);
    meta.match_id = matchId;
    console.log(meta);
}

const entries = [];
let complete = false;
const matchId = process.argv[2];
const parseStream = readline.createInterface({
    input: process.stdin,
});
let i = 0;
parseStream.on('line', (e) => {
    i++;
    e = JSON.parse(e);
    entries.push(e);
    if (e.type === 'epilogue') {
        complete = true;
    }
});
parseStream.on('close', () => {
    console.log(i);
    if (complete) {
        console.log("complete");
        createParsedDataBlob(entries, matchId);
    } else {
        process.exit(1);
    }
});
