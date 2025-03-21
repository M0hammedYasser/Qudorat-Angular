import {Project} from "./project";
import {TestManager} from "./test-manager";
import {SieveAnalysis} from "./sieve-analysis";

export interface Test {

  id: number;
  price: number
  paid: boolean;
  adopt : boolean;

  adopter : string;
  active: boolean;
  date: string;
  project: Project;
  testManager: TestManager;
  sieveAnalyses : SieveAnalysis[];
}
