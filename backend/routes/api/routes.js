module.exports = function (app) {
    return {
        userRoutes: require('./userRoutes')(app),
        loginRoutes: require('./loginRoutes')(app),
        logoutRoutes: require('./logoutRoutes')(app),
        oAuthRoutes: require('./oAuthRoutes')(app),
        passRoutes: require('./passwordRoutes')(app),
        exerciseTypeRoutes: require('./exerciseTypeRoutes')(app),
        sportRoutes: require('./sportRoutes')(app),
        fileRoutes: require('./fileRoutes')(app),
        exerciseRoutes: require('./exerciseRoutes')(app),
        changePasswordRoutes: require('./changePasswordRoutes')(app),
        measurementRoutes: require('./measurementRoutes')(app),
        weightControlRoutes: require('./weightControlRoutes')(app),
        goalRoutes: require('./goalRoutes')(app),
        goalTypeRoutes: require('./goalTypeRoutes')(app),
        launchedTrainingRoutes: require('./launchedTrainingRoutes')(app),
        trainingPlanRoutes: require('./trainingPlanRoutes')(app),
        fakeDataRoutes: require('./fakeDataRoutes')(app),
        userGoalRoutes: require('./userGoalRoutes')(app),
        loadRoutes: require('./loadData/loadRoutes')(app),
    };
};
