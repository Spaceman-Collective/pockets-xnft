import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { PocketsProgram } from "./program/pockets_program";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
const pocketsIDL = require("./program/pockets_program.json");

const POCKETS_PROGRAM_PROGRAMID =
  "GEUwNbnu9jkRMY8GX5Ar4R11mX9vXR8UDFnKZMn5uWLJ";
   
export function getProposalPDA(proposalId: string): PublicKey {
  const [proposalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("proposal"), Buffer.from(proposalId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID)
  );
  return proposalPDA;
}

export async function getProposalAccount(
  connection: Connection,
  proposalId: string
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    { connection }
  );

  const proposalPDA = getProposalPDA(proposalId);

  const proposalAccount = await POCKETS_PROGRAM.account.proposal.fetch(
    proposalPDA,
    "finalized"
  );

  return proposalAccount;
}

export function getMultipleProposalPDA(proposalId: string): PublicKey {
  const [proposalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("proposal"), Buffer.from(proposalId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID)
  );
  return proposalPDA;
}

export function getCitizenPDA(characterMint: PublicKey): PublicKey {
  const [citizenPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("citizen"), Buffer.from(characterMint.toBuffer())],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID)
  );
  return citizenPDA;
}

export function getMultipleCitizenPDAS(proposalId: string): PublicKey {
  const [proposalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("proposal"), Buffer.from(proposalId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID)
  );
  return proposalPDA;
}

export async function getCitizenAccount(
  connection: Connection,
  citizenPDA: PublicKey
) {
  if (!connection || !citizenPDA) return;
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    { connection }
  );
  return await POCKETS_PROGRAM.account.citizen.fetchNullable(
    citizenPDA,
    "confirmed"
  );
}

export function getVotePDA(
  citizen: PublicKey,
  proposalPDA: PublicKey
): PublicKey {
  const [votePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("vote"), citizen.toBuffer(), proposalPDA.toBuffer()],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID)
  );
  return votePDA;
}

export async function getVoteAccount(
  connection: Connection,
  votePDAAddress: PublicKey
) {
  if (!connection || !votePDAAddress) {
    return;
  }
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    { connection }
  );
  const result = await POCKETS_PROGRAM.account.proposalVote.fetchNullable(
    votePDAAddress,
    "finalized"
  );
  return result;
}

export async function getMultipleVoteAccounts(
  connection: Connection,
  votePDAAddresses: PublicKey[]
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    { connection }
  );
  return await POCKETS_PROGRAM.account.proposalVote.fetchMultiple(
    votePDAAddresses,
    "finalized"
  );
}

export function getFactionPDA(factionId: string): PublicKey {
  const [factionPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("faction"), Buffer.from(factionId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID)
  );
  return factionPDA;
}

export async function getFactionAccount(
  connection: Connection,
  factionPDA: PublicKey
) {
  if (!connection || !factionPDA) return;
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    { connection }
  );
  return await POCKETS_PROGRAM.account.faction.fetchNullable(
    factionPDA,
    "confirmed"
  );
}

export function getDelegationRecordPDA(
  citizen: PublicKey,
  voteRecipientCitizen: PublicKey
): PublicKey {
  const [delegationRecordPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("delegate"),
      citizen.toBuffer(),
      voteRecipientCitizen.toBuffer(),
    ],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID)
  );
  return delegationRecordPDA;
}

export async function getCitizensIx(
  wallet: PublicKey,
  characterMint: PublicKey,
  proposalId: string,
  amount: number,
  factionId: string
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    {
      connection: new Connection(
        "https://rpc.helius.xyz/?api-key=1b21b073-a222-47bb-8628-564145e58f4e"
      ),
    }
  );

  const proposal = getProposalPDA(proposalId);
  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const vote = getVotePDA(citizen, proposal);
  const faction = getFactionPDA(factionId);

  const ix = POCKETS_PROGRAM.methods
    .voteOnProposal(new BN(amount))
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      vote,
      proposal,
      faction,
    })
    .instruction();

  return ix;
}

export async function voteOnProposalIx(
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  proposalId: string,
  amount: number,
  factionId: string
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    {
      connection,
    }
  );

  const proposal = getProposalPDA(proposalId);
  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const vote = getVotePDA(citizen, proposal);
  const faction = getFactionPDA(factionId);

  const ix = POCKETS_PROGRAM.methods
    .voteOnProposal(new BN(amount))
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      vote,
      proposal,
      faction,
    })
    .instruction();

  return ix;
}

export async function updateVoteOnProposalIx(
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  proposalId: string,
  amount: number,
  factionId: string,
  isIncrement: boolean
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    {
      connection,
    }
  );

  const proposal = getProposalPDA(proposalId);
  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const vote = getVotePDA(citizen, proposal);
  const faction = getFactionPDA(factionId);

  const ix = POCKETS_PROGRAM.methods
    .updateVote(new BN(amount), isIncrement)
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      vote,
      proposal,
      faction,
    })
    .instruction();

  return ix;
}

export async function closeVoteAccount(
  wallet: PublicKey,
  characterMint: PublicKey,
  proposalId: string,
  factionId: string
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID
  );

  const proposal = getProposalPDA(proposalId);
  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const vote = getVotePDA(citizen, proposal);
  const faction = getFactionPDA(factionId);

  const ix = POCKETS_PROGRAM.methods
    .closeVoteAccount()
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      vote,
      proposal,
      faction,
    })
    .instruction();

  return ix;
}

export async function transferVotes(
  wallet: PublicKey,
  characterMint: PublicKey,
  voteAmt: number,
  voteCharacterRecepientMint: PublicKey
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID
  );

  const citizen = getCitizenPDA(characterMint);
  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const voteRecepientCitizen = getCitizenPDA(voteCharacterRecepientMint);

  const ix = POCKETS_PROGRAM.methods
    .transferVotes(new BN(voteAmt))
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      voteRecepient: voteCharacterRecepientMint,
    })
    .instruction();

  return ix;
}

export async function delegateVotes(
  wallet: PublicKey,
  characterMint: PublicKey,
  voteAmt: number,
  voteCharacterRecepientMint: PublicKey
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID
  );
  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);

  const citizen = getCitizenPDA(characterMint);
  const voteRecepientCitizen = getCitizenPDA(voteCharacterRecepientMint);
  const delegationRecord = getDelegationRecordPDA(
    citizen,
    voteRecepientCitizen
  );

  const ix = POCKETS_PROGRAM.methods
    .delegateVotes(new BN(voteAmt))
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      voteRecepient: voteCharacterRecepientMint,
      delegationRecord,
    })
    .instruction();

  return ix;
}

export async function adjustVoteDelegation(
  wallet: PublicKey,
  characterMint: PublicKey,
  voteCharacterRecepientMint: PublicKey,
  amount: number,
  isIncrement: boolean
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID
  );

  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const voteRecepientCitizen = getCitizenPDA(voteCharacterRecepientMint);
  const delegationRecord = getDelegationRecordPDA(
    citizen,
    voteRecepientCitizen
  );

  const ix = POCKETS_PROGRAM.methods
    .adjustVoteDelegation(new BN(amount), isIncrement)
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      voteRecepient: voteRecepientCitizen,
      delegationRecord,
    })
    .instruction();

  return ix;
}

export async function returnVoteDelegation(
  wallet: PublicKey,
  characterMint: PublicKey,
  voteCharacterRecepientMint: PublicKey,
  amount: number
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID
  );

  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const voteRecepientCitizen = getCitizenPDA(voteCharacterRecepientMint);
  const delegationRecord = getDelegationRecordPDA(
    citizen,
    voteRecepientCitizen
  );

  const ix = POCKETS_PROGRAM.methods
    .returnVoteDelegation(new BN(amount))
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      voteRecepient: voteRecepientCitizen,
      delegationRecord,
    })
    .instruction();

  return ix;
}
