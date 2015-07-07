beforeEach(function() {
    jasmine.clock().install();

    jasmine.getFixtures().fixturesPath = 'base/spec/';
    jasmine.getStyleFixtures().fixturesPath = 'base/spec/';
});

afterEach(function() {
    jasmine.clock().uninstall();
});
