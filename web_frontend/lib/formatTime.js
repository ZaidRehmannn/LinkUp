// helper function to format date and time
export default function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
        { label: 'yr', seconds: 31536000 },
        { label: 'mo', seconds: 2592000 },
        { label: 'd', seconds: 86400 },
        { label: 'h', seconds: 3600 },
        { label: 'm', seconds: 60 },
        { label: 's', seconds: 1 },
    ];

    for (let i of intervals) {
        const count = Math.floor(seconds / i.seconds);
        if (count >= 1) {
            return `${count}${i.label} ago`;
        }
    }
    return 'just now';
};