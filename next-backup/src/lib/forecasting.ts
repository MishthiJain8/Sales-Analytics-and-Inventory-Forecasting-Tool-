import { SalesData } from '@/lib/mockData';

export interface PredictionPoint {
    date: string;
    predictedRevenue: number;
}

/**
 * Simple Linear Regression for revenue prediction
 * y = mx + b
 */
export const predictSales = (data: SalesData[], horizonMonths: number): PredictionPoint[] => {
    if (data.length < 2) return [];

    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    data.forEach((d, i) => {
        sumX += i;
        sumY += d.revenue;
        sumXY += i * d.revenue;
        sumX2 += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictions: PredictionPoint[] = [];
    const lastDateStr = data[data.length - 1].date;
    const lastDateParts = lastDateStr.split(' '); // "MMM yyyy"
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let currentMonthIndex = monthNames.indexOf(lastDateParts[0]);
    let currentYear = parseInt(lastDateParts[1]);

    for (let i = 1; i <= horizonMonths; i++) {
        const x = n + i - 1;
        // Add some random variance (±5%)
        const variance = 1 + (Math.random() * 0.1 - 0.05);
        const predictedRevenue = Math.max(0, (slope * x + intercept) * variance);

        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0;
            currentYear++;
        }

        predictions.push({
            date: `${monthNames[currentMonthIndex]} ${currentYear}`,
            predictedRevenue: Math.floor(predictedRevenue),
        });
    }

    return predictions;
};
