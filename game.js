const statLabels = {
  focus: "Focus",
  crewTrust: "Crew Trust",
  charge: "Charge"
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function addUnique(list, value) {
  if (!list.includes(value)) {
    list.push(value);
  }
}

function adjustStat(state, stat, amount) {
  state.stats[stat] = clamp(state.stats[stat] + amount, 0, 10);
}

function addItem(state, item) {
  addUnique(state.inventory, item);
}

function addHighlight(state, highlight) {
  addUnique(state.highlights, highlight);
}

function logEvent(state, entry) {
  state.log.push(entry);
}

function setPath(state, label) {
  state.pathLabel = label;
}

const initialState = () => ({
  phase: "welcome",
  sceneId: "dock",
  chapter: "Welcome",
  progress: 0,
  currentObjective: "Review the mission guide and launch when you're ready.",
  currentHint: "Start with the welcome panel, then follow the live objective once the blackout begins.",
  impactNote: "Choose whether you want to lead with gear, clues, or your crew.",
  pathLabel: "Undecided",
  inventory: ["Cadet wristband"],
  stats: {
    focus: 7,
    crewTrust: 5,
    charge: 6
  },
  flags: {
    hasToolkit: false,
    hasTrace: false,
    ayaFreed: false,
    jaeAligned: false,
    studentsSafe: false,
    powerRerouted: false,
    guidanceShared: false,
    sponsorProof: false,
    mentorAligned: false,
    truthDecoded: false,
    beaconReady: false,
    droneReady: false
  },
  endingLabel: "Undecided",
  endingSceneId: null,
  highlights: ["You answered the blackout alert."],
  log: ["Orientation loaded. The station is waiting on your call."]
});

const scenes = {
  dock: {
    chapter: "Act 1: Lights Out",
    progress: 8,
    title: "Dock Ring 3",
    subtitle: "The showcase goes dark before the opening countdown finishes.",
    statusLabel: "Launch Window",
    objective: "Get a clean read on the outage and keep the nearby students moving.",
    hint: "Gear helps in the power wing, but early clues can unlock safer routes later.",
    text:
      "Music cuts mid-beat. Showcase drones tumble from the ceiling. Emergency strips blink red across Dock Ring 3 while the academy crowd stares at the dead stars outside the glass. Your wristband throws up a warning: network jam detected, tower access unstable, crew location unknown.",
    choices: [
      {
        label: "Raid the gear locker",
        summary: "Grab tools and a spare cell before the station fully locks down.",
        action(state) {
          state.flags.hasToolkit = true;
          addItem(state, "Repair toolkit");
          addItem(state, "Spare power cell");
          adjustStat(state, "charge", 1);
          setPath(state, "Hands-On");
          addHighlight(state, "You geared up before charging into the blackout.");
          logEvent(state, "You break open the gear locker and pocket emergency tools.");
          return {
            nextScene: "lockers",
            feedback: "Toolkit secured. You're better prepared for risky repairs."
          };
        }
      },
      {
        label: "Patch into the dock console",
        summary: "Pull a system trace before the signal disappears.",
        action(state) {
          state.flags.hasTrace = true;
          addItem(state, "Trace shard");
          adjustStat(state, "focus", 1);
          setPath(state, "Signal Sleuth");
          addHighlight(state, "You grabbed hard evidence instead of guessing.");
          logEvent(state, "You capture a trace shard from the crashing academy console.");
          return {
            nextScene: "console",
            feedback: "You caught the signal pattern before the console wiped it."
          };
        }
      },
      {
        label: "Check on the lounge crew",
        summary: "Go where the panicked voices are rising behind the shutter.",
        action(state) {
          adjustStat(state, "crewTrust", 1);
          setPath(state, "Crew First");
          logEvent(state, "You sprint toward the lounge instead of chasing the glitch alone.");
          return {
            nextScene: "lounge",
            feedback: "Your crew sees you choosing people first."
          };
        }
      }
    ]
  },
  lockers: {
    chapter: "Act 1: Lights Out",
    progress: 15,
    title: "Emergency Lockers",
    subtitle: "Metal shutters rattle while you scoop up whatever still works.",
    statusLabel: "Gear Secured",
    objective: "Use your new kit to support the crew or push the investigation forward.",
    hint: "If you help people while carrying gear, trust rises quickly and safer routes open up.",
    text:
      "The locker bank jolts open on backup power. Inside: a compact repair toolkit, a glow band, and a half-charged power cell with academy tape still wrapped around it. Somewhere above you, the tower feed crackles with a voice that cuts out before it can name the problem.",
    choices: [
      {
        label: "Run to the lounge with supplies",
        summary: "Bring real help to whoever got trapped when the shutters fell.",
        action(state) {
          addItem(state, "Glow band");
          adjustStat(state, "crewTrust", 1);
          logEvent(state, "You head for the lounge with fresh supplies in hand.");
          return {
            nextScene: "lounge",
            feedback: "Supply run complete. You're walking in with something useful."
          };
        }
      },
      {
        label: "Scan the power map on the wall",
        summary: "Use the maintenance display to find the breaker weak point.",
        action(state) {
          adjustStat(state, "focus", 1);
          logEvent(state, "You trace the maintenance map to the academy power wing.");
          return {
            nextScene: "powerHall",
            feedback: "You marked the fastest route to the breaker corridor."
          };
        }
      },
      {
        label: "Listen to the dock console feed first",
        summary: "Grab the signal lead before the auto-delete triggers again.",
        action(state) {
          logEvent(state, "You double back to the dock console to hear the missing alert.");
          return {
            nextScene: "console",
            feedback: "You decide information matters as much as gear."
          };
        }
      }
    ]
  },
  console: {
    chapter: "Act 1: Lights Out",
    progress: 18,
    title: "Dock Console",
    subtitle: "The academy board keeps deleting the same warning on loop.",
    statusLabel: "Strange Signal",
    objective: "Follow the jam source before it buries the tower feed for good.",
    hint: "The deleted alert suggests this outage was triggered, not random.",
    text:
      "The dock console keeps rebuilding a report just long enough for you to read the first lines: sponsor demo active, tower override unstable, route anomaly detected in the power wing. A waveform spikes across the screen, then a cleanup script tries to erase it again.",
    choices: [
      {
        label: "Copy the trace and move for the power wing",
        summary: "Take the strongest lead straight to the breaker corridor.",
        action(state) {
          state.flags.hasTrace = true;
          addItem(state, "Trace shard");
          adjustStat(state, "focus", 1);
          addHighlight(state, "You captured proof that the blackout was staged.");
          logEvent(state, "You save the trace and head for the power wing.");
          return {
            nextScene: "powerHall",
            feedback: "Trace saved. You now know the jam is tied to the power wing."
          };
        }
      },
      {
        label: "Broadcast a calm message to nearby students",
        summary: "Use the last clean channel to cut the panic level.",
        action(state) {
          state.flags.guidanceShared = true;
          adjustStat(state, "crewTrust", 1);
          addHighlight(state, "You used the station feed to steady the crowd.");
          logEvent(state, "You send a short calm message across the nearest station channels.");
          return {
            nextScene: "lounge",
            feedback: "Guidance shared. People are listening instead of freezing."
          };
        }
      },
      {
        label: "Gear up before chasing the signal",
        summary: "Grab hardware first so the next stop is less of a gamble.",
        action(state) {
          logEvent(state, "You leave the console and cut toward the emergency lockers.");
          return {
            nextScene: "lockers",
            feedback: "You choose prep over speed."
          };
        }
      }
    ]
  },
  lounge: {
    chapter: "Act 1: Lights Out",
    progress: 24,
    title: "Student Lounge",
    subtitle: "Your crew is pinned between a jammed shutter and a broken light strip.",
    statusLabel: "Crew Under Pressure",
    objective: "Stabilize the crew and decide who should help you take point.",
    hint: "Aya opens faster route options. Jae improves your decode path. Saving students boosts trust.",
    text:
      "The lounge looks like a half-finished celebration that got frozen in place. Aya is stuck under a buckled shutter, Jae is fighting a dead tablet with one hand, and a cluster of first-years is trying very hard not to panic. Everyone talks at once when they see you.",
    choices: [
      {
        label: "Free Aya from the shutter",
        summary: "Get the best pilot on the station back on her feet.",
        action(state) {
          state.flags.ayaFreed = true;
          if (state.flags.hasToolkit) {
            adjustStat(state, "crewTrust", 2);
            addHighlight(state, "You used your gear to pull Aya back into the mission.");
            logEvent(state, "You lever the shutter up with the repair toolkit and free Aya.");
            return {
              nextScene: "ayaBrief",
              feedback: "Aya is back in play, and the crew saw you handle it cleanly."
            };
          }

          adjustStat(state, "crewTrust", 1);
          adjustStat(state, "charge", -1);
          adjustStat(state, "focus", -1);
          logEvent(state, "You free Aya the hard way, burning charge and focus in the process.");
          return {
            nextScene: "ayaBrief",
            feedback: "You got Aya loose, but the rushed rescue cost you energy."
          };
        }
      },
      {
        label: "Hand Jae the trace and start a decode",
        summary: "Turn the chaos into information while the lounge holds together.",
        action(state) {
          state.flags.jaeAligned = true;
          adjustStat(state, "focus", 1);
          adjustStat(state, "crewTrust", 1);
          addHighlight(state, "You brought Jae into the investigation early.");
          logEvent(state, "You and Jae compare notes while the lounge lights strobe overhead.");
          return {
            nextScene: "crewBrief",
            feedback: "Jae is synced with you now, and the crew has a clearer plan."
          };
        }
      },
      {
        label: "Escort the first-years to the greenhouse safe zone",
        summary: "Move the youngest students someplace bright and calm.",
        action(state) {
          state.flags.studentsSafe = true;
          adjustStat(state, "crewTrust", 1);
          addHighlight(state, "You made time to protect the younger students.");
          logEvent(state, "You guide the first-years toward the greenhouse shelter route.");
          return {
            nextScene: "greenhouse",
            feedback: "The safe zone detour builds trust and buys you breathing room."
          };
        }
      }
    ]
  },
  ayaBrief: {
    chapter: "Act 1: Lights Out",
    progress: 31,
    title: "Aya's Brief",
    subtitle: "The second she can stand, she starts sketching routes in the air.",
    statusLabel: "Pilot Online",
    objective: "Choose where Aya's momentum helps most: power recovery or a stealth route.",
    hint: "Aya's drone tag makes later tower routes cleaner and boosts crew synergy.",
    text:
      "Aya flexes her sore hands once, flashes you a quick grin, and tosses you her drone tag. 'Power wing is the choke point,' she says, 'but if you need eyes in the vents later, I can still fly blind.' Jae nods from the lounge, already rebuilding a map from scraps of signal data.",
    choices: [
      {
        label: "Hit the power wing together",
        summary: "Use Aya's speed and your decisions to get the grid back first.",
        action(state) {
          addItem(state, "Drone tag");
          adjustStat(state, "crewTrust", 1);
          logEvent(state, "Aya falls into step beside you as you head for the power wing.");
          return {
            nextScene: "powerHall",
            feedback: "Aya joins the run and puts the team on a stronger footing."
          };
        }
      },
      {
        label: "Send Aya to prep the comm lab route",
        summary: "Split the workload so the decode path opens faster later.",
        action(state) {
          addItem(state, "Drone tag");
          state.flags.droneReady = true;
          adjustStat(state, "crewTrust", 1);
          logEvent(state, "Aya ghosts ahead to prep the comm lab route while you reroute yourself.");
          return {
            nextScene: "greenhouse",
            feedback: "Aya is scouting ahead, which makes later comm routes safer."
          };
        }
      }
    ]
  },
  crewBrief: {
    chapter: "Act 1: Lights Out",
    progress: 33,
    title: "Crew Brief",
    subtitle: "Jae turns panic into a map before the emergency lights finish cycling.",
    statusLabel: "Decode Started",
    objective: "Choose whether to stabilize the school, shelter students, or chase the archive lead.",
    hint: "The archive can reveal the truth early, but power and crew support make the finale stronger.",
    text:
      "Jae wipes a neon thumbprint across the dead tablet and drags the trace into focus. The jam pings in three places: the power wing, the greenhouse relay, and a sealed archive corridor that should never be live during a student showcase. 'Someone wrote this chaos into the schedule,' Jae mutters.",
    choices: [
      {
        label: "Meet Jae in the power wing",
        summary: "Stabilize the grid before the tower route collapses.",
        action(state) {
          adjustStat(state, "focus", 1);
          logEvent(state, "You pull Jae into the plan and head for the power wing.");
          return {
            nextScene: "powerHall",
            feedback: "You choose the practical fix before the big reveal."
          };
        }
      },
      {
        label: "Escort students toward the greenhouse route",
        summary: "Regroup in the brightest safe zone on the station.",
        action(state) {
          state.flags.studentsSafe = true;
          adjustStat(state, "crewTrust", 1);
          logEvent(state, "You redirect the students to the greenhouse shelter route.");
          return {
            nextScene: "greenhouse",
            feedback: "The station feels steadier when people know where to go."
          };
        }
      },
      {
        label: "Check the sealed archive corridor",
        summary: "Go straight at the hidden file before anyone can scrub it.",
        action(state) {
          adjustStat(state, "focus", 1);
          setPath(state, "Truth Runner");
          logEvent(state, "You cut for the archive corridor while Jae keeps the lounge stable.");
          return {
            nextScene: "archive",
            feedback: "You go straight for the secret instead of waiting for permission."
          };
        }
      }
    ]
  },
  greenhouse: {
    chapter: "Act 2: Regroup",
    progress: 42,
    title: "Solar Greenhouse",
    subtitle: "Sunlamps flicker over vines, cots, and a room trying hard to stay calm.",
    statusLabel: "Safe Zone",
    objective: "Use the greenhouse stop to recharge, regroup, or chase the next live lead.",
    hint: "This is your best place to recover charge and build trust before the final act.",
    text:
      "The greenhouse smells like warm metal and damp leaves. A few students settle onto emergency cots while the solar glass overhead keeps a thin line of light alive. Someone has rigged a bench charger to the backup lamps, and the academy rumor stream is already blaming everything from smugglers to ghosts.",
    choices: [
      {
        label: "Recharge at the solar bench",
        summary: "Recover battery power before the station demands more of it.",
        action(state) {
          adjustStat(state, "charge", 2);
          addHighlight(state, "You took time to refill before the hard push.");
          logEvent(state, "You jack your gear into the greenhouse solar bench and top off.");
          return {
            nextScene: "batteryRack",
            feedback: "Charge restored. You can afford a few sharper moves now."
          };
        }
      },
      {
        label: "Record reassurance clips for the school feed",
        summary: "Turn the greenhouse into a calm point for the whole station.",
        action(state) {
          state.flags.guidanceShared = true;
          adjustStat(state, "crewTrust", 2);
          addHighlight(state, "You became the voice students followed through the blackout.");
          logEvent(state, "You record a calm update and send it through the local school feed.");
          return {
            nextScene: "commLab",
            feedback: "The academy starts sounding less afraid and more ready."
          };
        }
      },
      {
        label: "Follow the maintenance tunnel to the archive",
        summary: "Use the shelter route to reach the sealed files unseen.",
        action(state) {
          adjustStat(state, "focus", 1);
          logEvent(state, "You slip through the greenhouse tunnel toward the archive corridor.");
          return {
            nextScene: "archive",
            feedback: "You trade comfort for a clean shot at the hidden files."
          };
        }
      }
    ]
  },
  powerHall: {
    chapter: "Act 2: Regroup",
    progress: 49,
    title: "Power Wing",
    subtitle: "Breaker walls pulse like a heartbeat that keeps skipping.",
    statusLabel: "Power Gamble",
    objective: "Choose whether to fully stabilize the grid or sprint forward with whatever power you have.",
    hint: "Restored power makes the tower route safer. Extra charge helps if you plan to improvise.",
    text:
      "The academy power wing hums in uneven bursts. Breakers flare, die, then flare again. A sponsor demo module sits half-hidden behind one panel with fresh security tape across it, like someone expected this whole setup to stay secret until after the applause.",
    choices: [
      {
        label: "Reroute the breakers properly",
        summary: "Risk time now to make the rest of the station safer.",
        action(state) {
          if (state.flags.hasToolkit || state.stats.focus >= 8) {
            state.flags.powerRerouted = true;
            adjustStat(state, "focus", 1);
            adjustStat(state, "charge", 1);
            addHighlight(state, "You stabilized the academy grid under pressure.");
            logEvent(state, "You patch the breaker fault and bring clean power back online.");
            return {
              nextScene: "powerUp",
              feedback: "Grid restored. The station feels like it can breathe again."
            };
          }

          adjustStat(state, "focus", -1);
          adjustStat(state, "charge", -1);
          logEvent(state, "The reroute misfires, but you spot the exact weak point in the system.");
          return {
            nextScene: "flicker",
            feedback: "The first repair goes rough, but you learn what the system needs."
          };
        }
      },
      {
        label: "Pop open the battery rack",
        summary: "Take raw charge now and decide on the big fix afterward.",
        action(state) {
          logEvent(state, "You pry open the battery rack and chase portable power instead.");
          return {
            nextScene: "batteryRack",
            feedback: "Portable charge could keep your options open in the final act."
          };
        }
      },
      {
        label: "Skip repairs and race for the comm lab",
        summary: "Trust your crew to handle the rest while you chase the signal.",
        action(state) {
          adjustStat(state, "charge", -1);
          logEvent(state, "You leave the breakers unstable and head for the comm lab anyway.");
          return {
            nextScene: "commLab",
            feedback: "You gain speed, but the station stays fragile behind you."
          };
        }
      }
    ]
  },
  batteryRack: {
    chapter: "Act 2: Regroup",
    progress: 56,
    title: "Battery Rack",
    subtitle: "A row of backup cells still glows under a layer of dust.",
    statusLabel: "Charge Buffer",
    objective: "Spend the fresh power where it will create the biggest advantage.",
    hint: "Charge can cover risky routes, but it does not replace crew support or hard proof.",
    text:
      "Backup cells click in their slots like they are waiting for someone decisive to claim them. The power wing map shows two clean options from here: inject that energy into the station grid or carry it with you to the comm lab and hope speed beats stability.",
    choices: [
      {
        label: "Snap in a fresh cell pack",
        summary: "Bank more charge before the next dangerous corridor.",
        action(state) {
          adjustStat(state, "charge", 2);
          addItem(state, "Fresh cell pack");
          logEvent(state, "You lock a fresh cell pack into your kit.");
          return {
            nextScene: "powerUp",
            feedback: "Charge topped off. You're ready for sharper, riskier choices."
          };
        }
      },
      {
        label: "Feed the spare cells into the grid",
        summary: "Convert portable power into a station-wide advantage.",
        action(state) {
          state.flags.powerRerouted = true;
          adjustStat(state, "crewTrust", 1);
          addHighlight(state, "You turned emergency charge into a station-wide save.");
          logEvent(state, "You dump the spare cells into the breakers and steady the grid.");
          return {
            nextScene: "powerUp",
            feedback: "Grid boosted. Everyone on the station benefits from this call."
          };
        }
      },
      {
        label: "Carry the charge straight to the comm lab",
        summary: "Take the portable edge and keep moving.",
        action(state) {
          adjustStat(state, "charge", 1);
          logEvent(state, "You pocket the charge and cut straight for the comm lab.");
          return {
            nextScene: "commLab",
            feedback: "You keep momentum on your side."
          };
        }
      }
    ]
  },
  flicker: {
    chapter: "Act 2: Regroup",
    progress: 58,
    title: "Breaker Flicker",
    subtitle: "The panel spits sparks, but now you know exactly where the fault lives.",
    statusLabel: "Messy Fix",
    objective: "Recover from the failed patch and choose the safer recovery route.",
    hint: "More charge or more crew support can still stabilize your run.",
    text:
      "The breaker panel snaps shut with a hiss of blue sparks and a burst of static that rattles your teeth. It is not a full loss, though. You saw the sponsor module handshake the instant before the surge, and that means the blackout still has a clean source you can beat.",
    choices: [
      {
        label: "Grab spare cells and try again",
        summary: "Recover power first, then come back smarter.",
        action(state) {
          logEvent(state, "You back off, grab your breath, and head for the battery rack.");
          return {
            nextScene: "batteryRack",
            feedback: "A reset can still turn this back into a winning route."
          };
        }
      },
      {
        label: "Call Aya and push to the comm lab",
        summary: "Lean on your crew instead of forcing the hardware twice.",
        action(state) {
          if (state.flags.ayaFreed) {
            adjustStat(state, "crewTrust", 1);
          }
          logEvent(state, "You leave the breaker corridor and regroup with your crew at the comm lab.");
          return {
            nextScene: "commLab",
            feedback: "Crew support keeps the run alive even when the repair does not."
          };
        }
      }
    ]
  },
  powerUp: {
    chapter: "Act 2: Regroup",
    progress: 63,
    title: "Power Restored",
    subtitle: "The academy lights come back one corridor at a time.",
    statusLabel: "Grid Restored",
    objective: "Use the restored power to decode the jammer and decide what to do with the truth.",
    hint: "This is the cleanest route to the best endings. Keep collecting proof while morale is high.",
    text:
      "Panels blink from emergency red to soft academy white. Somewhere down the corridor, students cheer. Your wristband immediately picks up a cleaner signal from the comm lab, plus a reopened route to the archive corridor that had been sealed behind dead magnetic locks.",
    choices: [
      {
        label: "Meet Jae in the comm lab",
        summary: "Use the fresh power to finish decoding the jam.",
        action(state) {
          logEvent(state, "You follow the returning lights to the comm lab.");
          return {
            nextScene: "commLab",
            feedback: "Restored power gives your crew a real shot at cracking the jammer."
          };
        }
      },
      {
        label: "Follow the reopened route to the archive",
        summary: "Use the unlocked corridor to hunt for proof before it vanishes.",
        action(state) {
          logEvent(state, "You take the newly powered archive route before anyone can scrub it.");
          return {
            nextScene: "archive",
            feedback: "You push for the truth while the station is finally stable enough to breathe."
          };
        }
      }
    ]
  },
  commLab: {
    chapter: "Act 2: Regroup",
    progress: 72,
    title: "Comm Lab",
    subtitle: "Jae has the waveform on-screen and a theory half-finished.",
    statusLabel: "Signal Lock",
    objective: "Choose how your crew uses the academy feed before the tower resets.",
    hint: "Guidance boosts trust, deep decoding boosts truth, and Aya's drone route speeds the finale.",
    text:
      "The comm lab is alive with blue monitor glow and too many half-saved files. Jae looks up the second you arrive. 'Good news,' they say, 'the jam is traceable. Bad news? It was piggybacking on the sponsor demo hardware.' Aya's drone tag blinks on your wrist if you grabbed it, ready to route a scout path through the tower vents.",
    choices: [
      {
        label: "Boost Jae's decode with your trace data",
        summary: "Push for a clean answer about who built this outage.",
        action(state) {
          if (state.flags.hasTrace || state.stats.focus >= 8) {
            state.flags.truthDecoded = true;
            adjustStat(state, "focus", 1);
            addHighlight(state, "You and Jae fully decoded the sabotage pattern.");
            logEvent(state, "You help Jae complete the decode and confirm the blackout was scripted.");
            return {
              nextScene: "archive",
              feedback: "Decode complete. The truth route is wide open now."
            };
          }

          adjustStat(state, "focus", -1);
          logEvent(state, "The decode gets messy, but it still points you toward the archive.");
          return {
            nextScene: "archive",
            feedback: "You do not get the cleanest decode, but you still learn where to dig next."
          };
        }
      },
      {
        label: "Ask Aya to ghost a drone through the tower vents",
        summary: "Prep a stealth route before the final sprint.",
        action(state) {
          if (state.flags.ayaFreed) {
            state.flags.droneReady = true;
            addItem(state, "Drone relay");
            adjustStat(state, "crewTrust", 1);
            addHighlight(state, "Aya secured a clean drone route toward the tower.");
          }
          logEvent(state, "Aya sends a drone ahead to mark a route through the tower vents.");
          return {
            nextScene: "mentorLink",
            feedback: "Tower route prepped. The finale just got a lot cleaner."
          };
        }
      },
      {
        label: "Send a calm all-student guidance ping",
        summary: "Turn the school feed into something students can actually trust.",
        action(state) {
          state.flags.guidanceShared = true;
          adjustStat(state, "crewTrust", 2);
          addHighlight(state, "You became the calm voice behind the academy response.");
          logEvent(state, "You and Jae send a clear guidance ping to every student still online.");
          return {
            nextScene: "mentorLink",
            feedback: "Guidance delivered. Crew trust and station morale both rise."
          };
        }
      }
    ]
  },
  archive: {
    chapter: "Act 2: Regroup",
    progress: 81,
    title: "Archive Corridor",
    subtitle: "The deleted file names a sponsor demo, a fake outage script, and a tower override.",
    statusLabel: "Buried Truth",
    objective: "Decide whether to carry proof into the finale or focus only on rescue.",
    hint: "Proof unlocks the expose ending. You can still save everyone if you move fast.",
    text:
      "The archive door sighs open on delayed power. Inside, one file glows brighter than the rest: showcase stress-test reel. It lays out a sponsored blackout demo meant to create drama for the live broadcast, complete with a tower override that should have been disabled the moment students boarded the station.",
    choices: [
      {
        label: "Copy the proof chip",
        summary: "Take the evidence before someone scrubs the file forever.",
        action(state) {
          state.flags.sponsorProof = true;
          addItem(state, "Proof chip");
          adjustStat(state, "focus", 1);
          addHighlight(state, "You secured proof of the sponsor's staged blackout.");
          setPath(state, "Truth Runner");
          logEvent(state, "You copy the file onto a proof chip and lock it to your wristband.");
          return {
            nextScene: "mentorLink",
            feedback: "Proof secured. You can expose the whole setup if you choose."
          };
        }
      },
      {
        label: "Call Mentor Sol before you touch anything",
        summary: "Find out whether an adult on the station will back the truth.",
        action(state) {
          if (state.stats.crewTrust >= 6) {
            state.flags.mentorAligned = true;
            adjustStat(state, "crewTrust", 1);
            addHighlight(state, "Mentor Sol trusted your read on the situation.");
            logEvent(state, "Mentor Sol answers and tells you to keep moving.");
          } else {
            adjustStat(state, "focus", -1);
            logEvent(state, "The call with Mentor Sol is too static-filled to help much.");
          }
          return {
            nextScene: "mentorLink",
            feedback: "You reach out before deciding how far the truth should travel."
          };
        }
      },
      {
        label: "Ignore the file and sprint for the tower",
        summary: "Forget the politics and finish the rescue.",
        action(state) {
          setPath(state, "Rescue Route");
          logEvent(state, "You leave the archive untouched and run for the tower.");
          return {
            nextScene: "signalTower",
            feedback: "You stay locked on rescue instead of the receipts."
          };
        }
      }
    ]
  },
  mentorLink: {
    chapter: "Act 3: Final Signal",
    progress: 90,
    title: "Mentor Link",
    subtitle: "Mentor Sol answers from a dead terminal wrapped in static.",
    statusLabel: "Decision Point",
    objective: "Choose who you trust before the tower locks for good.",
    hint: "If you have both power and trust, you can save the showcase cleanly. Proof opens the public truth route.",
    text:
      "The mentor link crackles alive with Sol's tired face. Behind them, staff are trying to guide students toward docking shuttles without starting a wave of panic. Sol hears your report, glances once at the station feed, and says the words every student wants and hates at the same time: 'You have to decide what signal this school hears next.'",
    choices: [
      {
        label: "Share the proof with Sol and the crew",
        summary: "Make sure the truth is not resting on your shoulders alone.",
        action(state) {
          if (state.flags.sponsorProof) {
            state.flags.mentorAligned = true;
            adjustStat(state, "crewTrust", 1);
            addHighlight(state, "You made the truth a team decision instead of a solo burden.");
            logEvent(state, "You send the proof chip to Sol, Aya, and Jae before the final sprint.");
          } else {
            adjustStat(state, "focus", -1);
            logEvent(state, "You try to share what you know, but without the file it stays half-formed.");
          }
          return {
            nextScene: "signalTower",
            feedback: "The tower run becomes a shared decision, not just your secret."
          };
        }
      },
      {
        label: "Tell Sol to focus on evacuations while you handle the tower",
        summary: "Split rescue and truth into two different missions.",
        action(state) {
          state.flags.beaconReady = true;
          adjustStat(state, "crewTrust", 1);
          addHighlight(state, "You coordinated rescue support before the final move.");
          logEvent(state, "You put Sol on evacuation control and take the tower yourself.");
          return {
            nextScene: "signalTower",
            feedback: "Evacuation backup is ready if the tower play gets rough."
          };
        }
      },
      {
        label: "Keep the file to yourself and move",
        summary: "Stay fast, stay focused, and decide everything at the antenna glass.",
        action(state) {
          adjustStat(state, "focus", 1);
          setPath(state, "Lone Signal");
          logEvent(state, "You keep your thoughts close and move for the tower.");
          return {
            nextScene: "signalTower",
            feedback: "You stay decisive, but the final call will rest almost entirely on you."
          };
        }
      }
    ]
  },
  signalTower: {
    chapter: "Act 3: Final Signal",
    progress: 97,
    title: "Signal Tower",
    subtitle: "The whole academy skyline blinks behind the antenna glass.",
    statusLabel: "Final Broadcast",
    objective: "Choose the signal you want the school to hear when the blackout story ends.",
    hint: "United rescue needs trust and power. Truth Burst needs proof. Quiet rescue is always available.",
    text:
      "The tower room hums with enough live current to make the air buzz. Aya's drone route flickers across your wrist if she is in play, Jae's decode scrolls at the edge of the screen, and the academy feed waits for a single command. Behind you is the kind of night students talk about for years. Ahead of you is the version of it that becomes real.",
    choices: [
      {
        label: "Lead a full-crew sync and restore the showcase feed",
        summary: "Turn the blackout into a comeback your whole crew owns.",
        showIf: (state) => state.flags.powerRerouted && state.stats.crewTrust >= 7,
        action(state) {
          state.endingLabel = "United Signal";
          setPath(state, "United Signal");
          logEvent(state, "You pull Aya, Jae, and the station feed into one shared sync.");
          return {
            nextScene: "endingUnited",
            feedback: "You choose the loud, hopeful ending and bring the whole crew with you."
          };
        }
      },
      {
        label: "Hijack the live feed with the sponsor proof",
        summary: "Rescue the station and make sure the truth lands too.",
        showIf: (state) => state.flags.sponsorProof,
        action(state) {
          state.endingLabel = "Truth Burst";
          setPath(state, "Truth Burst");
          logEvent(state, "You route the proof chip straight into the academy live feed.");
          return {
            nextScene: "endingTruth",
            feedback: "You decide the school deserves the truth in the same breath as the rescue."
          };
        }
      },
      {
        label: "Send a private rescue pulse and get everyone home",
        summary: "Keep the win quiet and make sure students get out safe.",
        action(state) {
          state.endingLabel = "Night Shift Rescue";
          setPath(state, "Night Shift Rescue");
          logEvent(state, "You choose the private rescue pulse over a public broadcast.");
          return {
            nextScene: "endingSafe",
            feedback: "You prioritize getting everyone home over making noise."
          };
        }
      }
    ]
  },
  endingUnited: {
    chapter: "Act 3: Final Signal",
    progress: 100,
    title: "Ending: United Signal",
    subtitle: "The showcase comes back brighter because your crew rebuilt it together.",
    statusLabel: "Signal Restored",
    objective: "Mission complete. Restart to explore another route.",
    hint: "A stronger proof route can change the public story. A quieter route changes the mood.",
    ending: true,
    summaryBadge: "Mission Complete",
    text:
      "Aya flies the tower relays, Jae seals the decode, and you anchor the feed just as the whole academy goes live again. What should have been a disaster turns into a story about students outsmarting the chaos written around them. The applause that finally lands is not for the sponsor demo. It is for your crew.",
    choices: []
  },
  endingTruth: {
    chapter: "Act 3: Final Signal",
    progress: 100,
    title: "Ending: Truth Burst",
    subtitle: "You save the station and force the adults in charge to answer for the blackout.",
    statusLabel: "Truth On Air",
    objective: "Mission complete. Restart to test a different ending path.",
    hint: "A higher-trust route can turn the final reveal into a team moment instead of a solo strike.",
    ending: true,
    summaryBadge: "Truth Sent",
    text:
      "The rescue pulse lands first. Then the proof rolls across every school display in one clean, undeniable burst. Students learn that the blackout was written into the showcase for drama, and the adults who signed off on it lose the power to hide behind polished speeches. By morning, the academy is still standing, but it is not pretending anymore.",
    choices: []
  },
  endingSafe: {
    chapter: "Act 3: Final Signal",
    progress: 100,
    title: "Ending: Night Shift Rescue",
    subtitle: "You keep the station calm, get students home, and leave the bigger fight for daylight.",
    statusLabel: "Rescue First",
    objective: "Mission complete. Restart to chase the louder endings.",
    hint: "Gathering more proof or crew trust can unlock higher-visibility finales next run.",
    ending: true,
    summaryBadge: "Students Safe",
    text:
      "You route the cleanest rescue pulse the tower can manage and keep the rest of the station quiet on purpose. Dock lights guide students home. The panic never gets its second wave. By the time dawn catches the glass, everyone who mattered made it through the night, and the truth is still waiting for a day when you choose to aim it higher.",
    choices: []
  }
};

const state = initialState();

const welcomePanel = document.getElementById("welcomePanel");
const gamePanel = document.getElementById("gamePanel");
const startButton = document.getElementById("startButton");
const guideToggleButton = document.getElementById("guideToggleButton");
const logButton = document.getElementById("logButton");
const storyPanel = document.getElementById("storyPanel");
const sceneTitle = document.getElementById("sceneTitle");
const sceneSubtitle = document.getElementById("sceneSubtitle");
const storyText = document.getElementById("storyText");
const choiceButtons = document.getElementById("choiceButtons");
const inventoryList = document.getElementById("inventoryList");
const statsPanel = document.getElementById("statsPanel");
const decisionLog = document.getElementById("decisionLog");
const restartButton = document.getElementById("restartButton");
const modalRestartButton = document.getElementById("modalRestartButton");
const sceneLabel = document.getElementById("sceneLabel");
const endingLabel = document.getElementById("endingLabel");
const chapterBadge = document.getElementById("chapterBadge");
const statusBadge = document.getElementById("statusBadge");
const missionProgressBar = document.getElementById("missionProgressBar");
const objectiveText = document.getElementById("objectiveText");
const hintText = document.getElementById("hintText");
const impactNote = document.getElementById("impactNote");
const phaseBadge = document.getElementById("phaseBadge");
const objectiveMini = document.getElementById("objectiveMini");
const crewPathLabel = document.getElementById("crewPathLabel");
const hintMini = document.getElementById("hintMini");
const signalState = document.getElementById("signalState");
const riskState = document.getElementById("riskState");
const supportState = document.getElementById("supportState");
const endingSummaryPanel = document.getElementById("endingSummaryPanel");
const endingSummaryTitle = document.getElementById("endingSummaryTitle");
const endingSummaryText = document.getElementById("endingSummaryText");
const endingSummaryBadge = document.getElementById("endingSummaryBadge");
const feedbackToastBody = document.getElementById("feedbackToastBody");
const endingModalElement = document.getElementById("endingModal");
const endingModalTitle = document.getElementById("endingModalTitle");
const endingModalText = document.getElementById("endingModalText");
const endingStatsSummary = document.getElementById("endingStatsSummary");
const endingHighlights = document.getElementById("endingHighlights");
const howToPlay = document.getElementById("howToPlay");
const logCanvas = document.getElementById("logCanvas");

const feedbackToast =
  typeof bootstrap !== "undefined"
    ? bootstrap.Toast.getOrCreateInstance(document.getElementById("feedbackToast"), {
        delay: 2600
      })
    : null;

const endingModal =
  typeof bootstrap !== "undefined"
    ? bootstrap.Modal.getOrCreateInstance(endingModalElement)
    : null;

function setScene(sceneId) {
  const scene = scenes[sceneId];
  state.sceneId = sceneId;
  state.chapter = scene.chapter;
  state.progress = scene.progress;
  state.currentObjective = scene.objective;
  state.currentHint = scene.hint;
}

function phaseLabel(phase) {
  if (phase === "playing") {
    return "Live Mission";
  }

  if (phase === "ending") {
    return "Complete";
  }

  return "Welcome";
}

function describeSignalState() {
  if (state.phase === "ending") {
    return "Broadcast";
  }

  if (state.flags.sponsorProof || state.flags.truthDecoded) {
    return "Locked";
  }

  if (state.flags.hasTrace) {
    return "Tracing";
  }

  if (state.flags.powerRerouted) {
    return "Stable";
  }

  return "Unstable";
}

function describeRiskState() {
  if (state.phase === "ending") {
    return "Closed";
  }

  const reserve = state.stats.focus + state.stats.charge;

  if (reserve >= 16) {
    return "Low";
  }

  if (reserve >= 12) {
    return "Medium";
  }

  return "High";
}

function describeSupportState() {
  if (state.phase === "ending" && state.stats.crewTrust >= 7) {
    return "United";
  }

  if (state.stats.crewTrust >= 7) {
    return "Strong";
  }

  if (state.stats.crewTrust >= 5) {
    return "Crewed";
  }

  return "Solo";
}

function flashScenePanel() {
  if (!storyPanel) {
    return;
  }

  storyPanel.classList.remove("scene-flash");
  void storyPanel.offsetWidth;
  storyPanel.classList.add("scene-flash");
}

function showToast(message) {
  if (!feedbackToast || !message) {
    return;
  }

  feedbackToastBody.textContent = message;
  feedbackToast.show();
}

function getEndingHighlights() {
  const highlights = [...state.highlights];

  if (state.flags.powerRerouted) {
    addUnique(highlights, "You restored stable power to the academy.");
  }

  if (state.flags.guidanceShared) {
    addUnique(highlights, "Students followed your calm guidance feed through the blackout.");
  }

  if (state.flags.sponsorProof) {
    addUnique(highlights, "You secured hard proof of the staged outage.");
  }

  if (state.flags.ayaFreed && state.flags.jaeAligned) {
    addUnique(highlights, "Aya and Jae both became active partners in the run.");
  }

  return highlights.slice(-4);
}

function renderChoices(scene) {
  choiceButtons.innerHTML = "";

  const availableChoices = scene.choices.filter((choice) => {
    if (!choice.showIf) {
      return true;
    }

    return choice.showIf(state);
  });

  if (availableChoices.length === 0) {
    const endNotice = document.createElement("div");
    endNotice.className = "alert alert-light text-dark mb-0";
    endNotice.textContent = "Mission complete. Restart to explore another route.";
    choiceButtons.appendChild(endNotice);
    return;
  }

  availableChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn choice-button";
    button.setAttribute("data-interact-hint", "Choose path");
    button.innerHTML = `
      <span class="choice-top">
        <span class="choice-title">${choice.label}</span>
        <span class="choice-cta">Tap to choose</span>
      </span>
      <span class="choice-summary">${choice.summary}</span>
    `;
    button.addEventListener("click", () => {
      const result = choice.action(state);
      state.impactNote = result.feedback || choice.summary;
      setScene(result.nextScene);
      const nextScene = scenes[state.sceneId];
      if (nextScene.ending) {
        state.phase = "ending";
        state.endingSceneId = state.sceneId;
      } else {
        state.phase = "playing";
      }
      render();
      flashScenePanel();
      showToast(state.impactNote);
      if (nextScene.ending && endingModal) {
        endingModal.show();
      }
    });
    choiceButtons.appendChild(button);
  });
}

function renderInventory() {
  inventoryList.innerHTML = "";

  if (state.inventory.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "list-group-item text-secondary";
    emptyItem.textContent = "No tools collected yet.";
    inventoryList.appendChild(emptyItem);
    return;
  }

  state.inventory.forEach((item) => {
    const row = document.createElement("li");
    row.className = "list-group-item px-0";
    row.innerHTML = `
      <div class="inventory-row">
        <span>${item}</span>
        <span class="badge rounded-pill text-bg-secondary">held</span>
      </div>
    `;
    inventoryList.appendChild(row);
  });
}

function renderStats() {
  statsPanel.innerHTML = "";

  Object.entries(state.stats).forEach(([key, value]) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <div class="stat-top">
        <span class="stat-label">${statLabels[key]}</span>
        <span class="stat-value">${value}</span>
      </div>
      <div class="progress" role="progressbar" aria-label="${statLabels[key]}" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${value}">
        <div class="progress-bar" style="width: ${value * 10}%"></div>
      </div>
    `;
    statsPanel.appendChild(card);
  });
}

function renderLog() {
  decisionLog.innerHTML = "";

  state.log.slice(-10).forEach((entry) => {
    const item = document.createElement("li");
    item.className = "mb-2";
    item.textContent = entry;
    decisionLog.appendChild(item);
  });
}

function renderEndingSummary(scene) {
  if (!scene.ending) {
    endingSummaryPanel.classList.add("d-none");
    return;
  }

  endingSummaryPanel.classList.remove("d-none");
  endingSummaryTitle.textContent = state.endingLabel;
  endingSummaryText.textContent = scene.text;
  endingSummaryBadge.textContent = scene.summaryBadge || "Mission Complete";

  endingModalTitle.textContent = state.endingLabel;
  endingModalText.textContent = scene.text;
  endingStatsSummary.innerHTML = "";
  endingHighlights.innerHTML = "";

  Object.entries(state.stats).forEach(([key, value]) => {
    const column = document.createElement("div");
    column.className = "col-4";
    column.innerHTML = `
      <div class="mini-panel h-100">
        <div class="mini-label">${statLabels[key]}</div>
        <div class="mini-value">${value}/10</div>
      </div>
    `;
    endingStatsSummary.appendChild(column);
  });

  getEndingHighlights().forEach((highlight) => {
    const item = document.createElement("li");
    item.textContent = highlight;
    endingHighlights.appendChild(item);
  });
}

function renderScene(scene) {
  sceneTitle.textContent = scene.title;
  sceneSubtitle.textContent = scene.subtitle;
  storyText.textContent = scene.text;
  sceneLabel.textContent = scene.title;
  endingLabel.textContent = state.endingLabel;
  chapterBadge.textContent = state.chapter;
  statusBadge.textContent = scene.statusLabel;
  objectiveText.textContent = state.currentObjective;
  hintText.textContent = state.currentHint;
  impactNote.textContent = state.impactNote;
  phaseBadge.textContent = phaseLabel(state.phase);
  objectiveMini.textContent = state.currentObjective;
  crewPathLabel.textContent = state.pathLabel;
  hintMini.textContent = state.currentHint;
  signalState.textContent = describeSignalState();
  riskState.textContent = describeRiskState();
  supportState.textContent = describeSupportState();
  missionProgressBar.style.width = `${state.progress}%`;
  missionProgressBar.setAttribute("aria-valuenow", String(state.progress));
  renderChoices(scene);
  renderEndingSummary(scene);
}

function renderWelcomeState() {
  welcomePanel.classList.remove("d-none");
  gamePanel.classList.add("d-none");
  guideToggleButton.disabled = false;
  logButton.disabled = true;
  phaseBadge.textContent = phaseLabel(state.phase);
  objectiveMini.textContent = "Start the mission";
  crewPathLabel.textContent = state.pathLabel;
  hintMini.textContent = state.currentHint;
  endingSummaryPanel.classList.add("d-none");
}

function renderGameState() {
  const scene = scenes[state.sceneId];
  welcomePanel.classList.add("d-none");
  gamePanel.classList.remove("d-none");
  guideToggleButton.disabled = true;
  logButton.disabled = false;
  renderScene(scene);
}

function render() {
  if (state.phase === "welcome") {
    renderWelcomeState();
  } else {
    renderGameState();
  }

  renderInventory();
  renderStats();
  renderLog();
}

function startMission() {
  const freshState = initialState();
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, freshState);
  state.phase = "playing";
  state.log = ["Blackout alert received. You take point in Dock Ring 3."];
  state.highlights = ["You answered the blackout alert."];
  state.impactNote = "Mission live. Balance the crew, the clues, and the clock.";
  setScene("dock");
  render();
  flashScenePanel();
  if (howToPlay && typeof bootstrap !== "undefined") {
    bootstrap.Collapse.getOrCreateInstance(howToPlay, { toggle: false }).hide();
  }
}

function restartMission() {
  const freshState = initialState();
  Object.keys(state).forEach((key) => {
    delete state[key];
  });
  Object.assign(state, freshState);
  render();
  if (endingModal) {
    endingModal.hide();
  }
  if (typeof bootstrap !== "undefined") {
    bootstrap.Offcanvas.getOrCreateInstance(logCanvas).hide();
  }
}

startButton.addEventListener("click", startMission);
restartButton.addEventListener("click", restartMission);
modalRestartButton.addEventListener("click", restartMission);

render();
