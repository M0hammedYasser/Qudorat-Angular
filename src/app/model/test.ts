import {Project} from "./project";
import {TestManager} from "./test-manager";
import {SieveAnalysis} from "./sieve-analysis";
import {Asphalt} from "./asphalt";
import {CompressiveStrength} from "./compressive-strength";
import {AtterbergLimits} from "./atterberg-limits";
import {MoistureDensityRelationship} from "./moisture-density-relationship";

export interface Test {
approved: any;


  id: number;
  price: number
  paid: boolean;
  adopt: boolean;

  adopter: string;
  active: boolean;
  activist: string
  date: string;
  project: Project;
  testManager: TestManager;
  sieveAnalyses: SieveAnalysis[];
  asphalts: Asphalt[];
  compressiveStrengths: CompressiveStrength[];
  atterbergLimits: AtterbergLimits[];
  moistureDensityRelationships: MoistureDensityRelationship[];

  status: string;
  name: string;
}
