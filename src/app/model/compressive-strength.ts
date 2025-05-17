import {Test} from "./test";


export interface CompressiveStrength {

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
  activist: string;
  nameOfTest: string;
  consultant: string;
  owner: string;
  location: string;
  sampleNo: string;

  cementContent: number;
  cementContentType: string;
  specTwintyEightDayStrength: number;
  diameter: number;
  height: number;
  dateCast: string;
  dateReceived: string;
  dateTested: string;
  slump: number;
  airTemperature: number;
  concreteTemperature: number;

  sampleAAge: number;
  sampleBAge: number;
  sampleCAge: number;
  sampleDAge: number;
  sampleEAge: number;
  sampleFAge: number;
  weightA: number;
  weightB: number;
  weightC: number;
  weightD: number;
  weightE: number;
  weightF: number;
  loadA: number;
  loadB: number;
  loadC: number;
  loadD: number;
  loadE: number;
  loadF: number;
  fractureA: number;
  fractureB: number;
  fractureC: number;
  fractureD: number;
  fractureE: number;
  fractureF: number;

  test: Test;
}
