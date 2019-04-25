var helper = {};

helper.getExtention = function (mime) {
    if (mime == 'image/jpeg' || mime == 'image/jpg')
        return '.jpg';

    if (mime == 'image/png')
        return '.png';

    if (mime == 'application/pdf')
        return '.pdf';

    return null;
}

module.exports = helper;