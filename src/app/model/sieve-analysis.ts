import {Test} from "./test";

export interface SieveAnalysis {


  id: number;
  totalWeigh: number;
  materialType: string;
  sampleBy: string;
  testingDate: string;
  samplingDate: string;
  clientName: string;
  projectName: string;
  testName: string;
  testBy: string;
  approveBy: string;
  activist: string;
  notes: string;

  massRetainedA: number;
  massRetainedB: number;
  massRetainedC: number;
  massRetainedD: number;
  massRetainedE: number;
  massRetainedF: number;
  massRetainedG: number;
  massRetainedH: number;
  massRetainedI: number;
  massRetainedJ: number;
  massRetainedK: number;
  massRetainedL: number;
  massRetainedM: number;

  passingA: number;
  passingB: number;
  passingC: number;
  passingD: number;
  passingE: number;
  passingF: number;
  passingG: number;
  passingH: number;
  passingI: number;
  passingJ: number;
  passingK: number;
  passingL: number;
  passingM: number;

  retainedA: number;
  retainedB: number;
  retainedC: number;
  retainedD: number;
  retainedE: number;
  retainedF: number;
  retainedG: number;
  retainedH: number;
  retainedI: number;
  retainedJ: number;
  retainedK: number;
  retainedL: number;
  retainedM: number;


  test: Test;
}
