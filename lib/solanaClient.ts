import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { PocketsProgram } from "./program/pockets_program";
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { Buffer } from "buffer";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
const pocketsIDL = require("./program/pockets_program.json");

const POCKETS_PROGRAM_PROGRAMID =
  "GEUwNbnu9jkRMY8GX5Ar4R11mX9vXR8UDFnKZMn5uWLJ";



export async function getProposalAccount (connection: Connection, proposalId: string) {
    const POCKETS_PROGRAM: Program<PocketsProgram> = new Program(
        pocketsIDL,
        POCKETS_PROGRAM_PROGRAMID,
        new AnchorProvider(
          connection,
          new Wallet(Keypair.generate()),
          { commitment: "confirmed" }
        )
      );

    const proposalPDA = PublicKey.findProgramAddressSync([Buffer.from("proposal"), Buffer.from(proposalId)], POCKETS_PROGRAM.programId)[0];

    const proposalAccount = await POCKETS_PROGRAM.account.proposal.fetch(proposalPDA);

    return proposalAccount;
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
      new AnchorProvider(connection, new Wallet(Keypair.generate()), {
        commitment: "confirmed",
      })
    );
  
    const proposalPDA = PublicKey.findProgramAddressSync(
      [Buffer.from("proposal"), Buffer.from(proposalId)],
      POCKETS_PROGRAM.programId
    )[0];
    const walletAta = getAssociatedTokenAddressSync(characterMint, wallet);
    const citizen = PublicKey.findProgramAddressSync(
      [Buffer.from("citizen"), Buffer.from(characterMint.toBuffer())],
      POCKETS_PROGRAM.programId
    )[0];
    const vote = PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), citizen.toBuffer(), proposalPDA.toBuffer()],
      POCKETS_PROGRAM.programId
    )[0];
    const faction = PublicKey.findProgramAddressSync(
      [Buffer.from("faction"), Buffer.from(factionId)],
      POCKETS_PROGRAM.programId
    )[0];
  
    const ix = POCKETS_PROGRAM.methods
      .voteOnProposal(new BN(amount))
      .accounts({
        wallet,
        walletAta,
        systemProgram: SystemProgram.programId,
        citizen,
        vote,
        proposal: proposalPDA,
        faction,
      })
      .instruction();
  
    return ix;
  }


