export interface IReputation {
    id: string;
    enterprise_id?: string;
    number_of_blacklist: number;
    number_of_ban: number;
    prestige_score: number;
    enterprise?: { id: string; name: string };
}