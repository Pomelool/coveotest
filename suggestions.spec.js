var suggestions = require('./suggestions');
var testPack = {
    q: 'London',
    longitude: -79.4163,
    latitude: 43.70011
}

describe("Suggestion method should give correct results", function () {
    it("returns array that has name matched", () => {
        var ret = await suggestions.getSuggestions(testPack);
        expect(ret.suggestions[0].name).toBe('London');
    });
    it("returns array that has alt name matched precisely", () => {
        testPack.q = 'YXU';
        var ret = await suggestions.getSuggestions(testPack);
        expect(ret.suggestions[0].name).toBe('London');
    });
});