export const getPercentageColor = (percentage: number) => {
    if (percentage < 0) {
        return "green";
    } else if (percentage < 25) {
        return "darkgreen";
    } else if (percentage < 50) {
        return "yellowgreen";
    } else if (percentage < 75) {
        return "darkorange";
    } else if (percentage < 90) {
        return "orangered";
    }
    return "red";
};