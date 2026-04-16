"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_info_1 = require("../system-info");
describe('System Info', () => {
    describe('getSystemInfo', () => {
        it('should return system information object', () => {
            const info = (0, system_info_1.getSystemInfo)();
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
            expect((0, system_info_1.formatBytes)(0)).toBe('0 B');
            expect((0, system_info_1.formatBytes)(1024)).toBe('1.00 KB');
            expect((0, system_info_1.formatBytes)(1024 * 1024)).toBe('1.00 MB');
            expect((0, system_info_1.formatBytes)(1024 * 1024 * 1024)).toBe('1.00 GB');
        });
    });
    describe('formatUptime', () => {
        it('should format seconds to human readable format', () => {
            expect((0, system_info_1.formatUptime)(65)).toBe('1m 5s');
            expect((0, system_info_1.formatUptime)(3665)).toBe('1h 1m 5s');
            expect((0, system_info_1.formatUptime)(86400 + 3600 + 65)).toBe('1d 1h 1m 5s');
        });
        it('should handle edge cases', () => {
            expect((0, system_info_1.formatUptime)(0)).toBe('0s');
            expect((0, system_info_1.formatUptime)(59)).toBe('59s');
        });
    });
});
//# sourceMappingURL=system-info.test.js.map