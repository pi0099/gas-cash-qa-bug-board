import type { Edge, Node } from '@xyflow/react'

export type EvidenceTag = 'Documented' | 'Observed' | 'Coming soon'

export type MindMapNodeData = {
  label: string
  kind: 'center' | 'branch' | 'leaf'
  tags: EvidenceTag[]
  summary: string
  detail?: string
}

export const mindMapNodes: Node<MindMapNodeData>[] = [
  {
    id: 'gas',
    type: 'gasNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'Gas Cash',
      kind: 'center',
      tags: ['Documented', 'Observed'],
      summary:
        'Location-based on-chain game on Robinhood Chain (4663). Drive to a real gas station, pump, earn USO + $GAS.',
      detail:
        'Primary UX is mobile + map + Privy social login — not a classic MetaMask/WalletConnect dApp. Protocol activity (2% $GAS trade tax, key/merge fees) feeds a prize pool claimed at pumps.',
    },
  },

  // —— Auth ——
  {
    id: 'auth',
    type: 'gasNode',
    position: { x: -520, y: -320 },
    data: {
      label: 'Auth',
      kind: 'branch',
      tags: ['Observed'],
      summary: 'Privy social login: Google / X; Apple also shown in the login modal.',
      detail: 'Session gates Garage, Mileage, and funded flows. Account deletion is email/support path; on-chain funds stay with exported key.',
    },
  },
  {
    id: 'auth-privy',
    type: 'gasNode',
    position: { x: -780, y: -400 },
    data: {
      label: 'Privy OAuth',
      kind: 'leaf',
      tags: ['Observed', 'Documented'],
      summary: 'Google / X (terms emphasize these); Apple visible in modal.',
    },
  },
  {
    id: 'auth-attest',
    type: 'gasNode',
    position: { x: -780, y: -260 },
    data: {
      label: 'Eligibility attestation',
      kind: 'leaf',
      tags: ['Documented', 'Observed'],
      summary: '18+ and Stock Token rules shown before first claim/swap (Buy $GAS attestation Observed).',
    },
  },

  // —— Wallet ——
  {
    id: 'wallet',
    type: 'gasNode',
    position: { x: -520, y: -80 },
    data: {
      label: 'Wallet',
      kind: 'branch',
      tags: ['Documented'],
      summary: 'Privy embedded non-custodial wallet — balances, export, Deposit/Buy Gas.',
      detail: 'Key export available from Deposit / Buy Gas. Losing social access without export risks funds. Gas sponsorship is a courtesy, not a guarantee.',
    },
  },
  {
    id: 'wallet-export',
    type: 'gasNode',
    position: { x: -780, y: -120 },
    data: {
      label: 'Key export',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Export from Deposit / Buy Gas; irreversible if lost.',
    },
  },
  {
    id: 'wallet-sponsor',
    type: 'gasNode',
    position: { x: -780, y: -20 },
    data: {
      label: 'Gas sponsorship',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Courtesy sponsorship for txs — may be unavailable; UX must not silent-succeed.',
    },
  },

  // —— Fund / Buy $GAS ——
  {
    id: 'fund',
    type: 'gasNode',
    position: { x: -520, y: 160 },
    data: {
      label: 'Fund / Buy $GAS',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Deposit USDC/ETH → Gas Swap into $GAS. 2% buy/sell tax on $GAS trades.',
      detail: 'Buy $GAS attestation UI Observed (cancel-only in money-safe QA). Proof page shows ~2% tax.',
    },
  },
  {
    id: 'fund-tax',
    type: 'gasNode',
    position: { x: -780, y: 120 },
    data: {
      label: '2% $GAS trade tax',
      kind: 'leaf',
      tags: ['Documented', 'Observed'],
      summary: 'Feeds prize pool. Visible on proof / marketing.',
    },
  },
  {
    id: 'fund-deposit',
    type: 'gasNode',
    position: { x: -780, y: 220 },
    data: {
      label: 'Deposit / Swap',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'FAQ path: fund wallet → deposit → swap to $GAS.',
    },
  },

  // —— Vehicle ——
  {
    id: 'vehicle',
    type: 'gasNode',
    position: { x: -200, y: -360 },
    data: {
      label: 'Get vehicle',
      kind: 'branch',
      tags: ['Documented'],
      summary: 'Free bike if no car; or buy keys in Mini Mart and open cars (NFT).',
      detail: 'Bike: limited uses, never jackpot, claim cap ~$0.50. Cars unlock fuller claim economics.',
    },
  },
  {
    id: 'vehicle-bike',
    type: 'gasNode',
    position: { x: -40, y: -480 },
    data: {
      label: 'Free bike',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Fallback when player has no car NFT; capped payouts.',
    },
  },
  {
    id: 'vehicle-keys',
    type: 'gasNode',
    position: { x: -320, y: -480 },
    data: {
      label: 'Keys → cars',
      kind: 'leaf',
      tags: ['Documented', 'Observed'],
      summary: 'Regular / Super / Premium keys priced in $GAS (Mini Mart).',
    },
  },

  // —— Map / Claim ——
  {
    id: 'claim',
    type: 'gasNode',
    position: { x: 120, y: -360 },
    data: {
      label: 'Map / Claim',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Map + real stations; hold-to-pump. Server validates presence; pays USO + $GAS.',
      detail: 'Geo anti-cheat, photo challenge, ≤3 claims/day account cap, 6 pumps/station. Refusals cost nothing (no use consumed). Field testing required for full claim.',
    },
  },
  {
    id: 'claim-geo',
    type: 'gasNode',
    position: { x: 40, y: -500 },
    data: {
      label: 'Geo anti-cheat',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Must visit real stations; VPN/proxy likely refused. Fingerprint (anti.fillgas.xyz).',
    },
  },
  {
    id: 'claim-pumps',
    type: 'gasNode',
    position: { x: 220, y: -500 },
    data: {
      label: 'Pumps & caps',
      kind: 'leaf',
      tags: ['Documented'],
      summary: '6 pumps/station; daily account cap ≤3; busy pumps refuse cleanly.',
    },
  },

  // —— Rewards ——
  {
    id: 'rewards',
    type: 'gasNode',
    position: { x: 420, y: -280 },
    data: {
      label: 'Rewards',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Prize pool pays USO Stock Token + $GAS to the wallet on successful claim.',
      detail: 'Proof page shows live pool, prices, contract links (Observed). Chain truth > UI copy.',
    },
  },
  {
    id: 'rewards-uso',
    type: 'gasNode',
    position: { x: 620, y: -360 },
    data: {
      label: 'USO Stock Token',
      kind: 'leaf',
      tags: ['Documented', 'Observed'],
      summary: 'Claim currency / repairs; tracks USO fund. Chain 4663.',
    },
  },
  {
    id: 'rewards-gas',
    type: 'gasNode',
    position: { x: 620, y: -240 },
    data: {
      label: '$GAS payout',
      kind: 'leaf',
      tags: ['Documented', 'Observed'],
      summary: 'Utility token also paid on claims; used for shop / stake / swap.',
    },
  },

  // —— Garage ——
  {
    id: 'garage',
    type: 'gasNode',
    position: { x: 420, y: -40 },
    data: {
      label: 'Garage / Lineup',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Starting 5 lineup, reserves, stats, cooldown/wait, repairs (USO → burn $GAS path).',
      detail: 'Live routes: /garage, Chop Shop at /chopshop, Inventory at /pitstop. Hyphen docs paths /chop-shop & /inventory 404 Observed.',
    },
  },
  {
    id: 'garage-lineup',
    type: 'gasNode',
    position: { x: 640, y: -100 },
    data: {
      label: 'Starting 5',
      kind: 'leaf',
      tags: ['Documented', 'Observed'],
      summary: 'Save lineup; multiplier / wait / daily estimate update.',
    },
  },
  {
    id: 'garage-repair',
    type: 'gasNode',
    position: { x: 640, y: 20 },
    data: {
      label: 'Repairs',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Repair worn car with USO; burn path via docs/proof narrative.',
    },
  },

  // —— Mini Mart ——
  {
    id: 'minimart',
    type: 'gasNode',
    position: { x: 420, y: 200 },
    data: {
      label: 'Mini Mart',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Buy keys (Regular / Super / Premium) in $GAS. Inventory open/boost.',
      detail: 'Shop UI Observed; crowbars / insurance / scratchers / Alarm-class listed — many Coming soon. Inventory live at /pitstop (docs /inventory 404).',
    },
  },
  {
    id: 'minimart-keys',
    type: 'gasNode',
    position: { x: 640, y: 140 },
    data: {
      label: 'Keys SKUs',
      kind: 'leaf',
      tags: ['Observed', 'Documented'],
      summary: 'Regular / Super / Premium; boost steps ≤5 before open.',
    },
  },
  {
    id: 'minimart-soon',
    type: 'gasNode',
    position: { x: 640, y: 260 },
    data: {
      label: 'Crowbars / insurance / …',
      kind: 'leaf',
      tags: ['Coming soon', 'Observed'],
      summary: 'Items shown in Mini Mart; docs say not live — purchase must fail safely or be blocked.',
    },
  },

  // —— Chop Shop ——
  {
    id: 'chop',
    type: 'gasNode',
    position: { x: 120, y: 320 },
    data: {
      label: 'Chop Shop',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Merge cars: fee in $GAS; success or miss sealed car; both inputs consumed.',
      detail: 'Docs say live; UI at /chopshop Observed. /chop-shop still 404 (docs/path gap).',
    },
  },
  {
    id: 'chop-merge',
    type: 'gasNode',
    position: { x: 120, y: 460 },
    data: {
      label: 'Merge + fees',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Merge odds, fees, burn paths documented; RNG outcomes.',
    },
  },

  // —— ATM ——
  {
    id: 'atm',
    type: 'gasNode',
    position: { x: -200, y: 320 },
    data: {
      label: 'ATM stake',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Stake $GAS 7–30d; claim rewards; early unlock penalty.',
      detail: '30d ~1.5× weight vs 7d. Early unlock: penalty ≤20% shrinking; all unclaimed rewards forfeited. UI Observed at /atm.',
    },
  },
  {
    id: 'atm-lock',
    type: 'gasNode',
    position: { x: -360, y: 460 },
    data: {
      label: '7d / 30d lock',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Longer lock = higher stake weight (~1.5× for 30d).',
    },
  },
  {
    id: 'atm-early',
    type: 'gasNode',
    position: { x: -40, y: 460 },
    data: {
      label: 'Early unlock penalty',
      kind: 'leaf',
      tags: ['Documented'],
      summary: '≤20% shrinking penalty; claim rewards first or forfeit them.',
    },
  },

  // —— Social ——
  {
    id: 'social',
    type: 'gasNode',
    position: { x: -520, y: 360 },
    data: {
      label: 'Social',
      kind: 'branch',
      tags: ['Documented', 'Observed'],
      summary: 'Mileage, leaderboard (24h / 7d / all), referrals, profiles.',
      detail: 'Referral link gas.cash/r/{username}, invite cookie 30d; no claim share paid today. Privacy Public/Private + location hide.',
    },
  },
  {
    id: 'social-mileage',
    type: 'gasNode',
    position: { x: -760, y: 320 },
    data: {
      label: 'Mileage / leaderboard',
      kind: 'leaf',
      tags: ['Observed', 'Documented'],
      summary: 'Gated shells Observed; some API errors unauth / soft-fail when authed.',
    },
  },
  {
    id: 'social-ref',
    type: 'gasNode',
    position: { x: -760, y: 440 },
    data: {
      label: 'Referrals',
      kind: 'leaf',
      tags: ['Documented'],
      summary: 'Invite cookie 30d; claim share payout off today.',
    },
  },

  // —— Proof ——
  {
    id: 'proof',
    type: 'gasNode',
    position: { x: 420, y: 400 },
    data: {
      label: 'Proof / transparency',
      kind: 'branch',
      tags: ['Observed'],
      summary: 'Public proof page: prize pool, USO/$GAS prices, 2% tax, Blockscout + Dexscreener links.',
      detail: 'app.gas.cash/proof — primary reconciliation surface for QA.',
    },
  },
  {
    id: 'proof-chain',
    type: 'gasNode',
    position: { x: 640, y: 380 },
    data: {
      label: 'Chain 4663',
      kind: 'leaf',
      tags: ['Documented', 'Observed'],
      summary: 'Robinhood Chain execution; contracts on docs + proof.',
    },
  },
  {
    id: 'proof-dealership',
    type: 'gasNode',
    position: { x: 640, y: 480 },
    data: {
      label: 'Dealership',
      kind: 'leaf',
      tags: ['Coming soon', 'Observed'],
      summary: 'Route exists; empty / “Could not load the market.” Docs: coming soon.',
    },
  },
]

export const mindMapEdges: Edge[] = [
  { id: 'e-gas-auth', source: 'gas', target: 'auth' },
  { id: 'e-gas-wallet', source: 'gas', target: 'wallet' },
  { id: 'e-gas-fund', source: 'gas', target: 'fund' },
  { id: 'e-gas-vehicle', source: 'gas', target: 'vehicle' },
  { id: 'e-gas-claim', source: 'gas', target: 'claim' },
  { id: 'e-gas-rewards', source: 'gas', target: 'rewards' },
  { id: 'e-gas-garage', source: 'gas', target: 'garage' },
  { id: 'e-gas-minimart', source: 'gas', target: 'minimart' },
  { id: 'e-gas-chop', source: 'gas', target: 'chop' },
  { id: 'e-gas-atm', source: 'gas', target: 'atm' },
  { id: 'e-gas-social', source: 'gas', target: 'social' },
  { id: 'e-gas-proof', source: 'gas', target: 'proof' },

  { id: 'e-auth-privy', source: 'auth', target: 'auth-privy' },
  { id: 'e-auth-attest', source: 'auth', target: 'auth-attest' },
  { id: 'e-wallet-export', source: 'wallet', target: 'wallet-export' },
  { id: 'e-wallet-sponsor', source: 'wallet', target: 'wallet-sponsor' },
  { id: 'e-fund-tax', source: 'fund', target: 'fund-tax' },
  { id: 'e-fund-deposit', source: 'fund', target: 'fund-deposit' },
  { id: 'e-vehicle-bike', source: 'vehicle', target: 'vehicle-bike' },
  { id: 'e-vehicle-keys', source: 'vehicle', target: 'vehicle-keys' },
  { id: 'e-claim-geo', source: 'claim', target: 'claim-geo' },
  { id: 'e-claim-pumps', source: 'claim', target: 'claim-pumps' },
  { id: 'e-rewards-uso', source: 'rewards', target: 'rewards-uso' },
  { id: 'e-rewards-gas', source: 'rewards', target: 'rewards-gas' },
  { id: 'e-garage-lineup', source: 'garage', target: 'garage-lineup' },
  { id: 'e-garage-repair', source: 'garage', target: 'garage-repair' },
  { id: 'e-minimart-keys', source: 'minimart', target: 'minimart-keys' },
  { id: 'e-minimart-soon', source: 'minimart', target: 'minimart-soon' },
  { id: 'e-chop-merge', source: 'chop', target: 'chop-merge' },
  { id: 'e-atm-lock', source: 'atm', target: 'atm-lock' },
  { id: 'e-atm-early', source: 'atm', target: 'atm-early' },
  { id: 'e-social-mileage', source: 'social', target: 'social-mileage' },
  { id: 'e-social-ref', source: 'social', target: 'social-ref' },
  { id: 'e-proof-chain', source: 'proof', target: 'proof-chain' },
  { id: 'e-proof-dealership', source: 'proof', target: 'proof-dealership' },
]

/** Progression edges (player journey hints) — dashed */
export const journeyEdges: Edge[] = [
  {
    id: 'j-auth-wallet',
    source: 'auth',
    target: 'wallet',
    type: 'smoothstep',
    style: { strokeDasharray: '6 4', stroke: 'var(--text-dim)', opacity: 0.45 },
  },
  {
    id: 'j-wallet-fund',
    source: 'wallet',
    target: 'fund',
    type: 'smoothstep',
    style: { strokeDasharray: '6 4', stroke: 'var(--text-dim)', opacity: 0.45 },
  },
  {
    id: 'j-fund-vehicle',
    source: 'fund',
    target: 'vehicle',
    type: 'smoothstep',
    style: { strokeDasharray: '6 4', stroke: 'var(--text-dim)', opacity: 0.45 },
  },
  {
    id: 'j-vehicle-claim',
    source: 'vehicle',
    target: 'claim',
    type: 'smoothstep',
    style: { strokeDasharray: '6 4', stroke: 'var(--text-dim)', opacity: 0.45 },
  },
  {
    id: 'j-claim-rewards',
    source: 'claim',
    target: 'rewards',
    type: 'smoothstep',
    style: { strokeDasharray: '6 4', stroke: 'var(--text-dim)', opacity: 0.45 },
  },
]
