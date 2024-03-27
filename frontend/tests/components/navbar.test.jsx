import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from "vitest";
import { getAllUserInfo } from '../../src/services/user';

import Navbar from '../../src/components/Navbar/Navbar'; 

vi.mock("../../src/services/user", () => {
    const getAllUserInfoMock = vi.fn();
    return { getAllUserInfo: getAllUserInfoMock};
})

describe('Navbar Component', () => {
    test('renders with no user information', () => {
        render(
            <Router>
                <Navbar/>
            </Router>
            );
        
        const greeting = screen.getByTestId("user-greeting");
        expect(greeting.textContent).toEqual("Hi You");
        })

    test('renders with user informatio when a token is present', async () => {
        window.localStorage.setItem("token", "testToken");
        const getAllUserInfoMock = [{ _id: "123", username: "Test user", profile_picture: "/path/to/profile_pic.jpg"}];
        getAllUserInfo.mockResolvedValue({ user: getAllUserInfoMock, token:"newtoken"});
        
        render(
            <Router>
                <Navbar/>
            </Router>
            );
        
            waitFor(() => {
                const username = screen.getByTestId("user-greeting");
                expect(username.textContent).toEqual("Hi Test user");

                const profilePicture1 = screen.getByAltText("Profile Picture");
                expect(profilePicture1).toBeInTheDocument();
                expect(profilePicture1).toHaveAttribute('src', 'test.jpg');


                const dropDownPic = screen.getByAltText('Profile Picture');
                userEvent.click(dropDownPic);
                const dropdownMenu = screen.getByRole('menu');
                expect(dropdownMenu).toHaveClass('show');

            });

    
});


});
