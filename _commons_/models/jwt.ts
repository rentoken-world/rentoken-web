import { Status } from "./status";

export type JWT = {
    userId: string;
    address: string;
    name: string;
    planId: string;
    status: Status;
}