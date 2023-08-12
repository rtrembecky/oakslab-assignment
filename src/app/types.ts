// I rely on the fact that the order of keys in object is preserved
export type Steps = Record<string, boolean>

export type Stages = Record<string, Steps>

export type Storage = Stages
