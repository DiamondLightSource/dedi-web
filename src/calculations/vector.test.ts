import { expect, test } from "vitest";
import Vector2D from "./vector";


test('Vector inplace addition', () => {
    const vector1 = new Vector2D(1, 1)
    const vector2 = new Vector2D(1, 1)
    vector1.add(vector2)
    expect(vector1.equals(new Vector2D(2, 2)))
})

test('Vector scale addition', () => {
    const vector1 = new Vector2D(2, 3)
    vector1.scale(2)
    expect(vector1.equals(new Vector2D(4, 6)))
})

test("Vector length", () => {
    const vector1 = new Vector2D(2, 2)
    expect(vector1.length()).toBe(2.8284271247461903);
})