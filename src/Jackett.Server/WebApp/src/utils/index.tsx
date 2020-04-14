import moment from "moment";

export function jackettTimespan(date: string) {
    const now = moment();
    const from = moment(date);
    const timeSpan = moment.duration(now.diff(from));

    const minutes = timeSpan.asMinutes();
    if (minutes < 120) {
        return Math.round(minutes) + 'm ago';
    }

    const hours = timeSpan.asHours();
    if (hours < 48) {
        return Math.round(hours) + 'h ago';
    }

    const days = timeSpan.asDays();
    if (days < 365) {
        return Math.round(days) + 'd ago';
    }

    const years = timeSpan.asYears();
    return Math.round(years) + 'y ago';
}
