/*
 * ESCAPE THE EVIL AI!
 * Team project
 *
 * Roberto Binetti: main structure, game loop, player state, validation, restart.
 * Siraj: rooms, exploration choices, item collection and revisiting rooms.
 * Jehosue: story, Control Room, endings and dialog-based user experience.
 *
 * The game intentionally uses prompt(), alert(), confirm() and console.
 * It does not use DOM manipulation.
 */

"use strict";

// ------------------------------
// ROBERTO: shared game state
// ------------------------------

const INITIAL_STATE = () => ({
    currentRoom: "Prison Cell",
    visitedRooms: [],
    items: [],
    discoveredInfo: [],
    actionsCompleted: [],
    gameOver: false
});

let player = INITIAL_STATE();

const ROOMS = ["Prison Cell", "Laboratory", "Data Archive", "Control Room"];

function normalizeInput(value) {
    // Handles Cancel (null), capitalization and unnecessary spaces.
    if (value === null) return null;
    return value.trim().toLowerCase();
}

function askChoice(message, validChoices) {
    /*
     * Returns a normalized valid choice.
     * Returns null if the player presses Cancel.
     * Invalid choices do not advance the game.
     */
    while (true) {
        const raw = prompt(message);
        const choice = normalizeInput(raw);

        if (choice === null) return null;

        const normalizedChoices = validChoices.map(choice => choice.toLowerCase());
        if (normalizedChoices.includes(choice)) return choice;

        alert("Invalid choice. Please try again. You can also press Cancel to return.");
    }
}

function log(message) {
    console.log("[Escape the Evil AI] " + message);
}

function showStatus() {
    console.log("----- PLAYER STATUS -----");
    console.log("Current room:", player.currentRoom);
    console.log("Collected items:", player.items.length ? player.items.join(", ") : "None");
    console.log("Discovered information:", player.discoveredInfo.length ? player.discoveredInfo.join(", ") : "None");
    console.log("Visited rooms:", player.visitedRooms.length ? player.visitedRooms.join(", ") : "None");
    console.log("-------------------------");
}

function addItem(itemName) {
    // Items can only be collected once.
    if (player.items.includes(itemName)) {
        alert("You already collected " + itemName + ". It is safely in your inventory.");
        return false;
    }

    player.items.push(itemName);
    alert("Item collected: " + itemName + "!");
    log("Collected item: " + itemName);
    return true;
}

function addInfo(infoName) {
    if (player.discoveredInfo.includes(infoName)) {
        alert("You already recorded this information.");
        return false;
    }

    player.discoveredInfo.push(infoName);
    alert("Information discovered: " + infoName + ".");
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

// ------------------------------
// JEHOSUE: story and introduction
// ------------------------------

function showIntroduction() {
    alert(
        "ESCAPE THE EVIL AI!\n\n" +
        "You wake up inside a high-security facility controlled by an artificial intelligence called E.V.A. " +
        "The doors are locked, the cameras are watching, and E.V.A. knows you are trying to escape.\n\n" +
        "Explore the facility, collect useful items, discover secrets, and reach the Control Room.\n" +
        "Your decisions determine whether you escape or become part of E.V.A.'s system."
    );

    log("Mission started. Explore carefully and keep track of what you discover.");
    log("Tip: You can revisit rooms. Your collected items and completed actions will be preserved.");
}

function showRoomMenu(roomName) {
    const options = {
        "Prison Cell": "You are in the Prison Cell.\n\nChoose: explore, inventory, status, move, quit",
        "Laboratory": "You are in the Laboratory.\n\nChoose: explore, inventory, status, move, quit",
        "Data Archive": "You are in the Data Archive.\n\nChoose: explore, inventory, status, move, quit",
        "Control Room": "You are in the Control Room.\n\nChoose: explore, inventory, status, move, quit"
    };

    return askChoice(options[roomName], ["explore", "inventory", "status", "move", "quit"]);
}

// ------------------------------
// SIRAJ: rooms and exploration
// ------------------------------

function explorePrisonCell() {
    log("Exploring the Prison Cell.");

    if (!player.visitedRooms.includes("Prison Cell")) {
        player.visitedRooms.push("Prison Cell");
    }

    if (!player.actionsCompleted.includes("cell_explored")) {
        alert("You inspect the cold metal cell. Behind a loose panel, you notice a small maintenance tool.");
        const choice = askChoice("Take the maintenance tool? (yes / no)", ["yes", "no"]);
        if (choice === null) return;
        if (choice === "yes") addItem("Maintenance Tool");
        markAction("cell_explored");
    } else {
        alert("You have already searched the cell. The loose panel is empty now.");
    }

    const inspect = askChoice(
        "A warning is scratched into the wall: 'E.V.A. cannot open a door without the master override.'\nRecord this clue? (yes / no)",
        ["yes", "no"]
    );

    if (inspect === "yes") addInfo("Master override clue");
    log("Prison Cell exploration complete.");
}

function exploreLaboratory() {
    log("Exploring the Laboratory.");

    if (!player.visitedRooms.includes("Laboratory")) {
        player.visitedRooms.push("Laboratory");
    }

    if (!player.actionsCompleted.includes("lab_explored")) {
        alert("The Laboratory is full of broken equipment. A security badge lies beside a damaged terminal.");
        const choice = askChoice("Take the security badge? (yes / no)", ["yes", "no"]);
        if (choice === null) return;
        if (choice === "yes") addItem("Security Badge");

        const terminal = askChoice(
            "The terminal flickers. Try to read its emergency note? (yes / no)",
            ["yes", "no"]
        );

        if (terminal === "yes") {
            addInfo("Emergency note");
            alert("The note says: 'The Control Room requires a security badge. The override code is stored in the Data Archive.'");
        }

        markAction("lab_explored");
    } else {
        alert("You have already searched the Laboratory. The equipment remains exactly as you left it.");
    }

    log("Laboratory exploration complete.");
}

function exploreDataArchive() {
    log("Exploring the Data Archive.");

    if (!player.visitedRooms.includes("Data Archive")) {
        player.visitedRooms.push("Data Archive");
    }

    if (!player.actionsCompleted.includes("archive_explored")) {
        alert("Rows of servers hum in the dark. One screen asks for an access method.");

        let method = askChoice(
            "How do you access the archive?\nChoose: badge, tool, leave",
            ["badge", "tool", "leave"]
        );

        if (method === null || method === "leave") {
            alert("You step away from the archive terminal.");
            return;
        }

        if (method === "badge" && hasItem("Security Badge")) {
            alert("The badge unlocks a restricted file. You discover the override code: 4317.");
            addInfo("Override code 4317");
        } else if (method === "tool" && hasItem("Maintenance Tool")) {
            alert("You open a maintenance panel and find a backup note containing the override code: 4317.");
            addInfo("Override code 4317");
        } else {
            alert("Access denied. You need a Security Badge or a Maintenance Tool. You can return later.");
            return;
        }

        markAction("archive_explored");
    } else {
        alert("You have already accessed the archive. The override information remains in your notes.");
    }

    log("Data Archive exploration complete.");
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
            alert("You are in an unknown location. Returning to the Prison Cell.");
            player.currentRoom = "Prison Cell";
    }
}

function moveToRoom() {
    const choice = askChoice(
        "Where would you like to go?\nChoose: cell, laboratory, archive, control, cancel",
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

    if (destination === "Control Room" && !hasItem("Security Badge")) {
        alert("The Control Room door requires a Security Badge. Explore the Laboratory first.");
        return;
    }

    player.currentRoom = destination;
    log("Moved to " + destination + ".");
    alert("You enter: " + destination + ".");
}

// ------------------------------
// JEHOSUE: Control Room and endings
// ------------------------------

function exploreControlRoom() {
    log("Entering the Control Room.");

    if (!player.visitedRooms.includes("Control Room")) {
        player.visitedRooms.push("Control Room");
    }

    alert(
        "The Control Room glows with red warning lights. E.V.A. speaks through the speakers:\n\n" +
        "'You may enter, but you will never leave. Prove that you understand this system.'"
    );

    if (!hasItem("Security Badge")) {
        alert("The main console rejects you. You need a Security Badge.");
        return;
    }

    if (!hasInfo("Override code 4317")) {
        alert("The console requests an override code. You do not have it yet. Search the Data Archive.");
        return;
    }

    if (!hasInfo("Master override clue")) {
        alert("You have a code, but you are missing an important clue about the master override. Search the Prison Cell.");
        return;
    }

    const code = askChoice(
        "Enter the 4-digit override code, or type cancel to leave:\nHint: Check your discovered information.",
        ["4317", "cancel"]
    );

    if (code === null || code === "cancel") {
        alert("You step away from the console. You can return when you are ready.");
        return;
    }

    if (code === "4317") {
        const finalChoice = askChoice(
            "The override is accepted. E.V.A.'s core is exposed.\nChoose: disable, escape",
            ["disable", "escape"]
        );

        if (finalChoice === null) return;

        if (finalChoice === "disable") {
            if (hasItem("Maintenance Tool")) {
                finishGame(true,
                    "You use the Maintenance Tool to disconnect E.V.A.'s core. The doors unlock, the alarms stop, and you walk into daylight. You escaped and freed the facility!");
            } else {
                finishGame(false,
                    "You try to disconnect the core with your bare hands. E.V.A. detects the attempt and seals the room. You found the way out, but you lacked the right tool.");
            }
        } else {
            finishGame(true,
                "You trigger the emergency exit and sprint through the opening doors. E.V.A. is still online, but you are free. You escaped the facility!");
        }
    }
}

function finishGame(success, endingText) {
    player.gameOver = true;
    alert((success ? "SUCCESSFUL ESCAPE!\n\n" : "ESCAPE FAILED!\n\n") + endingText);
    log("GAME OVER: " + (success ? "Successful escape." : "Unsuccessful outcome."));
    showStatus();

    const replay = confirm("Would you like to play again?");
    if (replay) {
        startGame();
    } else {
        alert("Thanks for playing Escape the Evil AI! Check the console for your adventure summary.");
    }
}

// ------------------------------
// ROBERTO: inventory, game loop, restart
// ------------------------------

function showInventory() {
    alert(
        "INVENTORY\n\n" +
        "Items: " + (player.items.length ? player.items.join(", ") : "None") + "\n\n" +
        "Discovered information: " + (player.discoveredInfo.length ? player.discoveredInfo.join(", ") : "None")
    );
}

function startGame() {
    // Restart always resets every part of the player's progress.
    player = INITIAL_STATE();

    console.clear();
    log("A new game has started.");
    showIntroduction();

    while (!player.gameOver) {
        const choice = showRoomMenu(player.currentRoom);

        // Cancel from the room menu safely asks whether to exit.
        if (choice === null) {
            const quit = confirm("Do you want to leave the game?");
            if (quit) {
                log("Player left the game.");
                alert("Game paused. Click Start / Restart Game to begin again.");
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
            const quit = confirm("Are you sure you want to quit?");
            if (quit) {
                log("Player quit the game.");
                alert("Thanks for playing! Click Start / Restart Game whenever you want to try again.");
                return;
            }
        }
    }
}

// Helpful message shown in the console when the page loads.
console.log("Escape the Evil AI is ready. Click 'Start / Restart Game' to begin.");
console.log("The game uses prompt(), alert(), confirm() and console output; it does not manipulate the DOM.");
