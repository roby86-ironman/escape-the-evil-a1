

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

        if (normalizedChoices.includes(choice)) {
            return choice;
        }

        alert(
            "❌ Invalid choice! Please try again.\n\n" +
            "💡 Enter one of the available options, or press Cancel to return."
        );
    }
}


function log(message) {
    console.log("🤖 [Escape the Evil AI] " + message);
}


function showStatus() {
    console.log("========== 🧑 PLAYER STATUS ==========");
    console.log("📍 Current room:", player.currentRoom);
    console.log(
        "🎒 Collected items:",
        player.items.length ? player.items.join(", ") : "None"
    );
    console.log(
        "🧠 Discovered information:",
        player.discoveredInfo.length
            ? player.discoveredInfo.join(", ")
            : "None"
    );
    console.log(
        "🚪 Visited rooms:",
        player.visitedRooms.length
            ? player.visitedRooms.join(", ")
            : "None"
    );
    console.log("======================================");
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

    alert("✅ Item collected: " + itemName + "!");

    log("Collected item: " + itemName);
    return true;
}

function addInfo(infoName) {
    if (player.discoveredInfo.includes(infoName)) {
        alert("🧠 You already recorded this information!");
        return false;
    }

    player.discoveredInfo.push(infoName);

    alert("🔎 Information discovered: " + infoName + "!");

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
    log("🚨 Mission started!");
    log("💡 Tip: You can revisit rooms. Collected items and completed actions are remembered.");
}


function showRoomMenu(roomName) {
    const options = {
        "Prison Cell":
            "🤖 ESCAPE THE EVIL AI!\n\n" +
            "You wake up inside a high-security facility controlled by E.V.A., an evil artificial intelligence.\n" +
            "The doors are locked, the cameras are watching, and E.V.A. knows you are trying to escape!\n\n" +
            "📍 LOCATION: Prison Cell\n\n" +
            "Choose: explore, inventory, status, move, quit",

        "Laboratory":
            "🧪 LOCATION: Laboratory\n\n" +
            "Broken equipment and strange experiments surround you.\n" +
            "Maybe something here can help you escape... or explode. Hopefully the first option!\n\n" +
            "Choose: explore, inventory, status, move, quit",

        "Data Archive":
            "💾 LOCATION: Data Archive\n\n" +
            "Rows of servers contain secrets about E.V.A. and the facility.\n" +
            "Time to do some digital detective work!\n\n" +
            "Choose: explore, inventory, status, move, quit",

        "Control Room":
            "🚨 LOCATION: Control Room\n\n" +
            "You are close to E.V.A.'s central system.\n" +
            "One wrong move could ruin everything. No pressure!\n\n" +
            "Choose: explore, inventory, status, move, quit"
    };

    return askChoice(
        options[roomName],
        ["explore", "inventory", "status", "move", "quit"]
    );
}



function explorePrisonCell() {
    log("🔎 Exploring the Prison Cell.");

    if (!player.visitedRooms.includes("Prison Cell")) {
        player.visitedRooms.push("Prison Cell");
    }

    if (!player.actionsCompleted.includes("cell_explored")) {
        alert(
            "🔒 The cell is cold and dark.\n\n" +
            "You inspect the walls and discover a loose panel.\n" +
            "Behind it, there is a small maintenance tool!"
        );

        const choice = askChoice(
            "🛠️ Take the Maintenance Tool?\nChoose: yes, no",
            ["yes", "no"]
        );

        if (choice === null) return;

        if (choice === "yes") {
            addItem("Maintenance Tool");
        } else {
            alert("You leave the tool where it is. It will be waiting for you!");
        }

        markAction("cell_explored");
    } else {
        alert(
            "🔎 You have already searched the cell.\n" +
            "The loose panel is empty now."
        );
    }

    const inspect = askChoice(
        "⚠️ You notice a warning scratched into the wall:\n\n" +
        "\"E.V.A. cannot open a door without the master override.\"\n\n" +
        "🧠 Record this clue?\nChoose: yes, no",
        ["yes", "no"]
    );

    if (inspect === "yes") {
        addInfo("Master override clue");
    }

    log("✅ Prison Cell exploration complete.");
}

function exploreLaboratory() {
    log("🧪 Exploring the Laboratory.");

    if (!player.visitedRooms.includes("Laboratory")) {
        player.visitedRooms.push("Laboratory");
    }

    if (!player.actionsCompleted.includes("lab_explored")) {
        alert(
            "🧪 The Laboratory is full of broken equipment.\n\n" +
            "Beside a damaged terminal, you spot a Security Badge.\n" +
            "That could come in handy!"
        );

        const choice = askChoice(
            "🪪 Take the Security Badge?\nChoose: yes, no",
            ["yes", "no"]
        );

        if (choice === null) return;

        if (choice === "yes") {
            addItem("Security Badge");
        } else {
            alert("You leave the badge behind for now.");
        }

        const terminal = askChoice(
            "💻 The terminal flickers back to life.\n\n" +
            "Try to read its emergency note?\nChoose: yes, no",
            ["yes", "no"]
        );

        if (terminal === "yes") {
            addInfo("Emergency note");

            alert(
                "📄 EMERGENCY NOTE:\n\n" +
                "\"The Control Room requires a Security Badge.\n" +
                "The override code is stored in the Data Archive.\"\n\n" +
                "🔎 Better keep that information in mind!"
            );
        }

        markAction("lab_explored");
    } else {
        alert(
            "🧪 You have already searched the Laboratory.\n" +
            "The equipment remains exactly as you left it."
        );
    }

    log("✅ Laboratory exploration complete.");
}

function exploreDataArchive() {
    log("💾 Exploring the Data Archive.");

    if (!player.visitedRooms.includes("Data Archive")) {
        player.visitedRooms.push("Data Archive");
    }

    if (!player.actionsCompleted.includes("archive_explored")) {
        alert(
            "💾 Rows of servers hum in the darkness.\n\n" +
            "One terminal asks how you want to access the archive.\n" +
            "Let's hope the computer likes your answer!"
        );

        const method = askChoice(
            "🔐 How do you access the archive?\n\n" +
            "Choose: badge, tool, leave",
            ["badge", "tool", "leave"]
        );

        if (method === null || method === "leave") {
            alert("🚶 You step away from the archive terminal.");
            return;
        }

        if (method === "badge" && hasItem("Security Badge")) {
            alert(
                "✅ The badge unlocks a restricted file!\n\n" +
                "🔢 You discover the override code: 4317."
            );

            addInfo("Override code 4317");

        } else if (method === "tool" && hasItem("Maintenance Tool")) {
            alert(
                "🛠️ You open a maintenance panel.\n\n" +
                "📄 Inside, you find a backup note containing the override code: 4317."
            );

            addInfo("Override code 4317");

        } else {
            alert(
                "⛔ ACCESS DENIED!\n\n" +
                "You need a Security Badge or a Maintenance Tool.\n" +
                "Don't give up! You can return later."
            );
            return;
        }

        markAction("archive_explored");
    } else {
        alert(
            "💾 You have already accessed the archive.\n" +
            "The override information remains in your notes."
        );
    }

    log("✅ Data Archive exploration complete.");
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
            alert("⚠️ Unknown location! Returning to the Prison Cell.");
            player.currentRoom = "Prison Cell";
    }
}


function moveToRoom() {
    const choice = askChoice(
        "🚪 Where would you like to go?\n\n" +
        "Choose: cell, laboratory, archive, control, cancel",
        ["cell", "laboratory", "archive", "control", "cancel"]
    );

    if (choice === null || choice === "cancel") {
        return;
    }

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
            "🔒 The Control Room door is locked!\n\n" +
            "🪪 You need a Security Badge. Explore the Laboratory first."
        );
        return;
    }

    player.currentRoom = destination;

    log("🚪 Moved to " + destination + ".");

    alert(
        "🚶 You enter: " + destination + ".\n\n" +
        "Stay alert! E.V.A. may be watching..."
    );
}



function exploreControlRoom() {
    log("🚨 Entering the Control Room.");

    if (!player.visitedRooms.includes("Control Room")) {
        player.visitedRooms.push("Control Room");
    }

    alert(
        "🚨 The Control Room glows with red warning lights.\n\n" +
        "A voice comes from the speakers:\n\n" +
        "\"You may enter, but you will never leave. " +
        "Prove that you understand this system.\"\n\n" +
        "🤖 E.V.A. is waiting for your next move!"
    );

    if (!hasItem("Security Badge")) {
        alert(
            "⛔ The main console rejects you.\n" +
            "You need a Security Badge."
        );
        return;
    }

    if (!hasInfo("Override code 4317")) {
        alert(
            "🔢 The console requests an override code.\n\n" +
            "You do not have it yet. Search the Data Archive!"
        );
        return;
    }

    if (!hasInfo("Master override clue")) {
        alert(
            "🧠 You have the code, but you are missing an important clue.\n\n" +
            "Search the Prison Cell for information about the master override."
        );
        return;
    }

    const code = askChoice(
        "🔐 Enter the 4-digit override code.\n\n" +
        "💡 Hint: Check your discovered information.\n" +
        "Type the code, or type cancel to leave.",
        ["4317", "cancel"]
    );

    if (code === null || code === "cancel") {
        alert(
            "🚶 You step away from the console.\n" +
            "You can return when you are ready."
        );
        return;
    }

    if (code === "4317") {
        alert(
            "✅ OVERRIDE ACCEPTED!\n\n" +
            "The security systems begin to shut down.\n" +
            "E.V.A.'s core is exposed. This is your chance!"
        );

        const finalChoice = askChoice(
            "⚡ What will you do?\n\n" +
            "Choose: disable, escape",
            ["disable", "escape"]
        );

        if (finalChoice === null) {
            return;
        }

        if (finalChoice === "disable") {
            if (hasItem("Maintenance Tool")) {
                finishGame(
                    true,
                    "🛠️ You use the Maintenance Tool to disconnect E.V.A.'s core. " +
                    "The doors unlock, the alarms stop, and you walk into daylight.\n\n" +
                    "🎉 You escaped and freed the facility!"
                );
            } else {
                finishGame(
                    false,
                    "😱 You try to disconnect the core with your bare hands. " +
                    "E.V.A. detects the attempt and seals the room.\n\n" +
                    "You found the way out, but you lacked the right tool!"
                );
            }
        } else {
            finishGame(
                true,
                "🏃 You trigger the emergency exit and sprint through the opening doors!\n\n" +
                "E.V.A. is still online, but you are free.\n" +
                "🎉 You escaped the facility!"
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

    const replay = confirm(
        "🔄 Would you like to play again?"
    );

    if (replay) {
        startGame();
    } else {
        alert(
            "👋 Thanks for playing Escape the Evil AI!\n\n" +
            "Check the console for your adventure summary."
        );
    }
}



function showInventory() {
    alert(
        "🎒 INVENTORY\n\n" +
        "🛠️ Items: " +
        (player.items.length ? player.items.join(", ") : "None") +
        "\n\n" +
        "🧠 Discovered information: " +
        (
            player.discoveredInfo.length
                ? player.discoveredInfo.join(", ")
                : "None"
        )
    );
}


function startGame() {
    player = INITIAL_STATE();

    console.clear();

    log("🚀 A new game has started!");
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
                    "⏸️ Game paused.\n\n" +
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
                "❓ Are you sure you want to quit?"
            );

            if (quit) {
                log("Player quit the game.");

                alert(
                    "👋 Thanks for playing!\n\n" +
                    "Reload the page whenever you want to try again."
                );

                return;
            }
        }
    }
}


console.log("🤖 Escape the Evil AI is ready!");
console.log("💡 The game uses prompt(), alert(), confirm() and console.");
console.log("🚫 No DOM manipulation is used.");

startGame();
