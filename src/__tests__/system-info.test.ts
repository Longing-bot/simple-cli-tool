import { getSystemInfo, formatBytes, formatUptime } from '../system-info';

describe('System Info', () => {
  describe('getSystemInfo', () => {
    it('should return system information object', () => {
      const info = getSystemInfo();
      expect(info).toBeDefined();
      expect(info.platform).toBeDefined();
      expect(info.arch).toBeDefined();
      expect(info.nodeVersion).toBeDefined();
      expect(info.totalMemory).toBeGreaterThan(0);
      expect(info.freeMemory).toBeGreaterThanOrEqual(0);
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1.00 KB');
      expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
    });
  });

  describe('formatUptime', () => {
    it('should format seconds to human readable format', () => {
      expect(formatUptime(65)).toBe('1m 5s');
      expect(formatUptime(3665)).toBe('1h 1m 5s');
      expect(formatUptime(86400 + 3600 + 65)).toBe('1d 1h 1m 5s');
    });

    it('should handle edge cases', () => {
      expect(formatUptime(0)).toBe('0s');
      expect(formatUptime(59)).toBe('59s');
    });
  });
});