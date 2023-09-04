# API Client

## Structure & Convention

- `index.ts` declares the `apiRequest` function. This function accepts a generic type and returns a promise of that type.
- All miscellaneous calls -- for example, calls to other APIs -- are declared in `misc.ts`.
- Each API request has their associated type declared in the generic type of `apiRequest`.
  - This can be done in-place or, when the type is used in multiple places, in `types/client/*.ts`.
- Each base route has their own file. For example, `character.ts` contains all the functions for the `/character` route.

## Previous API Client Structure

For reference, the previous API client structure is as follows:

- One file with all the API calls, almost 1000 lines long.
- Inconsistent naming convention.
- No type safety.

Here is each function name with associated API route:

- `fetchLeaderboard`: `/leaderboard`
- `fetchCharacters`: `/wallet/characters`
- `fetchAllAssets`: `/wallet/assets`
- `fetchCharacter`: `/character`
- `postCharCreate`: `/character/create`
- `postSpeedUpWithBonk`: `/character/timers/speedup`
- `fetchCharTimers`: `/character/timers`
- `postConsumeUnitRequest`: `/character/units/consume/request`
- `postConsumeUnitConfirm`: `/character/units/consume/confirm`
- `postConsumeResource`: `/character/resources/consume`
- `requestEquipUnit`: `/character/units/equip/request`
- `confirmEquipUnit`: `/character/units/equip/confirm`
- `dequipUnit`: `/character/units/dequip`
- `postBattle`: `/character/battle`
- `getBattleHistory`: `/character/battle/history`
- `fetchFactions`: `/factions`
- `fetchFaction`: `/faction`
- `postCreateFaction`: `/faction/create`
- `postCompleteConstruction`: `/faction/construction/complete`
- `postFactionStationStart`: `/faction/station/start`
- `postFactionStationClaim`: `/faction/station/claim`
- `postCreateProposal`: `/faction/proposal/create`
- `fetchProposal`: `/faction/proposal`
- `fetchProposalsByFaction`: `/faction/proposals`
- `postJoinFaction`: `/faction/join`
- `postLeaveFaction`: `/faction/leave`
- `fetchResources`: `/faction/rfs`
- `processProposal`: `/faction/proposal/process`
- `completeConstruction`: `/faction/construction/complete`
- `postRfHarvest`: `/rf/harvest`
- `fetchRfAllocation`: `/rf/allocation`
- `postRfAllocate`: `/rf/allocate`
- `harvestResourceField`: `/rf/harvest`
- `fetchFactionVotingInfo`: `/accounts/faction`
- `fetchCitizen`: `/accounts/citizen`
- `fetchProposalAccount`: `/accounts/proposal`
- `fetchProposalVotesByCitizen`: `/accounts/vote`
- `delegateVotes`: `/accounts/delegation`
- `fetchRfsFromChain`: `/accounts/rf`
