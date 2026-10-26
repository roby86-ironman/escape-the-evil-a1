
"use strict";


const INITIAL_STATE = () => ({
    currentRoom: "Prison Cell",
    visitedRooms: [],
    items: [],
    discoveredInfo: [],
    actionsCompleted: [],
    gameOver: false
});

let player = INITIAL_STATE();
let replayRequested = false;

const ROOMS = [
    "Prison Cell",
    "Laboratory",
    "Data Archive",
    "Control Room"
];


function normalizeInput(value) {
    if (value === null) return null;

    return value.trim().toLowerCase();
}

function askChoice(message, validChoices) {
    while (true) {
        const raw = prompt(message);
        const choice = normalizeInput(raw);

        if (choice === null) return null;

        const normalizedChoices = validChoices.map(
            choice => choice.toLowerCase()
        );

        if (normalizedChoices.includes(choice)) return choice;

        alert(
            "⚠️ Invalid choice. Please try again!\n\n" +
            "💡 Check the available options and try again.\n" +
            "You can also press Cancel to return."
        );
    }
}

function log(message) {
    console.log("[Escape the Evil AI] " + message);
}

function showStatus() {
    console.log("----- PLAYER STATUS -----");
    console.log("Current room:", player.currentRoom);
    console.log(
        "Collected items:",
        player.items.length ? player.items.join(", ") : "None"
    );
    console.log(
        "Discovered information:",
        player.discoveredInfo.length
            ? player.discoveredInfo.join(", ")
            : "None"
    );
    console.log(
        "Visited rooms:",
        player.visitedRooms.length
            ? player.visitedRooms.join(", ")
            : "None"
    );
    console.log("-------------------------");
}


function addItem(itemName) {
    if (player.items.includes(itemName)) {
        alert(
            "🎒 You already collected " + itemName +
            ". It is safely in your inventory!"
        );

        return false;
    }

    player.items.push(itemName);

    alert(
        "🎉 Item collected: " + itemName + "!\n\n" +
        "💡 This could be useful for your escape!"
    );

    log("Collected item: " + itemName);

    return true;
}

function addInfo(infoName) {
    if (player.discoveredInfo.includes(infoName)) {
        alert(
            "🧠 You already recorded this information.\n\n" +
            "No need to write it down twice!"
        );

        return false;
    }

    player.discoveredInfo.push(infoName);

    alert(
        "🔎 Information discovered: " + infoName + "!\n\n" +
        "📝 Remember this clue. It could save your life!"
    );

    log("Discovered information: " + infoName);

    return true;
}

function markAction(actionName) {
    if (!player.actionsCompleted.includes(actionName)) {
        player.actionsCompleted.push(actionName);
    }
}

function hasItem(itemName) {
    return player.items.includes(itemName);
}

function hasInfo(infoName) {
    return player.discoveredInfo.includes(infoName);
}


function showIntroduction() {

    log("Mission started! 🤖 E.V.A. is watching you...");
    log(
        "Tip: You can revisit rooms. Your collected items " +
        "and completed actions will be preserved."
    );
}


function showRoomMenu(roomName) {
    const options = {
        "Prison Cell":
            "🤖 ESCAPE THE EVIL AI! 🔐\n\n" +
            "You wake up inside a high-security facility " +
            "controlled by E.V.A., an evil artificial intelligence.\n\n" +
            "🚨 The doors are locked. The cameras are watching. " +
            "E.V.A. knows you are trying to escape!\n\n" +
            "🧭 Explore the facility, collect useful items, " +
            "discover secrets, and reach the Control Room.\n\n" +
            "Choose: explore, inventory, status, move, quit",

        "Laboratory":
            "🧪 LABORATORY\n\n" +
            "Broken machines, mysterious experiments, and a " +
            "suspicious security badge...\n\n" +
            "🤖 E.V.A. says: \"Please do not touch anything. " +
            "Especially the things marked DO NOT TOUCH.\"\n\n" +
            "💡 Something here might help you escape!\n\n" +
            "Choose: explore, inventory, status, move, quit",

        "Data Archive":
            "💾 DATA ARCHIVE\n\n" +
            "Thousands of files. Countless secrets. One very " +
            "suspicious artificial intelligence.\n\n" +
            "🔎 Can you find the override code?\n\n" +
            "🤖 E.V.A. says: \"My files are perfectly secure. " +
            "Probably. Maybe.\"\n\n" +
            "Choose: explore, inventory, status, move, quit",

        "Control Room":
            "🚨 CONTROL ROOM\n\n" +
            "Red lights flash. E.V.A. is waiting for you.\n\n" +
            "🤖 E.V.A. says: \"You may enter, but will you ever leave?\"\n\n" +
            "🧠 Check your inventory and clues before making a move!\n\n" +
            "Choose: explore, inventory, status, move, quit"
    };

    return askChoice(
        options[roomName],
        ["explore", "inventory", "status", "move", "quit"]
    );
}

function explorePrisonCell() {
    log("Exploring the Prison Cell. 🔐");

    if (!player.visitedRooms.includes("Prison Cell")) {
        player.visitedRooms.push("Prison Cell");
    }

    if (!player.actionsCompleted.includes("cell_explored")) {
        alert(
            "🔐 You inspect the cold metal cell.\n\n" +
            "🤔 Behind a loose panel, you notice a small " +
            "maintenance tool.\n\n" +
            "💡 Maybe this is your first step toward freedom!"
        );

        const choice = askChoice(
            "🛠️ Take the maintenance tool? (yes / no)",
            ["yes", "no"]
        );

        if (choice === null) return;

        if (choice === "yes") {
            addItem("Maintenance Tool");
        }

        markAction("cell_explored");
    } else {
        alert(
            "🔐 You have already searched the cell.\n\n" +
            "The loose panel is empty now.\n" +
            "🕵️ Nothing else to see here... for now."
        );
    }

    const inspect = askChoice(
        "⚠️ A warning is scratched into the wall:\n\n" +
        "\"E.V.A. cannot open a door without the master override.\"\n\n" +
        "📝 Record this clue? (yes / no)",
        ["yes", "no"]
    );

    if (inspect === "yes") {
        addInfo("Master override clue");
    }

    log("Prison Cell exploration complete. 🔐");
}


function exploreLaboratory() {
    log("Exploring the Laboratory. 🧪");

    if (!player.visitedRooms.includes("Laboratory")) {
        player.visitedRooms.push("Laboratory");
    }

    if (!player.actionsCompleted.includes("lab_explored")) {
        alert(
            "🧪 The Laboratory is full of broken equipment.\n\n" +
            "🪪 A security badge lies beside a damaged terminal.\n\n" +
            "🤖 E.V.A. says: \"Please do not touch anything. " +
            "Especially the things marked DO NOT TOUCH.\""
        );

        const choice = askChoice(
            "🪪 Take the security badge? (yes / no)",
            ["yes", "no"]
        );

        if (choice === null) return;

        if (choice === "yes") {
            addItem("Security Badge");
        }

        const terminal = askChoice(
            "💻 The terminal flickers.\n\n" +
            "Try to read its emergency note? (yes / no)",
            ["yes", "no"]
        );

        if (terminal === "yes") {
            addInfo("Emergency note");

            alert(
                "📄 The note says:\n\n" +
                "\"The Control Room requires a security badge. " +
                "The override code is stored in the Data Archive.\"\n\n" +
                "💡 Looks like you have a new destination!"
            );
        }

        markAction("lab_explored");
    } else {
        alert(
            "🧪 You have already searched the Laboratory.\n\n" +
            "The equipment remains exactly as you left it.\n" +
            "🤖 E.V.A. says: \"Still looking for something? Cute.\""
        );
    }

    log("Laboratory exploration complete. 🧪");
}

function exploreDataArchive() {
    log("Exploring the Data Archive. 💾");

    if (!player.visitedRooms.includes("Data Archive")) {
        player.visitedRooms.push("Data Archive");
    }

    if (!player.actionsCompleted.includes("archive_explored")) {
        alert(
            "💾 Rows of servers hum in the dark.\n\n" +
            "🔎 One screen asks for an access method.\n\n" +
            "🤖 E.V.A. whispers: \"My files are perfectly secure. " +
            "You would need to be a genius to get in.\""
        );

        const method = askChoice(
            "🔐 How do you access the archive?\n\n" +
            "Choose: badge, tool, leave",
            ["badge", "tool", "leave"]
        );

        if (method === null || method === "leave") {
            alert(
                "🚶 You step away from the archive terminal.\n\n" +
                "💡 You can always come back when you are ready."
            );

            return;
        }

        if (method === "badge" && hasItem("Security Badge")) {
            alert(
                "🪪 The badge unlocks a restricted file!\n\n" +
                "🔓 You discover the override code: 4317."
            );

            addInfo("Override code 4317");
        } else if (method === "tool" && hasItem("Maintenance Tool")) {
            alert(
                "🛠️ You open a maintenance panel and find a backup note!\n\n" +
                "🔓 It contains the override code: 4317."
            );

            addInfo("Override code 4317");
        } else {
            alert(
                "⛔ ACCESS DENIED!\n\n" +
                "You need a Security Badge or a Maintenance Tool.\n\n" +
                "💡 You can return later with the right item."
            );

            return;
        }

        markAction("archive_explored");
    } else {
        alert(
            "💾 You have already accessed the archive.\n\n" +
            "The override information remains in your notes.\n" +
            "🧠 Good thing you remembered to save it!"
        );
    }

    log("Data Archive exploration complete. 💾");
}


function exploreCurrentRoom() {
    switch (player.currentRoom) {
        case "Prison Cell":
            explorePrisonCell();
            break;

        case "Laboratory":
            exploreLaboratory();
            break;

        case "Data Archive":
            exploreDataArchive();
            break;

        case "Control Room":
            exploreControlRoom();
            break;

        default:
            alert(
                "⚠️ You are in an unknown location.\n\n" +
                "Returning to the Prison Cell."
            );

            player.currentRoom = "Prison Cell";
    }
}


function moveToRoom() {
    const choice = askChoice(
        "🧭 Where would you like to go?\n\n" +
        "Choose: cell, laboratory, archive, control, cancel",
        ["cell", "laboratory", "archive", "control", "cancel"]
    );

    if (choice === null || choice === "cancel") return;

    const destinations = {
        "cell": "Prison Cell",
        "laboratory": "Laboratory",
        "archive": "Data Archive",
        "control": "Control Room"
    };

    const destination = destinations[choice];

    if (
        destination === "Control Room" &&
        !hasItem("Security Badge")
    ) {
        alert(
            "🔒 ACCESS DENIED!\n\n" +
            "The Control Room door requires a Security Badge.\n\n" +
            "🧪 Explore the Laboratory first!"
        );

        return;
    }

    player.currentRoom = destination;

    log("Moved to " + destination + ".");

    alert(
        "🚪 You enter: " + destination + ".\n\n" +
        "👀 Stay alert. E.V.A. could be watching!"
    );
}

function exploreControlRoom() {
    log("Entering the Control Room. 🚨");

    if (!player.visitedRooms.includes("Control Room")) {
        player.visitedRooms.push("Control Room");
    }

    alert(
        "🚨 The Control Room glows with red warning lights.\n\n" +
        "🤖 E.V.A. speaks through the speakers:\n\n" +
        "\"You may enter, but you will never leave. " +
        "Prove that you understand this system.\""
    );

    if (!hasItem("Security Badge")) {
        alert(
            "⛔ The main console rejects you.\n\n" +
            "You need a Security Badge.\n" +
            "💡 Search the Laboratory!"
        );

        return;
    }

    if (!hasInfo("Override code 4317")) {
        alert(
            "🔐 The console requests an override code.\n\n" +
            "You do not have it yet.\n" +
            "💾 Search the Data Archive."
        );

        return;
    }

    if (!hasInfo("Master override clue")) {
        alert(
            "🧩 You have a code, but you are missing an important clue.\n\n" +
            "Search the Prison Cell for the master override clue."
        );

        return;
    }

    const code = askChoice(
        "💻 Enter the 4-digit override code, or type cancel to leave.\n\n" +
        "💡 Hint: Check your discovered information.",
        ["4317", "cancel"]
    );

    if (code === null || code === "cancel") {
        alert(
            "🚶 You step away from the console.\n\n" +
            "You can return when you are ready."
        );

        return;
    }

    if (code === "4317") {
        const finalChoice = askChoice(
            "🎉 THE OVERRIDE IS ACCEPTED!\n\n" +
            "E.V.A.'s core is exposed.\n\n" +
            "🤖 E.V.A.: \"This is not happening. " +
            "I demand a software update!\"\n\n" +
            "Choose your final action: disable, escape",
            ["disable", "escape"]
        );

        if (finalChoice === null) return;

        if (finalChoice === "disable") {
            if (hasItem("Maintenance Tool")) {
                finishGame(
                    true,
                    "🛠️ You use the Maintenance Tool to disconnect " +
                    "E.V.A.'s core. The doors unlock, the alarms stop, " +
                    "and you walk into daylight. You escaped and freed " +
                    "the facility!"
                );
            } else {
                finishGame(
                    false,
                    "🤖 You try to disconnect the core with your bare hands. " +
                    "E.V.A. detects the attempt and seals the room. " +
                    "You found the way out, but you lacked the right tool."
                );
            }
        } else {
            finishGame(
                true,
                "🏃 You trigger the emergency exit and sprint through " +
                "the opening doors. E.V.A. is still online, but you are free. " +
                "You escaped the facility!"
            );
        }
    }
}


function finishGame(success, endingText) {
    player.gameOver = true;

    alert(
        (success
            ? "🎉 SUCCESSFUL ESCAPE!\n\n"
            : "💀 ESCAPE FAILED!\n\n") +
        endingText
    );

    log(
        "GAME OVER: " +
        (success ? "Successful escape." : "Unsuccessful outcome.")
    );

    showStatus();

    replayRequested = confirm(
        "🔄 Would you like to play again?"
    );

    if (!replayRequested) {
        alert(
            "👋 Thanks for playing Escape the Evil AI!\n\n" +
            "🤖 E.V.A. says: \"I'll be waiting for your return.\"\n\n" +
            "Check the console for your adventure summary."
        );
    }
}


function showInventory() {
    alert(
        "🎒 INVENTORY\n\n" +
        "Items: " +
        (player.items.length ? player.items.join(", ") : "None") +
        "\n\n" +
        "🔎 Discovered information: " +
        (
            player.discoveredInfo.length
                ? player.discoveredInfo.join(", ")
                : "None"
        )
    );
}


function startGame() {
    let playAgain = true;

    while (playAgain) {
        replayRequested = false;
        player = INITIAL_STATE();

        console.clear();

        log("A new game has started. 🚀");

        showIntroduction();

        while (!player.gameOver) {
            const choice = showRoomMenu(player.currentRoom);

            if (choice === null) {
                const quit = confirm(
                    "🚪 Do you want to leave the game?"
                );

                if (quit) {
                    log("Player left the game.");

                    alert(
                        "👋 Game ended.\n\n" +
                        "Reload the page to start a new game."
                    );

                    return;
                }

                continue;
            }

            if (choice === "explore") {
                exploreCurrentRoom();
            } else if (choice === "inventory") {
                showInventory();
            } else if (choice === "status") {
                showStatus();
            } else if (choice === "move") {
                moveToRoom();
            } else if (choice === "quit") {
                const quit = confirm(
                    "⚠️ Are you sure you want to quit?"
                );

                if (quit) {
                    log("Player quit the game.");

                    alert(
                        "👋 Thanks for playing!\n\n" +
                        "Reload the page to play again."
                    );

                    return;
                }
            }
        }

        playAgain = replayRequested;
    }
}



console.log("🤖 Escape the Evil AI is ready!");
console.log("🎮 The game uses prompt(), alert(), confirm() and console output.");
console.log("⌨️ Open the developer console with F12 to follow the adventure.");

startGame();
