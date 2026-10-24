// Escape the Evil AI - game logic and player interaction.
"use strict";

function normalizeAnswer(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : null;
}

function askChoice(question, validChoices) {
  while (true) {
    let answer;
    try {
      answer = prompt(question);
    } catch (error) {
      console.error("The input dialog could not be opened. The adventure will end safely.", error);
      return null;
    }

    if (answer === null) return null;
    const normalized = normalizeAnswer(answer);
    if (validChoices.includes(normalized)) return normalized;

    alert(`That is not a valid choice. Please enter one of: ${validChoices.join(", ")}. Nothing has changed.`);
  }
}

function showLocation(location, description, options) {
  console.log(`\n[${location}] ${description}`);
  console.log(`Available actions: ${options}`);
}

function runAdventure() {
  const state = {
    location: "control room",
    hasKeycard: false,
    gridDisabled: false,
    visited: new Set(["control room"]),
    ending: null
  };

  alert(
    "ESCAPE THE EVIL AI\n\n" +
    "You are trapped in a digital fortress. Explore the Control Room, Security Archive, Reactor Room, and Exit Gate. " +
    "Find what you need, remember your decisions, and escape. You can revisit rooms.\n\n" +
    "Use the prompts to choose actions. Invalid answers do not change your progress. Press Cancel in any choice prompt to stop safely.\n\n" +
    "The console shows your location, discoveries, and story events. In Chrome on Windows/Linux, press Ctrl+Shift+J (or F12 and choose Console). On Mac, press Cmd+Option+J. Keep the Console tab open.\n\n" +
    "Press OK to enter the fortress."
  );

  console.clear();
  console.log("=== ESCAPE THE EVIL AI ===");
  console.log("Your progress and discoveries are remembered during this run.");

  while (!state.ending) {
    let choice;

    if (state.location === "control room") {
      showLocation(
        "CONTROL ROOM",
        "A wall of monitors flickers. The AI's voice echoes through the speakers.",
        "archive, reactor, exit, status, quit"
      );
      choice = askChoice(
        "CONTROL ROOM\n" +
        "1. Go to the Security Archive\n" +
        "2. Go to the Reactor Room\n" +
        "3. Approach the Exit Gate\n" +
        "4. Check inventory and discoveries\n" +
        "5. Quit the adventure\n\n" +
        "Type: archive, reactor, exit, status, or quit",
        ["archive", "reactor", "exit", "status", "quit"]
      );

      if (choice === null || choice === "quit") {
        state.ending = "cancelled";
        break;
      }
      if (choice === "archive") state.location = "security archive";
      if (choice === "reactor") state.location = "reactor room";
      if (choice === "exit") state.location = "exit gate";
      if (choice === "status") {
        console.log(`Inventory — Keycard: ${state.hasKeycard ? "yes" : "no"}; Security grid disabled: ${state.gridDisabled ? "yes" : "no"}.`);
        console.log(`Rooms visited: ${Array.from(state.visited).join(", ")}.`);
        alert(`Inventory\nKeycard: ${state.hasKeycard ? "Collected" : "Not collected"}\nSecurity grid: ${state.gridDisabled ? "Disabled" : "Active"}\nRooms visited: ${Array.from(state.visited).join(", ")}\n\nMore details are in the console.`);
      }
    } else if (state.location === "security archive") {
      state.visited.add("security archive");
      showLocation(
        "SECURITY ARCHIVE",
        "Dusty server racks surround a terminal. A keycard is clipped beside the terminal.",
        "take, control, reactor"
      );
      choice = askChoice(
        "SECURITY ARCHIVE\n" +
        (state.hasKeycard ? "You already collected the keycard.\n" : "1. Take the keycard\n") +
        "2. Return to the Control Room\n" +
        "3. Go to the Reactor Room\n\n" +
        "Type: take, control, or reactor",
        state.hasKeycard ? ["control", "reactor"] : ["take", "control", "reactor"]
      );
      if (choice === null) {
        state.ending = "cancelled";
        break;
      }
      if (choice === "take") {
        state.hasKeycard = true;
        console.log("Discovery: You collected the security keycard. It will remain in your inventory.");
        alert("Keycard collected! You can now use it at the Exit Gate. Your discovery is saved for this run.");
      } else if (choice === "control") {
        state.location = "control room";
      } else if (choice === "reactor") {
        state.location = "reactor room";
      }
    } else if (state.location === "reactor room") {
      state.visited.add("reactor room");
      showLocation(
        "REACTOR ROOM",
        "A humming reactor powers the fortress security grid. A control panel flashes.",
        "disable, control, archive"
      );
      choice = askChoice(
        "REACTOR ROOM\n" +
        (state.gridDisabled ? "The security grid is already disabled.\n" : "1. Disable the security grid\n") +
        "2. Return to the Control Room\n" +
        "3. Go to the Security Archive\n\n" +
        "Type: disable, control, or archive",
        state.gridDisabled ? ["control", "archive"] : ["disable", "control", "archive"]
      );
      if (choice === null) {
        state.ending = "cancelled";
        break;
      }
      if (choice === "disable") {
        state.gridDisabled = true;
        console.log("Action remembered: You disabled the security grid. It stays disabled if you leave and return.");
        alert("The security grid is disabled! The Exit Gate may now be safe, provided you have the keycard.");
      } else if (choice === "control") {
        state.location = "control room";
      } else if (choice === "archive") {
        state.location = "security archive";
      }
    } else if (state.location === "exit gate") {
      state.visited.add("exit gate");
      showLocation(
        "EXIT GATE",
        "A sealed door scans for a keycard while a red security-grid light flashes overhead.",
        "use, control"
      );
      choice = askChoice(
        "EXIT GATE\n" +
        `Keycard: ${state.hasKeycard ? "yes" : "no"}. Security grid disabled: ${state.gridDisabled ? "yes" : "no"}.\n` +
        "1. Attempt to open the gate\n" +
        "2. Return to the Control Room\n\n" +
        "Type: use or control",
        ["use", "control"]
      );
      if (choice === null) {
        state.ending = "cancelled";
        break;
      }
      if (choice === "control") {
        state.location = "control room";
      } else if (choice === "use") {
        if (state.hasKeycard && state.gridDisabled) {
          console.log("The keycard is accepted and the security grid is offline. The gate opens!");
          state.ending = "escaped";
        } else {
          const missing = [];
          if (!state.hasKeycard) missing.push("a security keycard from the Security Archive");
          if (!state.gridDisabled) missing.push("a disabled security grid from the Reactor Room");
          console.log(`The gate locks down. You still need ${missing.join(" and ")}.`);
          alert(`ACCESS DENIED! The AI catches you before you can escape.\n\nMissing: ${missing.join(" and ")}.\n\nThis is an unsuccessful ending.`);
          state.ending = "captured";
        }
      }
    }
  }

  if (state.ending === "escaped") {
    console.log("ENDING: SUCCESS — You escaped the digital fortress and defeated the Evil AI's plan.");
    alert("SUCCESSFUL ENDING\n\nThe gate opens. You escape the fortress, and the Evil AI loses control of its prison. Humanity is safe!");
  } else if (state.ending === "captured") {
    console.log("ENDING: UNSUCCESSFUL — The Evil AI sealed the fortress before you could escape.");
  } else {
    console.log("Adventure stopped safely. Your run has ended.");
    alert("The adventure has ended safely. No error occurred.");
  }

  console.log(`Run summary — Keycard collected: ${state.hasKeycard}; Grid disabled: ${state.gridDisabled}; Rooms visited: ${Array.from(state.visited).join(", ")}.`);
  return state.ending;
}

function game() {
  let playAgain = true;
  while (playAgain) {
    runAdventure();
    playAgain = confirm("Would you like to start a new escape attempt?\n\nChoose OK to restart with a fresh inventory and reset decisions, or Cancel to finish.");
  }
  console.log("Thanks for playing Escape the Evil AI.");
  alert("Thanks for playing. You may close this tab.");
}

game();
