import {Test} from "./test";

export interface SieveAnalysis {

  clay: string;
  silt: string;
  sand: string;
  gravel: string;


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
  adopter: string;
  lastApproveBy: string;
  activist: string;
  notes: string;

  nameOfTest: string;
  consultant: string;
  owner: string;
  location: string;
  sampleNo: string;

  individualA: number;
  individualB: number;
  individualC: number;
  individualD: number;
  individualE: number;
  individualF: number;
  individualG: number;
  individualH: number;
  individualI: number;
  individualJ: number;
  individualK: number;
  individualL: number;
  individualM: number;


  cumulativeA: number;
  cumulativeB: number;
  cumulativeC: number;
  cumulativeD: number;
  cumulativeE: number;
  cumulativeF: number;
  cumulativeG: number;
  cumulativeH: number;
  cumulativeI: number;
  cumulativeJ: number;
  cumulativeK: number;
  cumulativeL: number;
  cumulativeM: number;

  /**
   * @author mohamed yasser
   * @date 9/1/2025
   */
  specificationLimitsA:string;
  specificationLimitsB:string;
  specificationLimitsC:string;
  specificationLimitsD:string;
  specificationLimitsE:string;
  specificationLimitsF:string;
  specificationLimitsG:string;
  specificationLimitsH:string;
  specificationLimitsI:string;
  specificationLimitsJ:string;
  specificationLimitsK:string;
  specificationLimitsL:string;
  specificationLimitsM:string;

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

  expandA: string;
  expandB: string;
  expandC: string;
  expandD: string;
  expandE: string;
  expandF: string;
  expandG: string;
  expandH: string;
  expandI: string;
  expandJ: string;
  expandK: string;
  expandL: string;
  expandM: string;


  test: Test;
  [key: string]: any;

  /**
   * @author mohamed yasser
   */
  clientCode: string;
  projectCode: string;
  testCode: string;
  reportDate: string;
  sourceOfSample  : string; // in Form required
  description  : string;// in Form required



}
