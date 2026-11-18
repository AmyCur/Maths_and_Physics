export const Random = {
    RandInt(lowerBound, upperBound){
        lowerBound = Math.ceil(lowerBound);
        upperBound = Math.floor(upperBound);
        return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
    }
}