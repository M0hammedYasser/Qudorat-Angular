import {Test} from "./test";


export interface CompressiveStrength {
clientCode: any;

  id: number;

  projectName: string; //from DB
  company: string; //input
  location: string; //from DB
  dataCasting: string; //input
  dataReceived: string; //input
  dateTested: number; //input ----- Day only
  labreportNo: string; //input
  typeofSample: string; //input
  structure: string; //input
  sampleBy: string; //input
  slump: number; //input
  temperature: number; //input
  reqstrengthKg: number; //input
  sampleNo: string; //input

  sampleNOA: number;
  sampleNOB: number;
  sampleNOC: number;
  sampleNOD: number;
  sampleNOE: number;
  sampleNOF: number;

  diaA: number;
  diaB: number;
  diaC: number;
  diaD: number;
  diaE: number;
  diaF: number;

  lengthA: number;
  lengthB: number;
  lengthC: number;
  lengthD: number;
  lengthE: number;
  lengthF: number;

  weightSampleA: number;
  weightSampleB: number;
  weightSampleC: number;
  weightSampleD: number;
  weightSampleE: number;
  weightSampleF: number;

  testLoadknA: number;
  testLoadknB: number;
  testLoadknC: number;
  testLoadknD: number;
  testLoadknE: number;
  testLoadknF: number;

  testLoadkgA: number;
  testLoadkgB: number;
  testLoadkgC: number;
  testLoadkgD: number;
  testLoadkgE: number;
  testLoadkgF: number;

  expAvgA: string;
  expAvgB: string;
  expAvgC: string;
  expAvgD: string;
  expAvgE: string;
  expAvgF: string;




  testName: string;
  adopter: string;

  classification: string;
  sampleDate: string;
  testingDate: string;
  clientName: string;
  testBy: string;
  notes: string;
  approveBy: string;
  lastApproveBy: string;
  activist: string;
  nameOfTest: string;
  consultant: string;
  owner: string;

  cementContent: number;
  cementContentType: string;
  specTwintyEightDayStrength: number;
  diameter: number;
  height: number;
  dateCast: string;
  dateReceived: string;
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