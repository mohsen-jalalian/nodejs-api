var jalalify = {};

var g_days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var j_days_in_month = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);

jalalify.gregorian_to_jalali = function (g /* array containing year, month, day*/) {
    var gy, gm, gd;
    var jy, jm, jd;
    var g_day_no, j_day_no;
    var j_np;

    var i;

    gy = g[0] - 1600;
    gm = g[1] - 1;
    gd = g[2] - 1;

    g_day_no = 365 * gy + div((gy + 3), 4) - div((gy + 99), 100) + div((gy + 399), 400);
    for (i = 0; i < gm; ++i)
        g_day_no += g_days_in_month[i];
    if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
    /* leap and after Feb */
        ++g_day_no;
    g_day_no += gd;

    j_day_no = g_day_no - 79;

    j_np = div(j_day_no, 12053);
    j_day_no = remainder(j_day_no, 12053);

    jy = 979 + 33 * j_np + 4 * div(j_day_no, 1461);
    j_day_no = remainder(j_day_no, 1461);

    if (j_day_no >= 366) {
        jy += div((j_day_no - 1), 365);
        j_day_no = remainder((j_day_no - 1), 365);
    }

    for (i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
        j_day_no -= j_days_in_month[i];
    }
    jm = i + 1;
    jd = j_day_no + 1;

    return new Array(jy, jm, jd);
}

jalalify.jalali_to_gregorian = function (j /* array containing year, month, day*/) {
    var gy, gm, gd;
    var jy, jm, jd;
    var g_day_no, j_day_no;
    var leap;

    var i;

    jy = j[0] - 979;
    jm = j[1] - 1;
    jd = j[2] - 1;

    j_day_no = 365 * jy + div(jy, 33) * 8 + div((remainder(jy, 33) + 3), 4);
    for (i = 0; i < jm; ++i)
        j_day_no += j_days_in_month[i];

    j_day_no += jd;

    g_day_no = j_day_no + 79;

    gy = 1600 + 400 * div(g_day_no, 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no = remainder(g_day_no, 146097);

    leap = 1;
    if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
        g_day_no--;
        gy += 100 * div(g_day_no, 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no = remainder(g_day_no, 36524);

        if (g_day_no >= 365)
            g_day_no++;
        else
            leap = 0;
    }

    gy += 4 * div(g_day_no, 1461); /* 1461 = 365*4 + 4/4 */
    g_day_no = remainder(g_day_no, 1461);

    if (g_day_no >= 366) {
        leap = 0;

        g_day_no--;
        gy += div(g_day_no, 365);
        g_day_no = remainder(g_day_no, 365);
    }

    for (i = 0; g_day_no >= g_days_in_month[i] + (i == 1 && leap) ; i++)
        g_day_no -= g_days_in_month[i] + (i == 1 && leap);
    gm = i + 1;
    gd = g_day_no + 1;

    return new Array(gy, gm, gd);
}

jalalify.jalali_today = function () {
    Today = new Date();
    j = this.gregorian_to_jalali(new Array(
        Today.getFullYear(),
        Today.getMonth() + 1,
        Today.getDate()
    ));
    return j[2] + "/" + j[1] + "/" + j[0];
}

jalalify.jalali_today_date_time = function () {
    Today = new Date();
    j = this.gregorian_to_jalali(new Array(
        Today.getFullYear(),
        Today.getMonth() + 1,
        Today.getDate()
    ));
    j.push(Today.getHours());
    j.push(Today.getMinutes());
    j.push(Today.getSeconds());
    
    return this.fix_jalali_date_time(j);
}

jalalify.toFaDigit = function  (value) {
    return value.replace(/\./g, String.fromCharCode(1643)).replace(/\d+/g, function (digit) {
        var ret = '';
        for (var i = 0, len = digit.length; i < len; i++) {
            ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
        }
        return ret;
    });
};

jalalify.getDateParams = function (dateTimeString) {
    var date = new Date(dateTimeString);
    var year    = date.getFullYear();
    var month   = date.getMonth()+1; 
    var day     = date.getDate();
    var hour    = date.getHours();
    var minute  = date.getMinutes();
    var second  = date.getSeconds();

    return [year, month, day, hour, minute, second];
}

jalalify.fix_gregorian_date = function(j)
{
    return j[0] + "-" + j[1] + "-" + j[2];
}

jalalify.fix_jalali_date = function(j)
{
    if (j[1].toString().length == 1)
        j[1] = '0' + j[1];
    if (j[2].toString().length == 1)
        j[2] = '0' + j[2];
    return j[0] + "/" + j[1] + "/" + j[2];
}

jalalify.fix_jalali_date_time = function (j) {
    if (j[1].toString().length == 1)
        j[1] = '0' + j[1];
    if (j[2].toString().length == 1)
        j[2] = '0' + j[2];
    if (j[3].toString().length == 1)
        j[3] = '0' + j[3];
    if (j[4].toString().length == 1)
        j[4] = '0' + j[4];
    if (j[5].toString().length == 1)
        j[5] = '0' + j[5];
    return j[0] + "/" + j[1] + "/" + j[2] + " " + j[3] + ":" + j[4] + ":" + j[5];
}

jalalify.convertGregorianToJalali = function (g){
    var params = this.getDateParams(g);
    var jalaliDateTime = this.fix_jalali_date(this.gregorian_to_jalali(params));

    return jalaliDateTime;
}

jalalify.convertJalaliToGregorian = function (j){
    var params = j.split('/');
    var dateTime = this.fix_gregorian_date(this.jalali_to_gregorian(params));

    return dateTime;
}

function div(a, b) {
    return Math.floor(a / b);
}

function remainder(a, b) {
    return a - div(a, b) * b;
}

module.exports = jalalify;