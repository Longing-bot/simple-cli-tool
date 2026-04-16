export interface ReportOptions {
    format: string;
    includeAll: boolean;
}
export declare class ReportGenerator {
    private systemInfo;
    generate(directory: string, options: ReportOptions): Promise<string>;
    private analyzeDirectory;
    private buildReportData;
    private formatTextReport;
    private formatFileTypeList;
    private formatEnvironment;
}
export declare function generateReport(format?: string, includeAll?: boolean): Promise<string>;
//# sourceMappingURL=report-generator.d.ts.map