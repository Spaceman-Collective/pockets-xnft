export type PocketsProgram = {
  "version": "0.1.0",
  "name": "pockets_program",
  "instructions": [
    {
      "name": "createFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firstCitizen",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "startingVotingPower",
          "type": "u64"
        },
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maxVotingPower",
          "type": "u64"
        },
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferVotesFromFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCitizen",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteCitizen",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "joinFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "leaveFaction",
      "docs": [
        "* Requires\n     *  1. This user has 0 voting power delegated to other users\n     *  2. This user has 0 voting power delegated by other users\n     *  3. This user has 0 voting power locked up in proposals\n     *\n     * User should close the above accounts before leaving a faction"
      ],
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createProposal",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteProposal",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateProposal",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newStatus",
          "type": {
            "defined": "ProposalStatus"
          }
        }
      ]
    },
    {
      "name": "voteOnProposal",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateVote",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        },
        {
          "name": "isIncrement",
          "type": "bool"
        }
      ]
    },
    {
      "name": "closeVoteAccount",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferVotes",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "delegateVotes",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegationRecord",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteVoteDelegation",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "delegation",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "adjustVoteDelegation",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegationRecord",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        },
        {
          "name": "isIncrement",
          "type": "bool"
        }
      ]
    },
    {
      "name": "returnVoteDelegation",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegationRecord",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "allocateResourceField",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rf",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteResourceField",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "resourceField",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "developResourceField",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "faction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "maxVotingPower",
            "type": "u64"
          },
          {
            "name": "thresholdToPass",
            "type": "u64"
          },
          {
            "name": "unallocatedVotingPower",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "citizen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "faction",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "delegatedVotingPower",
            "type": "u64"
          },
          {
            "name": "grantedVotingPower",
            "type": "u64"
          },
          {
            "name": "totalVotingPower",
            "type": "u64"
          },
          {
            "name": "maxPledgedVotingPower",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "faction",
            "type": "publicKey"
          },
          {
            "name": "voteAmt",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "ProposalStatus"
            }
          }
        ]
      }
    },
    {
      "name": "proposalVote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "citizen",
            "type": "publicKey"
          },
          {
            "name": "voteAmt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "voteDelegation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "citizen",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": "publicKey"
          },
          {
            "name": "voteAmt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "resourceField",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "harvest",
            "type": {
              "option": {
                "defined": "Harvest"
              }
            }
          },
          {
            "name": "refreshSeconds",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "isHarvestable",
            "type": "bool"
          },
          {
            "name": "initalClaimant",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "timesDeveloped",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Harvest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "resource",
            "type": "string"
          },
          {
            "name": "harvest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ProposalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "VOTING"
          },
          {
            "name": "PASSED"
          },
          {
            "name": "CLOSED"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CitizenHasOutstandingVotes",
      "msg": "Can't leave a faction til you close all your Delegate Votes and Pending Proposal Accounts"
    },
    {
      "code": 6001,
      "name": "CitizenLacksVotingPower",
      "msg": "Citizen doesn't have enough voting power!"
    },
    {
      "code": 6002,
      "name": "InvalidVotingPowerDecrement",
      "msg": "Invalid Voting Power Loss!"
    },
    {
      "code": 6003,
      "name": "DelegatePendingVotes",
      "msg": "Delgate has pending votes right now"
    },
    {
      "code": 6004,
      "name": "ResourceFieldAlreadyDeveloped",
      "msg": "Resource Field is already developed!"
    },
    {
      "code": 6005,
      "name": "TransferFromFactionErrror",
      "msg": "Faction doesn't have that many unallocated votes"
    }
  ]
};

export const IDL: PocketsProgram = {
  "version": "0.1.0",
  "name": "pockets_program",
  "instructions": [
    {
      "name": "createFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "firstCitizen",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "startingVotingPower",
          "type": "u64"
        },
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maxVotingPower",
          "type": "u64"
        },
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferVotesFromFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCitizen",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteCitizen",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "joinFaction",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "leaveFaction",
      "docs": [
        "* Requires\n     *  1. This user has 0 voting power delegated to other users\n     *  2. This user has 0 voting power delegated by other users\n     *  3. This user has 0 voting power locked up in proposals\n     *\n     * User should close the above accounts before leaving a faction"
      ],
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createProposal",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteProposal",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateProposal",
      "accounts": [
        {
          "name": "server",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newStatus",
          "type": {
            "defined": "ProposalStatus"
          }
        }
      ]
    },
    {
      "name": "voteOnProposal",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateVote",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        },
        {
          "name": "isIncrement",
          "type": "bool"
        }
      ]
    },
    {
      "name": "closeVoteAccount",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vote",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "transferVotes",
      "accounts": [
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "delegateVotes",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegationRecord",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteVoteDelegation",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "delegation",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "adjustVoteDelegation",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegationRecord",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        },
        {
          "name": "isIncrement",
          "type": "bool"
        }
      ]
    },
    {
      "name": "returnVoteDelegation",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteRecepient",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "delegationRecord",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteAmt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "allocateResourceField",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rf",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteResourceField",
      "accounts": [
        {
          "name": "server",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "resourceField",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "developResourceField",
      "accounts": [
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "walletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "citizen",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "faction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "maxVotingPower",
            "type": "u64"
          },
          {
            "name": "thresholdToPass",
            "type": "u64"
          },
          {
            "name": "unallocatedVotingPower",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "citizen",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "faction",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "delegatedVotingPower",
            "type": "u64"
          },
          {
            "name": "grantedVotingPower",
            "type": "u64"
          },
          {
            "name": "totalVotingPower",
            "type": "u64"
          },
          {
            "name": "maxPledgedVotingPower",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "faction",
            "type": "publicKey"
          },
          {
            "name": "voteAmt",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": "ProposalStatus"
            }
          }
        ]
      }
    },
    {
      "name": "proposalVote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "citizen",
            "type": "publicKey"
          },
          {
            "name": "voteAmt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "voteDelegation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "citizen",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": "publicKey"
          },
          {
            "name": "voteAmt",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "resourceField",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "harvest",
            "type": {
              "option": {
                "defined": "Harvest"
              }
            }
          },
          {
            "name": "refreshSeconds",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "isHarvestable",
            "type": "bool"
          },
          {
            "name": "initalClaimant",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "timesDeveloped",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Harvest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "resource",
            "type": "string"
          },
          {
            "name": "harvest",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ProposalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "VOTING"
          },
          {
            "name": "PASSED"
          },
          {
            "name": "CLOSED"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CitizenHasOutstandingVotes",
      "msg": "Can't leave a faction til you close all your Delegate Votes and Pending Proposal Accounts"
    },
    {
      "code": 6001,
      "name": "CitizenLacksVotingPower",
      "msg": "Citizen doesn't have enough voting power!"
    },
    {
      "code": 6002,
      "name": "InvalidVotingPowerDecrement",
      "msg": "Invalid Voting Power Loss!"
    },
    {
      "code": 6003,
      "name": "DelegatePendingVotes",
      "msg": "Delgate has pending votes right now"
    },
    {
      "code": 6004,
      "name": "ResourceFieldAlreadyDeveloped",
      "msg": "Resource Field is already developed!"
    },
    {
      "code": 6005,
      "name": "TransferFromFactionErrror",
      "msg": "Faction doesn't have that many unallocated votes"
    }
  ]
};
