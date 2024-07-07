export interface ILabel {
  id: string;
  name: string;
  color: string;
  ownerType: "user" | "project";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
