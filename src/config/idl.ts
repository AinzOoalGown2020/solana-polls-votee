import { SolanaPollsIdl } from '../types/idl';

export const IDL: SolanaPollsIdl = {
    "version": "0.1.0",
    "name": "solana_polls",
    "instructions": [
        {
            "name": "createEvent",
            "accounts": [
                {
                    "name": "event",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "description",
                    "type": "string"
                }
            ]
        },
        {
            "name": "createSession",
            "accounts": [
                {
                    "name": "session",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "event",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "authority",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "startTime",
                    "type": "i64"
                },
                {
                    "name": "endTime",
                    "type": "i64"
                }
            ]
        },
        {
            "name": "signPresence",
            "accounts": [
                {
                    "name": "presence",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "session",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "student",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "Event",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "authority",
                        "type": "publicKey"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "Session",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "event",
                        "type": "publicKey"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "startTime",
                        "type": "i64"
                    },
                    {
                        "name": "endTime",
                        "type": "i64"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "Presence",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "student",
                        "type": "publicKey"
                    },
                    {
                        "name": "session",
                        "type": "publicKey"
                    },
                    {
                        "name": "signedAt",
                        "type": "i64"
                    }
                ]
            }
        }
    ]
}; 