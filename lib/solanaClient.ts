import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { PocketsProgram } from "./program/pockets_program";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Buffer } from "buffer";

const pocketsIDL = require("./program/pockets_program");

const POCKETS_PROGRAM_PROGRAMID =
  "GEUwNbnu9jkRMY8GX5Ar4R11mX9vXR8UDFnKZMn5uWLJ";

export async function getProposalAccount(
  connection: Connection,
  proposalId: string,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
  );

  const proposalPDA = getProposalPDA(proposalId);

  const proposalAccount =
    await POCKETS_PROGRAM.account.proposal.fetch(proposalPDA);

  return proposalAccount;
}

export function getProposalPDA(proposalId: string): PublicKey {
  const [proposalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("proposal"), Buffer.from(proposalId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return proposalPDA;
}

export function getResourceFieldPDA(rfId: string): PublicKey {
  const [proposalPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("rf"), Buffer.from(rfId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return proposalPDA;
}

export function getCitizenPDA(characterMint: PublicKey): PublicKey {
  const [citizenPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("citizen"), Buffer.from(characterMint.toBuffer())],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return citizenPDA;
}

export function getVotePDA(
  citizen: PublicKey,
  proposalPDA: PublicKey,
): PublicKey {
  const [votePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("vote"), citizen.toBuffer(), proposalPDA.toBuffer()],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return votePDA;
}

export function getFactionPDA(factionId: string): PublicKey {
  const [factionPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("faction"), Buffer.from(factionId)],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return factionPDA;
}

export function getDelegationRecordPDA(
  citizen: PublicKey,
  voteRecipientCitizen: PublicKey,
): PublicKey {
  const [delegationRecordPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("delegate"),
      citizen.toBuffer(),
      voteRecipientCitizen.toBuffer(),
    ],
    new PublicKey(POCKETS_PROGRAM_PROGRAMID),
  );
  return delegationRecordPDA;
}

export async function voteOnProposalIx(
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  proposalId: string,
  amount: number,
  factionId: string,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
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

export async function updateVote(
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  proposalId: string,
  amount: number,
  factionId: string,
  isIncrement: boolean,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
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
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  proposalId: string,
  factionId: string,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
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
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  voteAmt: number,
  voteCharacterRecepientMint: PublicKey,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
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
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  voteAmt: number,
  voteCharacterRecepientMint: PublicKey,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
  );
  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);

  const citizen = getCitizenPDA(characterMint);
  const voteRecepientCitizen = getCitizenPDA(voteCharacterRecepientMint);
  const delegationRecord = getDelegationRecordPDA(
    citizen,
    voteRecepientCitizen,
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
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  voteCharacterRecepientMint: PublicKey,
  amount: number,
  isIncrement: boolean,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
  );

  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const voteRecepientCitizen = getCitizenPDA(voteCharacterRecepientMint);
  const delegationRecord = getDelegationRecordPDA(
    citizen,
    voteRecepientCitizen,
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
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  voteCharacterRecepientMint: PublicKey,
  amount: number,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    }),
  );

  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const voteRecepientCitizen = getCitizenPDA(voteCharacterRecepientMint);
  const delegationRecord = getDelegationRecordPDA(
    citizen,
    voteRecepientCitizen,
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

export async function prospectResourceField(
  connection: Connection,
  wallet: PublicKey,
  characterMint: PublicKey,
  factionId: string,
  rf: PublicKey,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    })
  );

  const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
  const citizen = getCitizenPDA(characterMint);
  const faction = getFactionPDA(factionId);
  // const rf = getResourceFieldPDA(rfId);

  const ix = POCKETS_PROGRAM.methods
    .developResourceField()
    .accounts({
      wallet,
      walletAta,
      systemProgram: SystemProgram.programId,
      citizen,
      rf,
      faction,
    })
    .instruction();

  return ix;
}

export async function getResourceField(
  connection: Connection,
  rfId: string,
) {
  const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
    pocketsIDL,
    POCKETS_PROGRAM_PROGRAMID,
    new AnchorProvider(connection, new Wallet(Keypair.generate()), {
      commitment: "confirmed",
    })
  );

  const rfPDA = getResourceFieldPDA(rfId);

  const rfAcc = await POCKETS_PROGRAM.account.resourceField.fetchNullable(
    rfPDA
  );

  return rfAcc
}