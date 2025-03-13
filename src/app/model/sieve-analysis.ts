import {Test} from "./test";

export interface SieveAnalysis {

  id : number;
  totalWeigh : number;
  status : string;
  success : boolean;
  projectName : string;
  testName : string;

  massRetainedA: number;
  massRetainedB: number;
  massRetainedC: number;
  massRetainedD: number;
  massRetainedE: number;
  massRetainedF: number;
  massRetainedG: number;
  massRetainedH: number;

  retainedA: number;
  retainedB: number;
  retainedC: number;
  retainedD: number;
  retainedE: number;
  retainedF: number;
  retainedG: number;
  retainedH: number;
  rmassRetainedA: number;
  rmassRetainedB: number;
  rmassRetainedC: number;
  rmassRetainedD: number;
  rmassRetainedE: number;
  rmassRetainedF: number;
  rmassRetainedG: number;
  rmassRetainedH: number;

  cvcMinA: number;
  cvcMinB: number;
  cvcMinC: number;
  cvcMinD: number;
  cvcMinE: number;
  cvcMinF: number;
  cvcMinG: number;
  cvcMinH: number;

  cvcMaxA: number;
  cvcMaxB: number;
  cvcMaxC: number;
  cvcMaxD: number;
  cvcMaxE: number;
  cvcMaxF: number;
  cvcMaxG: number;
  cvcMaxH: number;

  test:Test;
}
