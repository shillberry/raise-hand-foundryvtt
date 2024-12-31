# Raise Your Hand
A simple module for "raising your hand" in FoundryVTT

A button in the scene controls toggles a marker in the player list.

## How it works
This module responds to two hook events:

* **updateUser:** The module stores hand state in the user data, which gets us server authority and notification for "free". From this hook, we force the player list to redraw. This is not ideal, because many actions can cause a user update, but redrawing the panel should not cost a lot.
* **renderPlayerList:** The module prepends a marker (✋) to each player name, according to the flag status.

```mermaid
---
title: Module Flow
---
flowchart LR
    start@{shape: start}
    stop@{shape: stop}
    updateUser@{shape: event}
    renderPlayerList@{shape: event}

    control
    view
    model
    UserData

    start -- Click --> control
    control -- Request --> model
    model -- setFlag --> UserData

    %% UserData -- fire --> updateUser

    updateUser -- on --> module
    module -- render --> ui.players

    %% ui.players -- fire --> renderPlayerList

    renderPlayerList -- on --> view
    view -- isHandRaised? --> model
    model -- getFlag --> UserData

    view -- add ✋ --> stop
```

```mermaid
sequenceDiagram
    actor player
    box Raise Your Hand
        participant control
        participant view
        participant model
        participant module
    end

    player->>control: Click
    activate control
        control-)control: Toggle
        control-)model: HandleRequest(userId)
    deactivate control

    model-)user: setFlag("handRaised", [true|false])

    hookEvents-)+module: updateUser
    module-)-ui: render player list

    hookEvents-)+module: renderPlayerList
    module-)-view: RedrawPlayerList
    activate view
        loop Each player
            view->>model: Is hand raised?
            model->>user: getFlag("handRaised")
            user-->>model: 
            model-->>view: 
            view->>view: Add ✋
        end
    deactivate view
```

## Limitations
* The scene control button only appears for non-GM users.
* The scene control button is not automatically sync'd to the hand state in the user data.
* The hand state in the user data is not reset when a user disconnects. It is reset only when a user connects.