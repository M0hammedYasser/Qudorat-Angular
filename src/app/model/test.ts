import {Project} from "./project";
import {TestManager} from "./test-manager";

export interface Test {

  id: number;
  price: number
  date: string
  project: Project;
  testManager: TestManager;
}
