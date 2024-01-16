export type Data = {
  _id: string;
  data: string;
};

export type DataWithoutId = Omit<Data, '_id'>;
