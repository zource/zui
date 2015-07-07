describe("basic alert", function() {
    beforeEach(function() {
        loadFixtures("alert/basic.html");
    });

    it("should be hidden when close is clicked", function() {
        spyOn($.fn, 'fadeOut');

        $('.zui-icon-x').click();

        expect($.fn.fadeOut).toHaveBeenCalled();
    });
});
