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

  cementContent: number;
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
  weightA: number;
  weightB: number;
  loadA: number;
  loadB: number;
  fractureA: number;
  fractureB: number;

  test : Test;
}
