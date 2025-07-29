import {Authority} from "./authority";

export interface User {

  id: number;
  name: string;
  username: string;
  jobTitle: string;
  password: string;
  isActive: number;
  authority: Authority;
  image : Image;
}

export interface Image {
  path: string;
}
