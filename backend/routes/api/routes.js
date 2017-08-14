module.exports = function (app) {
    return {
        userRoutes: require('./userRoutes')(app),
        loginRoutes: require('./loginRoutes')(app),
        logoutRoutes: require('./logoutRoutes')(app),
        oAuthRoutes: require('./oAuthRoutes')(app),
        passRoutes: require('./passwordRoutes')(app),
        exerciseTypeRoutes: require('./exerciseTypeRoutes')(app),
        couchRoutes: require('./couchRoutes')(app),
        fileRoutes: require('./fileRoutes')(app),
        sportRoutes: require('./sportRoutes')(app)
    };
};
