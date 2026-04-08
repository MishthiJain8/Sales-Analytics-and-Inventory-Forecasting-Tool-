// In-memory data store
export let uploadedData = [];

export function addRecords(records) {
    uploadedData.push(...records);
    return { success: true, count: records.length, total: uploadedData.length };
}

export function getRecords() {
    return uploadedData;
}

export function clearRecords() {
    uploadedData = [];
}
