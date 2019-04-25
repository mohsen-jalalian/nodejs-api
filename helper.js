var ex = {};

ex.addDays = function (days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

ex.generateRandomNumber = function(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports = ex;