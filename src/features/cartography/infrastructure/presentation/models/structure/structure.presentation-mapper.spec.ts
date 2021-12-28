import { MarkersPresentation } from "../cnfs";
import { Marker } from "../../../configuration";
import { markersPresentationToStructurePresentationArray } from "./structure.presentation-mapper";
import { StructurePresentation } from "./structure.presentation";

describe("structure presentation mapper", (): void => {
  it("should map a MarkersPresentation to a StructurePresentation[]", (): void => {
    const visibleMarkers: MarkersPresentation = {
      features: [
        {
          geometry: {
            coordinates: [0, 0],
            type: 'Point'
          },
          properties: {
            markerIconConfiguration: Marker.Cnfs
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const expectedStructurePresentation: StructurePresentation[] = [];

    expect(markersPresentationToStructurePresentationArray(visibleMarkers)).toStrictEqual(expectedStructurePresentation);
  });
});
