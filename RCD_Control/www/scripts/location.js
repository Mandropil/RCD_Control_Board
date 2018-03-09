function check_loc_permissions() {
    var permissions = cordova.plugins.permissions;
    permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, loc_success, loc_error);
    function loc_error() {
        console.warn('Location permission is not turned on');
        return false;
    }
    function loc_success(status) {
        if (!status.hasPermission) error();
        return true;
    }
}
