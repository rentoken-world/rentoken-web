export enum Status {
    NEW = 1, // not active yet
    BLOCKED = 2, // active but with pendent payment. Can do login but goes to payment page
    BANNED = 3,
    ACTIVE = 4
}