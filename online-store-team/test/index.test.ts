/* eslint-disable @typescript-eslint/no-var-requires */
import Cart from "../src/components/model/Cart";
function sum(i: number, j: number): number {
    return i + j;
}
describe("when given 2 numbers", () => {
    it("returns the result of dividing the first by the second", () => {
        console.log(new Cart().actualPrice);
        const result = sum(10, 5);
        const expected = 15;
        expect(result).toEqual(expected);
    });
});
