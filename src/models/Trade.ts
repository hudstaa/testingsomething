export interface Trade {
    ethAmount: bigint
    isBuy: boolean
    protocolEthAmount: bigint
    referralEthAmount: bigint
    referrer: string
    subject: string
    supply: bigint
    subjectEthAmount: string
    tokenAmount: bigint
    trader: string
    transactionHash: string
    blockTimestamp: string
}