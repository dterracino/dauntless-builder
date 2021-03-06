const assert = require("assert");
const Hashids = require("hashids");

const hashids = new Hashids("spicy");

const itemData = require("../dist/data.json");
const stringMap = require("../.map/names.json");

function makeBuild(buildId) {
    let numbers = hashids.decode(buildId);

    const getString = (type, counter) => {
        if (numbers[counter] === 0) {
            return "";
        }

        if (!(type in stringMap)) {
            return "";
        }

        return stringMap[type][numbers[counter]];
    };

    const findWeapon = name => {
        if(name in itemData.weapons) {
            return itemData.weapons[name];
        }

        return null;
    };

    const formatWeaponTypeForParts = weaponType => {
        if (!weaponType) {
            return "null";
        }

        const str = weaponType.toLowerCase().replace(" ", "");
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    let idcounter = 0;

    const version = numbers[idcounter++];

    const weaponName = getString("Weapons", idcounter++);
    const weapon = findWeapon(weaponName);
    const partsType = weapon ? `Parts:${formatWeaponTypeForParts(weapon.type)}` : null;

    let data = {
        __version: version,
        weapon_name: weaponName,
        weapon_level: numbers[idcounter++],
        weapon_cell0: getString("Cells", idcounter++),
        weapon_cell1: getString("Cells", idcounter++),
        weapon_part1_name: getString(partsType, idcounter++),
        weapon_part2_name: getString(partsType, idcounter++),
        weapon_part3_name: getString(partsType, idcounter++),
        weapon_part4_name: getString(partsType, idcounter++),
        bond_weapon_name: getString(partsType, idcounter++),
        weapon_part6_name: getString(partsType, idcounter++),
        head_name: getString("Armours", idcounter++),
        head_level: numbers[idcounter++],
        head_cell: getString("Cells", idcounter++),
        torso_name: getString("Armours", idcounter++),
        torso_level: numbers[idcounter++],
        torso_cell: getString("Cells", idcounter++),
        arms_name: getString("Armours", idcounter++),
        arms_level: numbers[idcounter++],
        arms_cell: getString("Cells", idcounter++),
        legs_name: getString("Armours", idcounter++),
        legs_level: numbers[idcounter++],
        legs_cell: getString("Cells", idcounter++),
        lantern_name: getString("Lanterns", idcounter++),
        lantern_cell: getString("Cells", idcounter++)
    };

    return data;
}

function assertValid(data) {
    for(let [buildId, assertions] of data) {
        let build = makeBuild(buildId);

        for(let assertion of assertions) {
            assert.equal(
                build[assertion.field],
                assertion.value
            );
        }
    }
}

function assertUpgradeFrom2To3Works(v2str, v3str) {
    let numbers = hashids.decode(v2str);

    let data = {
        __version: 3,
        weapon_name: numbers[1],
        weapon_level: numbers[2],
        weapon_cell0: numbers[3],
        weapon_cell1: numbers[4],
        weapon_part1_name: numbers[5],
        weapon_part2_name: numbers[7],
        weapon_part3_name: numbers[9],
        weapon_part4_name: numbers[11],
        bond_weapon_name: numbers[13],
        weapon_part6_name: numbers[15],
        head_name: numbers[17],
        head_level: numbers[18],
        head_cell: numbers[19],
        torso_name: numbers[20],
        torso_level: numbers[21],
        torso_cell: numbers[22],
        arms_name: numbers[23],
        arms_level: numbers[24],
        arms_cell: numbers[25],
        legs_name: numbers[26],
        legs_level: numbers[27],
        legs_cell: numbers[28],
        lantern_name: numbers[29],
        lantern_cell: numbers[30]
    };

    assert.equal(
        v3str,
        hashids.encode(Object.values(data))
    );
}


describe("Dauntless Builder - Build IDs", () => {
    it("should be able to deserialize builds", () => {
        // a random build that someone send me :)
        assertValid([
            ["5OUrCoCRnSBUVcztOTjToTeTaCWC12cOFoCBFYUOCqpFxtjCP2fAt01", [
                {field: "weapon_name", value: "Brutality of Boreus"},
                {field: "weapon_level", value: 15},
                {field: "weapon_part1_name", value: "Mighty Landbreaker"},
                {field: "weapon_part2_name", value: "Impulse Crown"},
                {field: "weapon_cell0", value: "+3 Deconstruction Cell"},
                {field: "weapon_cell1", value: "+3 Assassin's Vigour Cell"},
                {field: "torso_name", value: "Boreal Resolve"},
                {field: "torso_level", value: 15},
                {field: "torso_cell", value: "+3 Iceborne Cell"},
                {field: "arms_name", value: "Boreal Might"},
                {field: "arms_level", value: 15},
                {field: "arms_cell", value: "+3 Aetherhunter Cell"},
                {field: "legs_name", value: "Boreal March"},
                {field: "legs_level", value: 15},
                {field: "legs_cell", value: "+3 Predator Cell"},
                {field: "head_name", value: "Boreal Epiphany"},
                {field: "head_level", value: 15},
                {field: "head_cell", value: "+3 Aetheric Attunement Cell"},
                {field: "lantern_name", value: "Embermane's Rapture"},
                {field: "lantern_cell", value: "+3 Aetheric Attunement Cell"}
            ]]
            // TODO: add more items / build variations etc
        ])
    });
    it("should be able to upgrade build version 2 to 3", () => {
        assertUpgradeFrom2To3Works(
            "4WtbC3CQaSNU6cNTYtxT4TQT4T7TgTBTQTJTkCnCyRI4FjCzFWUyCorFqt0CN3tvtpd",
            "5OUrCoCRnSBUVcztOTjToTeTaCWC12cOFoCBFYUOCqpFxtjCP2fAt01"
        )
    })
});
