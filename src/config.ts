export const config = {
    tps: 60
}

export enum CollisionCategories {
    Unit = 1 << 1,
    Wall = 1 << 2,
    Item = 1 << 3,
    Ghost = 1 << 4
}