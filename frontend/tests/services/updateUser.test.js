import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { updateUserInfo } from "../../src/services/updateUser";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("gets user", () => {
    describe("updateUserInfo", () => {
        test("includes a token with its request", async () => {
            const username = "test username";
            const email = "test email";
            const password = "password";
            const profile_picture = "";
            const token = "testToken";


            fetch.mockResponseOnce(JSON.stringify({}), {
                status: 200,
            });

        await updateUserInfo(username, email, password, profile_picture, token);

        const fetchArguments = fetch.mock.lastCall;
        const url = fetchArguments[0];
        const options = fetchArguments[1];

        expect(url).toEqual(`${BACKEND_URL}/users`);
        expect(options.method).toEqual("PATCH");
        expect(options.headers["Authorization"]).toEqual("Bearer testToken");
        });

        test("rejects with an error if the status is not 200", async () => {
            const username = "test username";
            const email = "test email";
            const password = "password";
            const profile_picture = "";
            const token = "testToken";
            
        fetch.mockResponseOnce(
            JSON.stringify({}), { 
                status: 400 
        });

        try {
            await updateUserInfo(username, email, password, profile_picture, token);
        } catch (err) {
            expect(err.message).toEqual(`Received status 400 when updating details. Expected 200`);
        }
        });
    });
});
