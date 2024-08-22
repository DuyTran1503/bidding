export interface IBidBond {
    id: string;
    bidding_submissionId: string;
    bond_amount: number;
    bond_type: string;
    issuer: string;
    issue_date: Date;
    expiry_date: Date;
    is_active: boolean;
  }