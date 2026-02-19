/**
 * Role-based access constants for Project Aarna.
 * The validator address is fixed — only this wallet sees the Validator dashboard.
 * All other wallets see the Developer dashboard.
 */

/** The fixed validator wallet address (Algorand Testnet) */
export const VALIDATOR_ADDRESS = 'KI6X3F5Y6CHH2MK4TA7RUVF43AXVGEAZN7TWT7BVNUU4JGQ5ENZUTA5CCA'

/** Check if a wallet address is the validator */
export const isValidator = (address: string | null | undefined): boolean =>
    !!address && address === VALIDATOR_ADDRESS
