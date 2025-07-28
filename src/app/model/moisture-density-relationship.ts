import {Test} from "./test";

export interface MoistureDensityRelationship {
clientCode: any;

  id: number;
  projectName: string;
  testName: string;
  adopter: string;

  classification: string;
  sampleBy: string;
  sampleDate: string;
  testingDate: string;
  clientName: string;
  testBy: string;
  notes: string;
  approveBy: string;
  lastApproveBy: string;
  activist: string;

  nameOfTest: number;
  consultant: string;
  owner: string;
  location: string;
  sampleNo: number;


  wetWtSoilMouldA: number;
  wetWtSoilMouldB: number;
  wetWtSoilMouldC: number;
  wetWtSoilMouldD: number;
  wetWtSoilMouldE: number;

  wtOfMould: number;
  volOfMould: number;
  wtOfRammer: number;
  noBlows: number;
  noOfLayers: number;

  wetWtSoilContA: number;
  wetWtSoilContB: number;
  wetWtSoilContC: number;
  wetWtSoilContD: number;
  wetWtSoilContE: number;

  dryWtSoilContA: number;
  dryWtSoilContB: number;
  dryWtSoilContC: number;
  dryWtSoilContD: number;
  dryWtSoilContE: number;

  wtOfContainerA: number;
  wtOfContainerB: number;
  wtOfContainerC: number;
  wtOfContainerD: number;
  wtOfContainerE: number;

  test: Test;
}
