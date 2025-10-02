import {Test} from "./test";
import {GradationTest} from "./gradation-test";
import {Bitumen} from "./bitumen";

export interface Asphalt {
  contractor: string;
  sampleType: string;
  jobOrder: number;
  requestDescription: string;
  asphaltLayer: string;
  equipmentUsed: string;
  remarks: string;

  clientName: string;
  projectName: string;
  activist: string;
  approveBy: string;
  adopter: string;
  lastApproveBy: string;

  id: number;
  sampleBy: string;
  sampleDate: string;
  testBy: string
  testingDate: string;
  classification: string;
  notes: string;
  nameOfTest: string;
  consultant: string;
  owner: string;
  location: string;
  sampleNo: string;

  asphaltType: string;
  asphaltApplier: string;

  voidsinmineralaggLimits: string;
  airvoidsLimits: string;
  bitumencontentLimits: string;
  lossofstabilitykgmLimits: string;
  voidsfilledwithaspLimits: string;
  maxdensityasperdesignLimits: string;
  flowLimits: string;
  lossOfStabilityLimits: string;

  voidsfilledwithasplimitsInput: string;
  maxdensityasperdesignlimitsInput: string;

  weightAirDryA: number;
  weightAirDryB: number;
  weightAirDryC: number;
  weightAirDryD: number;
  weightAirDryE: number;
  weightAirDryF: number;

  weightWaterA: number;
  weightWaterB: number;
  weightWaterC: number;
  weightWaterD: number;
  weightWaterE: number;
  weightWaterF: number;

  weightAirSurfDryA: number;
  weightAirSurfDryB: number;
  weightAirSurfDryC: number;
  weightAirSurfDryD: number;
  weightAirSurfDryE: number;
  weightAirSurfDryF: number;

  stabilityA: number;
  stabilityB: number;
  stabilityC: number;
  stabilityD: number;
  stabilityE: number;
  stabilityF: number;

  correctionFactorA: number;
  correctionFactorB: number;
  correctionFactorC: number;
  correctionFactorD: number;
  correctionFactorE: number;
  correctionFactorF: number;


  stability24HrsD: number;
  stability24HrsE: number;
  stability24HrsF: number;

  flowA: number;
  flowB: number;
  flowC: number;


  percofbitExpand: string;
  bulkspofcompMixExpand: string;
  maxspofpavgmixExpand: string;
  airvoidExpand: string;
  voidmineralExpand: string;
  voidfilledExpand: string;
  effectiveaspExpand: string;
  avgstabilityfor30minExpand: string;
  lossofstabilityExpand: string;
  avgflowExpand: string;
  voidMineral: number;
  voidFilled: number;
  netWeightOfLooseMix: number;
  netWeightOfFlaskWater: number;
  weightFlaskWaterSample: number;
  spGravityOfAspBit: number;
  bulkSpGrCombAgg: number;



  maxSpOfPAvgMixNote: string;
  airVoidNote: string;
  voidMineralNote: string;
  voidFilledNote: string;
  avgStabilityFor30MinNote: string;
  lossOfStabilityNote: string;
  avgFlowNote: string;


  

  gradationTest: GradationTest;

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

  bitumen: Bitumen

  test: Test;


}
