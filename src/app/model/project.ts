import {Client} from "./client";
import {Test} from "./test";

export interface Project {

  id : number;
  projectName : string ;
  client : Client;
  tests : Test[];
  numberOfTests : number;
}
