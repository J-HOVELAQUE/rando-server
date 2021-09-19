interface ILocation {
  type?: "Point";
  coordinates: [number, number];
}

export default interface Place {
  name: string;
  mountainLocation: string;
  altitudeInMeters: number;
  picture?: string;
  city?: string;
  location: ILocation;
}
