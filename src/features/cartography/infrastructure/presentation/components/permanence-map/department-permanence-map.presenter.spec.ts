import { ListCnfsByDepartmentUseCase } from '../../../../use-cases';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CnfsByDepartment, Coordinates } from '../../../../core';
import { MarkerKey } from '../../../configuration';
import { DEPARTMENT_ZOOM_LEVEL, REGION_ZOOM_LEVEL } from '../../helpers/map-constants';
import { CnfsByDepartmentFeatureCollection, DepartmentPermanenceMapPresenter } from './department-permanence-map.presenter';
import { CnfsByRegionFeatureCollection } from './region-permanence-map.presenter';
import { MapChange } from './permanence-map.utils';

const LIST_CNFS_BY_DEPARTMENT_USE_CASE: ListCnfsByDepartmentUseCase = {
  execute$(): Observable<CnfsByDepartment[]> {
    return of([
      new CnfsByDepartment(new Coordinates(46.099798450280282, 5.348666025399395), {
        boundingZoom: 10,
        code: '01',
        count: 12,
        department: 'Ain'
      }),
      new CnfsByDepartment(new Coordinates(-12.820655090736881, 45.147364453253317), {
        boundingZoom: 10,
        code: '976',
        count: 27,
        department: 'Mayotte'
      })
    ]);
  }
} as ListCnfsByDepartmentUseCase;

describe('region permanence map presenter', (): void => {
  it('should display cnfs grouped by department markers at the department zoom level', async (): Promise<void> => {
    const expectedCnfsByDepartmentFeatures: CnfsByDepartmentFeatureCollection = {
      features: [
        {
          geometry: {
            coordinates: [5.348666025399395, 46.09979845028028],
            type: 'Point'
          },
          properties: {
            boundingZoom: 10,
            code: '01',
            count: 12,
            department: 'Ain',
            markerType: MarkerKey.CnfsByDepartment
          },
          type: 'Feature'
        },
        {
          geometry: {
            coordinates: [45.14736445325332, -12.820655090736881],
            type: 'Point'
          },
          properties: {
            boundingZoom: 10,
            code: '976',
            count: 27,
            department: 'Mayotte',
            markerType: MarkerKey.CnfsByDepartment
          },
          type: 'Feature'
        }
      ],
      type: 'FeatureCollection'
    };

    const departmentPermanenceMapPresenter: DepartmentPermanenceMapPresenter = new DepartmentPermanenceMapPresenter(
      LIST_CNFS_BY_DEPARTMENT_USE_CASE
    );

    const mapChange: MapChange = [
      {
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      },
      false
    ];

    const visibleMapPointsOfInterest: CnfsByDepartmentFeatureCollection = await firstValueFrom(
      departmentPermanenceMapPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByDepartmentFeatures);
  });

  it('should not display cnfs grouped by department markers at other zoom level than department', async (): Promise<void> => {
    const expectedCnfsByRegionFeatures: CnfsByRegionFeatureCollection = {
      features: [],
      type: 'FeatureCollection'
    };

    const departmentPermanenceMapPresenter: DepartmentPermanenceMapPresenter = new DepartmentPermanenceMapPresenter(
      LIST_CNFS_BY_DEPARTMENT_USE_CASE
    );

    const mapChange: MapChange = [
      {
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: REGION_ZOOM_LEVEL
      },
      false
    ];

    const visibleMapPointsOfInterest: CnfsByDepartmentFeatureCollection = await firstValueFrom(
      departmentPermanenceMapPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByRegionFeatures);
  });

  it('should not display cnfs grouped by department markers when forced to display cnfs', async (): Promise<void> => {
    const expectedCnfsByRegionFeatures: CnfsByRegionFeatureCollection = {
      features: [],
      type: 'FeatureCollection'
    };

    const departmentPermanenceMapPresenter: DepartmentPermanenceMapPresenter = new DepartmentPermanenceMapPresenter(
      LIST_CNFS_BY_DEPARTMENT_USE_CASE
    );

    const mapChange: MapChange = [
      {
        viewport: [-3.8891601562500004, 39.30029918615029, 13.557128906250002, 51.56341232867588],
        zoomLevel: DEPARTMENT_ZOOM_LEVEL
      },
      true
    ];

    const visibleMapPointsOfInterest: CnfsByDepartmentFeatureCollection = await firstValueFrom(
      departmentPermanenceMapPresenter.markers$(mapChange)
    );

    expect(visibleMapPointsOfInterest).toStrictEqual(expectedCnfsByRegionFeatures);
  });
});
