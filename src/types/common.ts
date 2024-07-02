export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IServerData<T = any> {
  success: boolean;
  result: T | null;
  message: string | any[];
  keyValue?: string | string[];
}
