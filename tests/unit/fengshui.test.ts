import { describe, it, expect } from 'vitest';
import {
  calculateQuaiMenh,
  calculateBatTrach,
  getMountainByDegree,
  calculateFlyingStars,
} from '../../src/domain/fengshui';

describe('Phong Thủy Bát Trạch Domain Engine', () => {
  it('correctly calculates Quái Mệnh and East/West group', () => {
    // 1990 Male: 1 + 9 + 9 + 0 = 19 -> 1 + 9 = 10 -> rem = 1 -> 10 - 1 = 9 (Ly)
    const res1990M = calculateQuaiMenh(1990, true);
    expect(res1990M.quai).toBe('Ly');
    expect(res1990M.num).toBe(9);

    const bt = calculateBatTrach(1990, true);
    expect(bt.directions.length).toBe(8);
    expect(bt.mountain24.length).toBe(24);
    expect(['Đông Tứ Mệnh', 'Tây Tứ Mệnh']).toContain(bt.group);
  });

  it('correctly evaluates boundary degrees for 24 Mountains', () => {
    const boundaryDegrees = [0, 22.5, 45, 90, 180, 270, 359.999];

    for (const deg of boundaryDegrees) {
      const m = getMountainByDegree(deg);
      expect(m).toBeDefined();
      expect(m?.mountain).toBeDefined();
      expect(m?.direction).toBeDefined();
    }
  });

  it('correctly wraps Tý mountain across 352.5° to 7.5°', () => {
    const mNorth1 = getMountainByDegree(0);
    const mNorth2 = getMountainByDegree(355);
    const mNorth3 = getMountainByDegree(5);

    expect(mNorth1?.mountain).toBe('Tý');
    expect(mNorth2?.mountain).toBe('Tý');
    expect(mNorth3?.mountain).toBe('Tý');
  });

  it('correctly computes Huyền Không Phi Tinh for Period 9', () => {
    // Period 9, Facing Tý (0°), Sitting Ngọ (180°)
    const chart = calculateFlyingStars(9, 0);
    expect(chart.van).toBe(9);
    expect(chart.huongMountain.name).toBe('Tý');
    expect(chart.toaMountain.name).toBe('Ngọ');
    expect(chart.grid.length).toBe(3);
    expect(chart.grid[0].length).toBe(3);

    // Center palace has vanTinh = 9
    const center = chart.flatPalaces[5];
    expect(center).toBeDefined();
    expect(center.vanTinh).toBe(9);

    // Architectural pattern is recognized
    expect(chart.cachCuc).toBeDefined();
    expect(chart.cachCuc.name).toBeTruthy();
    expect(chart.detailsByPalace.length).toBeGreaterThan(0);
  });
});
