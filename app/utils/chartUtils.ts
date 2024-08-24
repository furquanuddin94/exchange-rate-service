export const getTimeLabel = (timestamp: number, granularityInMinutes: number): string => {
    "use client";
    const date = new Date(timestamp);
    let options: Intl.DateTimeFormatOptions;

    if (granularityInMinutes < (24 * 60)) {
        options = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' };
    } else {
        options = { day: 'numeric', month: 'short' };
    }

    return date.toLocaleDateString('en-US', options);
};
