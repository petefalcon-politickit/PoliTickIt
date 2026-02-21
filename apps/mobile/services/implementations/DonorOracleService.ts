import {
    DonorOracleResult,
    IDonorOracleService,
    ImpactZone,
} from "../interfaces/IDonorOracleService";
import { IRepresentativeRepository } from "../interfaces/IRepresentativeRepository";

export class DonorOracleService implements IDonorOracleService {
  private representativeRepository: IRepresentativeRepository;

  constructor({
    representativeRepository,
  }: {
    representativeRepository: IRepresentativeRepository;
  }) {
    this.representativeRepository = representativeRepository;
  }

  private impactZones: Record<string, ImpactZone> = {
    A: {
      sectorCode: "A",
      sectorName: "Agribusiness",
      associatedCommittees: [
        "Agriculture",
        "Agriculture, Nutrition, and Forestry",
      ],
      interestArea: "Economics",
    },
    C: {
      sectorCode: "C",
      sectorName: "Communications/Electronics",
      associatedCommittees: [
        "Energy and Commerce",
        "Commerce, Science, and Transportation",
      ],
      interestArea: "Infrastructure",
    },
    D: {
      sectorCode: "D",
      sectorName: "Defense",
      associatedCommittees: [
        "Armed Services",
        "Foreign Relations",
        "Foreign Affairs",
      ],
      interestArea: "Accountability",
    },
    E: {
      sectorCode: "E",
      sectorName: "Construction",
      associatedCommittees: [
        "Transportation and Infrastructure",
        "Environment and Public Works",
      ],
      interestArea: "Infrastructure",
    },
    H: {
      sectorCode: "H",
      sectorName: "Health",
      associatedCommittees: [
        "Energy and Commerce",
        "Health, Education, Labor, and Pensions",
        "Ways and Means",
      ],
      interestArea: "Civic Dividend",
    },
    N: {
      sectorCode: "N",
      sectorName: "Energy/Resources",
      associatedCommittees: [
        "Energy and Natural Resources",
        "Energy and Commerce",
        "Natural Resources",
      ],
      interestArea: "Infrastructure",
    },
    F: {
      sectorCode: "F",
      sectorName: "Finance/Insurance/Real Estate",
      associatedCommittees: [
        "Financial Services",
        "Banking, Housing, and Urban Affairs",
        "Ways and Means",
      ],
      interestArea: "Economics",
    },
    K: {
      sectorCode: "K",
      sectorName: "Lawyers and Lobbyists",
      associatedCommittees: ["Judiciary", "Rules", "Ethics"],
      interestArea: "Ethics",
    },
  };

  async evaluateInfluence(
    sector: string,
    representativeId: string,
  ): Promise<DonorOracleResult> {
    const zone = this.impactZones[sector];

    if (!zone) {
      return {
        jurisdictionMatch: false,
        multiplier: 1.0,
        impactZone: {
          sectorCode: sector || "UNKNOWN",
          sectorName: "General Industry",
          associatedCommittees: [],
          interestArea: "Accountability",
        },
        explanation:
          "No direct jurisdictional overlap identified for this sector.",
      };
    }

    const representative =
      await this.representativeRepository.getRepresentativeById(
        representativeId,
      );
    const repCommittees = representative?.committees || [];

    const hasMatch = zone.associatedCommittees.some((c: string) =>
      repCommittees.some(
        (rc: string) =>
          rc.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(rc.toLowerCase()),
      ),
    );

    return {
      jurisdictionMatch: hasMatch,
      multiplier: hasMatch ? 1.5 : 1.0,
      impactZone: zone,
      explanation: hasMatch
        ? `HIGH STRATEGIC OVERLAP: Contributor sector '${zone.sectorName}' directly correlates with the official's assignment on the ${repCommittees.find((rc: string) => zone.associatedCommittees.some((c: string) => rc.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(rc.toLowerCase())))} committee.`
        : `General contribution from the ${zone.sectorName} sector. No direct committee jurisdiction identified.`,
    };
  }

  getAssociatedCommittees(sector: string): string[] {
    return this.impactZones[sector]?.associatedCommittees || [];
  }
}
